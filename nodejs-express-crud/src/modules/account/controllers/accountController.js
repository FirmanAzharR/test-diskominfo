const router = require("express").Router();
const { accountModel } = require("../models");
const { ApplicationError, DatabaseError } =
  require("../../../helper")("errorHandler");
const { verifyJwt } = require("../../../helper")("security");
const schema = require("../../../helper/schemaValidator");
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
const Joi = require("joi");

let message = ``;
let status = 500;


router.post("/user/login", async (req, res, next) => {
  try {
    const reqBody = req.body;

    await schema.loginSchema.validateAsync(reqBody);

    const checkUser = await accountModel.checkUserLogin(reqBody.username.toLowerCase(),reqBody.password);
      if (checkUser.length<=0) {
        return next(new ApplicationError("Invalid Username or Password", 400));
      }

      const payload = {
        id: checkUser[0].id,
        username: checkUser[0].username,
        user_code: checkUser[0].user_code
      }
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' })
      const result = { ...payload, token }

    return helper.response(res,200,'Login Success',result);
  }catch(err){
    message = err;
    if (err.isJoi == true) {
      message = err.details[0].message;
      status = 422;
    }
    console.log(err)
    return next(new ApplicationError(message, status, status));
  }
})

//user

router.get("/user/current", async (req, res, next) => {
  try {
    // console.log('test')
    const result = await accountModel.checkUser(req.query.id);
    return helper.response(res,200,'Get Data User Success',result);
  }catch(err){
    console.log(err)
    return next(new ApplicationError(message, status));
  }
})

router.post("/user/all-user-course", verifyJwt,async (req, res, next) => {
  // console.log(req.decodeToken)
  try {    
    const {jenis_mentor} = req.body;
    if(req.decodeToken.user_code==='ADMIN_USER'){

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
      let search = [];
      search.push(`u.id = '${req.decodeToken.id}'`)
      if(jenis_mentor.toLowerCase()=='sarjana'){
        search.push(`c.title ilike 'S.%'`)
      }else{
        search.push(`c.title not ilike 'S.%'`)
      }  
      const result = await accountModel.getDataUserCourse(search);
      return helper.response(res,200,'Get Data User Success',result);
    }

  }catch(err){
    message = err;
    if (err.isJoi == true) {
      message = err.details[0].message;
      status = 422;
    }
    console.log(err)
    return next(new ApplicationError(message, status));
  }
})

router.get("/user/all", async (req, res, next) => {
  try {    
    const result = await accountModel.AllUserData();
    return helper.response(res,200,'Get Data User Success',result);

  }catch(err){
    message = err;
    if (err.isJoi == true) {
      message = err.details[0].message;
      status = 422;
    }
    console.log(err)
    return next(new ApplicationError(message, status));
  }
})

router.get("/user/mentor-fee", async (req, res, next) => {
  try {
    let result = await accountModel.getMentorFee();
    let chart = {
      labels:[],
      jumlah_peserta: [],
      total_fee: []
    }
    let reduceData = await result.reduce((_a,value)=>{
      chart.labels.push(value.mentor)
      chart.jumlah_peserta.push(value.jumlah_pesesrta)
      chart.total_fee.push(value.total_fee)
      return chart
    }, Promise.resolve(chart))

    result = {
      data: result,
      chart: reduceData
    }

    return helper.response(res,200,'Get Data Mentor Success',result);
  }catch(err){
    console.log(err)
    return next(new ApplicationError(message, status));
  }
})

router.post("/user/add-user", async (req, res, next) => {
  try {
    let bodyData = req.body;

    await schema.userAddSchema.validateAsync(bodyData);

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
    message = err;
    if (err.isJoi == true) {
      message = err.details[0].message;
      status = 422;
    }
    console.log(err);
    return next(new ApplicationError(message, status));
  }
})

router.patch("/user/update-user", async (req, res, next) => {
  try {
    let bodyData = req.body;

    await schema.userUpdateSchema.validateAsync(bodyData);

    
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

    return helper.response(res,200,'Update Success',result);
  }catch(err){
    message = err;
    if (err.isJoi == true) {
      message = err.details[0].message;
      status = 422;
    }
    console.log(err);
    return next(new ApplicationError(message, status));
  }
})

router.delete("/user/delete-user", async (req, res, next) => {
  try {

    await Joi.number().validateAsync(req.query.id);

    const result = await accountModel.deleteUser(req.query.id);
    if(!result){
      return next(new DatabaseError("query error", 400));
    }

    return helper.response(res,200,'Delete Success',result);
  }catch(err){
    message = err;
    if (err.isJoi == true) {
      message = err.details[0].message;
      status = 422;
    }
    console.log(err);
    return next(new ApplicationError(message, status));
  }
})

//course

router.post("/course/add-course", async (req, res, next) => {
  try {
    let bodyData = req.body;

    await schema.addCourseSchema.validateAsync(bodyData);

    const result = await accountModel.addCourse(bodyData);
    if(!result){
      return next(new DatabaseError("query error", 400));
    }

    return helper.response(res,200,'Add Course Success',result);
  }catch(err){
    message = err;
    if (err.isJoi == true) {
      message = err.details[0].message;
      status = 422;
    }
    console.log(err);
    return next(new ApplicationError(message, status));
  }
})

router.patch("/course/update-course", async (req, res, next) => {
  try {
    let bodyData = req.body;

    await schema.updateCourseSchema.validateAsync(bodyData);

          
            let condition = {
              id: bodyData.id
            };
      
            const updateDataAccount = {
              data: bodyData,
              condition: condition,
            };

    const result = await accountModel.updateCourse(updateDataAccount);
    if(!result){
      return next(new DatabaseError("query error", 400));
    }

    return helper.response(res,200,'Update Success',result);
  }catch(err){
    message = err;
    if (err.isJoi == true) {
      message = err.details[0].message;
      status = 422;
    }
    console.log(err);
    return next(new ApplicationError(message, status));
  }
})

router.delete("/course/delete-course", async (req, res, next) => {
  try {

    await Joi.number().validateAsync(req.query.id);

    const result = await accountModel.deleteCourse(req.query.id);
    if(!result){
      return next(new DatabaseError("query error", 400));
    }

    return helper.response(res,200,'Delete Success',result);
  }catch(err){
    message = err;
    if (err.isJoi == true) {
      message = err.details[0].message;
      status = 422;
    }
    console.log(err);
    return next(new ApplicationError(message, status));
  }
})

router.get("/course/all", async (req, res, next) => {
  try {
    const result = await accountModel.getAllCourse();
    return helper.response(res,200,'Get Data Course Success',result);
  }catch(err){
    console.log(err)
    return next(new ApplicationError(message, status));
  }
})

router.get("/course/current", async (req, res, next) => {
  try {
    // console.log('test')
    const result = await accountModel.currentCourse(req.query.id);
    return helper.response(res,200,'Get Data Success',result);
  }catch(err){
    console.log(err)
    return next(new ApplicationError(message, status));
  }
})

//user course

router.post("/user-course/add", async (req, res, next) => {
  try {
    let bodyData = req.body;

    await schema.addUserCourse.validateAsync(bodyData);

    const result = await accountModel.addUserCourse(bodyData);
    if(!result){
      return next(new DatabaseError("query error", 400));
    }

    return helper.response(res,200,'Add Course Success',result);
  }catch(err){
    message = err;
    if (err.isJoi == true) {
      message = err.details[0].message;
      status = 422;
    }
    console.log(err);
    return next(new ApplicationError(message, status));
  }
})

// router.patch("/user-course/update", async (req, res, next) => {
//   try {
//     let bodyData = req.body;

//     await schema.updateUserCourse.validateAsync(bodyData);
          
//             let condition = {
//               id_user: bodyData.id_user,
//               id_course: bodyData.id_course
//             };
      
//             const updateDataAccount = {
//               data: bodyData,
//               condition: condition,
//             };

//     const result = await accountModel.updateUserCourse(updateDataAccount);
//     if(!result){
//       return next(new DatabaseError("query error", 400));
//     }

//     return helper.response(res,200,'Update Success',result);
//   }catch(err){
//     message = err;
//     if (err.isJoi == true) {
//       message = err.details[0].message;
//       status = 422;
//     }
//     console.log(err);
//     return next(new ApplicationError(message, status));
//   }
// })

router.delete("/user-course/delete", async (req, res, next) => {
  try {
    let bodyData = req.body;

    await schema.deleteUserCourse.validateAsync(bodyData);

    const result = await accountModel.deleteUserCourse(bodyData);
    if(!result){
      return next(new DatabaseError("query error", 400));
    }

    return helper.response(res,200,'Delete Success',result);
  }catch(err){
    message = err;
    if (err.isJoi == true) {
      message = err.details[0].message;
      status = 422;
    }
    console.log(err);
    return next(new ApplicationError(message, status));
  }
})

router.get("/user-course/all", verifyJwt, getCurrentUser, async (req, res, next) => {
  try {
    const result = await accountModel.getAllCourse();
    return helper.response(res,200,'Get Data Course Success',result);
  }catch(err){
    console.log(err)
    return next(new ApplicationError(message, status));
  }
})


module.exports = router;
