const router = require("express").Router();
const { accountModel } = require("../models");
const { ApplicationError, DatabaseError } =
  require("../../../helper")("errorHandler");
const { verifyJwt } = require("../../../helper")("security");
const schema = require("../../../helper/schemaValidator");
const security = require("../../../helper/security");
const helper = require("../../../helper/responseHelper");
const {clearCurrentUser, getCurrentUser} = require("../../../helper/redis");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta");
require("dotenv").config();
const jwt = require('jsonwebtoken')
const redis = require('redis')
const client = redis.createClient()
const uploadImg = require('../../../helper/multer')

const logger = require("../../../helper/logger");

let message = ``;
let status = 500;

router.post("/user/register", async (req, res, next) => {
  try {
    let bodyData = req.body;

    await schema.registerUsrSchema.validateAsync(bodyData);

    const checkUser = await accountModel.checkUser(bodyData.username);
    
    if(checkUser.length>0){
      return next(new ApplicationError("Username already registered", 400));
    }

    let passwordEnc = await security.genBcrypt(bodyData.password, 10);
    bodyData.created_by = bodyData.username
    bodyData.password = passwordEnc
    bodyData.status_code = `ACTIVE`
    bodyData.username = bodyData.username.toLowerCase()
    const result = await accountModel.registerUser(bodyData);


    logger.infologger(req.method, req.originalUrl, JSON.stringify(req.body), JSON.stringify(checkUser), req.ip, moment().format("YYYY-MM-DD HH:mm:ss"));

    return helper.response(res,200,'Register Success',result, null);
  }catch(err){
    console.log(err);
    return next(new ApplicationError(message, status));
  }
})

router.post("/user/login", async (req, res, next) => {
  try {
    const reqBody = req.body;

    await schema.loginSchema.validateAsync(reqBody);

    const checkUser = await accountModel.checkUser(reqBody.username);
      if (checkUser.length<=0) {
        return next(new ApplicationError("Invalid Username or Password", 400));
      }

    const checkPass = await security.compareBcrypt(reqBody.password, checkUser[0].password);
    console.log(checkPass)
      if (!checkPass)
        return next(new ApplicationError("Invalid Username or Password", 400));

      const payload = {
        id: checkUser[0].id,
        username: checkUser[0].username,
        user_code: checkUser[0].user_code
      }
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' })
      const result = { ...payload, token }

      accountModel.upldateLoginStatus({ data: { login_status: 1, last_login: moment().format("YYYY-MM-DD HH:mm:ss") }, condition: { username: reqBody.username } })

    return helper.response(res,200,'Login Success',result);
  }catch(err){
    console.log(err)
    return next(new ApplicationError(message, status));
  }
})

router.post("/user/get-all", verifyJwt, async (req, res, next) => {
  try {
    
    const { username, login_status } = req.body
    let search = []
    let page = req.body.page || 1
    let limit = req.body.limit || 10
    let totalData = 0

    if(username){
      search.push(`username LIKE '%${username}%'`)
    }

    if(login_status){
      search.push(`login_status = ${login_status}`)
    }

    search.push(`status_code = 'ACTIVE'`)
    const countData =  await accountModel.countAllUSer();
  
    if (search.length>1) {
      page = 1
    }

    const offset = page * limit - limit

    const result = await accountModel.getAllUser(search,limit,offset);

    if(search.length>1){
      totalData = result.length    
    }else{
      totalData = parseInt(countData.count)
    }

    const totalPage = Math.ceil(totalData / limit)
    let currentPage = Math.floor(offset / limit) + 1;
    let hasPrev = currentPage > 1 ? true : false;
    let hasNext = currentPage >= totalPage ? false : true;
      
      const pageInfo = {
        page: page,
        totalData: totalPage,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
        hasPrev: hasPrev,
        hasNext: hasNext
        
      }
      const newResult = {
        data : result,
        pageInfo
      }

    return helper.response(res,200,'Get Data User Success',newResult);
  }catch(err){
    console.log(err)
    return next(new ApplicationError(message, status));
  }
})

router.get("/user/current", verifyJwt, getCurrentUser, async (req, res, next) => {
  try {
    const result = await accountModel.checkUser(req.decodeToken.username);
    client.select(1)
    client.setex(`currentuser:${req.decodeToken.username}`, 3600, JSON.stringify(result))
    return helper.response(res,200,'Get Data User Success',result);
  }catch(err){
    console.log(err)
    return next(new ApplicationError(message, status));
  }
})

// router.patch("/user/update-password", verifyJwt, clearCurrentUser,async (req, res, next) => {
//   try {
//     let reqBody = req.body;
//     const decodeToken = req.decodeToken;
//     reqBody.username = decodeToken.username;
//     await schema.updatePwdSchema.validateAsync(reqBody);

//     const checkUser = await accountModel.checkUser(reqBody.username);
//     if (checkUser.length<=0) {
//       return next(new ApplicationError("user not found", 400));
//     } else {
//       // const pwdSha1 = await security.genSha1(reqBody.old_password);
//       const checkPass = security.compareBcrypt(reqBody.old_password, checkUser[0].password);
//       if (!checkPass)
//         return next(new ApplicationError("old password doesn't match", 400));

//       const createPwd = security.genBcrypt(reqBody.new_password, 10);

//       let account = {
//         password: await createPwd,
//       };

//       let accountCondition = {
//         username: reqBody.username,
//         status_code: 'ACTIVE',
//       };

//       const updateDataAccount = {
//         account,
//         accountCondition,
//       };

//       const updateAccount = await accountModel.updatePwd(updateDataAccount);
//       if (!updateAccount) return next(new DatabaseError("query error", 400, 200));

//       message = `update password success`;
//       status = 200;



//       return helper.response(res, status, message);
//     }
//   } catch (e) {
//     message = e;
//     if (e.isJoi === true) {
//       message = e.details[0].message;
//       status = 422;
//     }
//     return next(new ApplicationError(message, status));
//   }
// });

router.patch("/user/update-image", verifyJwt, uploadImg,clearCurrentUser,async (req, res, next) => {
  try {
    // let reqBody = req.body;
    const decodeToken = req.decodeToken;

    const checkUser = await accountModel.checkUser(decodeToken.username);
    if (checkUser.length<=0) {
      return next(new ApplicationError("user not found", 400));
    } 

    // const pwdSha1 = await security.genSha1(reqBody.old_password);
    let updateImg = {
      url_image: req.file === undefined ? '' : req.file.filename,
    };

    if (checkUser[0].url_image) {
      if (checkUser[0].url_image !== updateImg.url_image) {
        fs.unlink(
          `./upload/product/${checkId[0].product_img}`,
          function (err) {
            if (err) {
              console.log('image')
            }
            console.log('Image Update Old File deleted!')
          }
        )
      }
    }

    let accountCondition = {
      username: decodeToken.username,
      status_code: 'ACTIVE',
    };

    const updateDataAccount = {
      updateImg,
      accountCondition,
    };

    const updateAccount = await accountModel.updateImg(updateDataAccount);
    if (!updateAccount) return next(new DatabaseError("query error", 400, 200));

    message = `update image success`;
    status = 200;



    return helper.response(res, status, message);

  } catch (e) {
    console.log(e)
    message = e;
    return next(new ApplicationError(message, status));
  }
});

router.post("/user-courses/all", verifyJwt ,async (req, res, next) => {
  try {
    if(req.decodeToken.user_code==='ADMIN'){
      const {jenis_mentor} = req.body;

      await schema.getAllUserSchema.validateAsync(req.body);
  
      let search = [];
      if(jenis_mentor.toLowerCase()=='sarjana'){
        search.push(`c.title ilike 'S.%'`)
      }else{
        search.push(`c.title not ilike 'S.%'`)
      }
  
      const result = await accountModel.getDataUserCourse(search);
      return helper.response(res,200,'Get Data User Success',result);
    }

    if(req.decodeToken.user_code==='NORMAL_USER'){
      const {jenis_mentor} = req.body;
  
      let search = [];
      search.push(`u.email = '${req.decodeToken.username}'`)

  
      const result = await accountModel.getDataUserCourse(search);
      return helper.response(res,200,'Get Data User Success',result);
    }

  }catch(err){
    message = err;
    if (err.isJoi === true) {
      message = err.details[0].message;
      status = 422;
    }
    console.log(err)
    return next(new ApplicationError(message, status));
  }
})

router.get("/user-courses/mentor-fee", async (req, res, next) => {
  try {
    const result = await accountModel.getMentorFee();
    return helper.response(res,200,'Get Data Mentor Success',result);
  }catch(err){
    console.log(err)
    return next(new ApplicationError(message, status));
  }
})

router.post("/user-course/add-user", async (req, res, next) => {
  try {
    let bodyData = req.body;

    // await schema.registerUsrSchema.validateAsync(bodyData);

    const checkUser = await accountModel.checkUser(bodyData.username);
    
    if(checkUser.length>0){
      return next(new ApplicationError("username is already exist", 400));
    }

    // let passwordEnc = await security.genBcrypt(bodyData.password, 10);
    // bodyData.password = passwordEnc
    bodyData.updated_at = `now()`
    const result = await accountModel.addUserData(bodyData);
    if(!result){
      return next(new DatabaseError("query error", 400));
    }


    logger.infologger(req.method, req.originalUrl, JSON.stringify(req.body), JSON.stringify(checkUser), req.ip, moment().format("YYYY-MM-DD HH:mm:ss"));

    return helper.response(res,200,'Register Success',result);
  }catch(err){
    console.log(err);
    return next(new ApplicationError(message, status));
  }
})
router.patch("/user-course/update-user", async (req, res, next) => {
  try {
    let bodyData = req.body;

    // await schema.registerUsrSchema.validateAsync(bodyData);

    const checkUser = await accountModel.checkUser(bodyData.username);
    
    // if(checkUser.length<=0){
    //   return next(new ApplicationError("username not found", 400));
    // }

    // let passwordEnc = await security.genBcrypt(bodyData.password, 10);
    // bodyData.password = passwordEnc
            bodyData.updated_at = `now()`      
            let condition = {
              id: bodyData.id
            };
      
            const updateDataAccount = {
              data: bodyData,
              condition: condition,
            };
    const result = await accountModel.updateUserData(updateDataAccount);
    if(!result){
      return next(new DatabaseError("query error", 400));
    }


    logger.infologger(req.method, req.originalUrl, JSON.stringify(req.body), JSON.stringify(checkUser), req.ip, moment().format("YYYY-MM-DD HH:mm:ss"));

    return helper.response(res,200,'Update Success',result);
  }catch(err){
    console.log(err);
    return next(new ApplicationError(message, status));
  }
})
router.delete("/user-course/delete-user", async (req, res, next) => {
  try {
    let bodyData = req.body;

    // await schema.registerUsrSchema.validateAsync(bodyData);

    // const checkUser = await accountModel.checkUser(bodyData.username);
    
    // if(checkUser.length<=0){
    //   return next(new ApplicationError("username not found", 400));
    // }

    // let passwordEnc = await security.genBcrypt(bodyData.password, 10);
    // bodyData.password = passwordEnc

    const result = await accountModel.deleteUser(bodyData.id);
    if(!result){
      return next(new DatabaseError("query error", 400));
    }


    // logger.infologger(req.method, req.originalUrl, JSON.stringify(req.body), JSON.stringify(checkUser), req.ip, moment().format("YYYY-MM-DD HH:mm:ss"));

    return helper.response(res,200,'Delete Success',result);
  }catch(err){
    console.log(err);
    return next(new ApplicationError(message, status));
  }
})




module.exports = router;
