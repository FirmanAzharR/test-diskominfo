const Postgres = require("../../../libraries")("Postgres");
const postgres = Postgres.getInstance().conn;
const { buildUpdateQueryPS3, buildUpdateQueryPS2, buildInsertQueryPS, buildSearchQuery  } = require("../../../helper")("database");

module.exports = {
  checkUser: async (id) => {
    try {
      let sql = `
           select * from public.users where id = $1
       `;
      let result = await postgres.any(sql, [id]);
      return result;
    } catch (e) {
      console.log(e)
      return false;
    }
  },
  AllUserData: async (id) => {
    try {
      let sql = `
           select*from public.users
       `;
      let result = await postgres.any(sql, [id]);
      return result;
    } catch (e) {
      console.log(e)
      return false;
    }
  },
  checkUserLogin: async (username,password) => {
    try {
      let sql = `
           select * from public.users where lower(username)=$1 AND password=$2
       `;
      let result = await postgres.any(sql, [username,password]);
      return result;
    } catch (e) {
      console.log(e)
      return false;
    }
  },
  getDataUserCourse: async (filter) => {
    try {
      const where = buildSearchQuery(filter)
      let sql = `
           select u.id, u.username, c.course, c.mentor, c.title
           from usercourse uc
           join users u on uc.id_user = u.id 
           join courses c on uc.id_course = c.id
           ${where}
       `;
      let result = await postgres.any(sql);
      return result;
    } catch (e) {
      console.log(e)
      return false;
    }
  },
  getMentorFee: async () => {
    try {
      let sql = `
           select c.mentor, count(u.id) as jumlah_pesesrta,
           count(u.id)*2000000 as total_fee
           from usercourse uc
           join users u on uc.id_user = u.id 
           join courses c on uc.id_course = c.id 
           group by c.mentor order by count(u.id) desc;
       `;
      let result = await postgres.any(sql);
      return result;
    } catch (e) {
      console.log(e)
      return false;
    }
  },
  addUserData: async (data) =>{
    try{
     return await postgres.tx(async(trx)=>{
        const builQuery = buildInsertQueryPS("users", [data]);
        // console.log(builQuery)
         return trx.one(builQuery.query, builQuery.data);
      })
    }catch(err){
      console.log("add user error", err);
      return false
    }
  },
  updateUserData: async (data) => {
    try {
      await postgres.tx(async (trx) => {
        let buildUpdate = buildUpdateQueryPS2(
          "users",
          data.data,
          data.condition
        );
        
        await trx.any(buildUpdate.query, buildUpdate.data);
      });

      return true;
    } catch (err) {
      console.log("update password", err);
      return false;
    }
  },
  deleteUser: async (id) => {
    try {
      let sql = `
           delete from public.users where id = $1
       `;
      let result = await postgres.any(sql, [id]);
      return result;
    } catch (e) {
      console.log(e)
      return false;
    }
  },
  addCourse: async (data) =>{
    try{
     return await postgres.tx(async(trx)=>{
        const builQuery = buildInsertQueryPS("courses", [data]);
        // console.log(builQuery)
         return trx.one(builQuery.query, builQuery.data);
      })
    }catch(err){
      console.log("add course error", err);
      return false
    }
  },
  updateCourse: async (data) => {
    try {
      await postgres.tx(async (trx) => {
        let buildUpdate = buildUpdateQueryPS2(
          "courses",
          data.data,
          data.condition
        );
        
        await trx.any(buildUpdate.query, buildUpdate.data);
      });

      return true;
    } catch (err) {
      console.log("update password", err);
      return false;
    }
  },
  deleteCourse: async (id) => {
    try {
      let sql = `
           delete from public.courses where id = $1
       `;
      let result = await postgres.any(sql, [id]);
      return result;
    } catch (e) {
      console.log(e)
      return false;
    }
  },
  currentCourse: async (id) => {
    try {
      let sql = `
           select*from public.courses where id = $1
       `;
      let result = await postgres.any(sql, [id]);
      return result;
    } catch (e) {
      console.log(e)
      return false;
    }
  },
  getAllCourse: async () => {
    try {
      let sql = `
           select * from public.courses
       `;
      let result = await postgres.any(sql);
      return result;
    } catch (e) {
      console.log(e)
      return false;
    }
  },
  addUserCourse: async (data) =>{
    try{
     return await postgres.tx(async(trx)=>{
        const builQuery = buildInsertQueryPS("usercourse", [data]);
        // console.log(builQuery)
         return trx.one(builQuery.query, builQuery.data);
      })
    }catch(err){
      console.log("add course error", err);
      return false
    }
  },
  // updateUserCourse: async (data) => {
  //   try {
  //     await postgres.tx(async (trx) => {
  //       let buildUpdate = buildUpdateQueryPS3(
  //         "usercourse",
  //         data.data,
  //         data.condition
  //       );

  //       console.log(buildUpdate)
        
  //       await trx.any(buildUpdate.query, buildUpdate.data);
  //     });

  //     return true;
  //   } catch (err) {
  //     console.log("update password", err);
  //     return false;
  //   }
  // },
  deleteUserCourse: async (data) => {
    try {
      let sql = `
           delete from public.usercourse where id_user = $1 and id_course = $2
       `;
      let result = await postgres.any(sql, [data.id_user,data.id_course]);
      return result;
    } catch (e) {
      console.log(e)
      return false;
    }
  },
  getAllUserCourse: async () => {
    try {
      let sql = `
           select u.id, u.username, c.course, c.mentor, c.title
           from usercourse uc
           join users u on uc.id_user = u.id 
           join courses c on uc.id_course = c.id ;
       `;
      let result = await postgres.any(sql);
      return result;
    } catch (e) {
      console.log(e)
      return false;
    }
  },
  currentUserCourse: async (id) => {
    try {
      let sql = `
           select*from public.usercourse where id = $1
       `;
      let result = await postgres.any(sql, [id]);
      return result;
    } catch (e) {
      console.log(e)
      return false;
    }
  },

};
