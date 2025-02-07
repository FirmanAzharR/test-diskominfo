const Joi = require("joi");

const registerUsrSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  created_by: Joi.string(),
});

const userAddSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});
const userUpdateSchema = Joi.object({
  id : Joi.number().required(),
  username: Joi.string().optional(),
  email: Joi.string().optional(),
  password: Joi.string().optional(),
});
const userDeleteSchema = Joi.object({
  id : Joi.number().required()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const updatePwdSchema = Joi.object({
  username: Joi.string().required(),
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
});

const checkUserSchema = Joi.object({
  email: Joi.string().required(),
});

getAllUserSchema =  Joi.object({
  jenis_mentor: Joi.string().required(),
});

const addCourseSchema = Joi.object({
  course: Joi.string().required(),
  mentor: Joi.string().required(),
  title: Joi.string().required(),
});

const updateCourseSchema = Joi.object({
  id: Joi.number().required(),
  course: Joi.string().optional(),
  mentor: Joi.string().optional(),
  title: Joi.string().optional(),
});

const deleteCourseSchema = Joi.object({
  id: Joi.number().required(),
});

const currentCourseSchema = Joi.object({
  id: Joi.number().required(),
});


const addUserCourse = Joi.object({
  id_user: Joi.number().required(),
  id_course: Joi.number().required(),
});

const updateUserCourse = Joi.object({
  id_user: Joi.number().required(),
  id_course: Joi.number().required(),
});

const deleteUserCourse = Joi.object({
  id_user: Joi.number().required(),
  id_course: Joi.number().required(),
});

module.exports = {
  registerUsrSchema, 
  updatePwdSchema,
  checkUserSchema,
  loginSchema,
  getAllUserSchema,
  userAddSchema,
  userUpdateSchema,
  userDeleteSchema,
  addCourseSchema,
  updateCourseSchema,
  deleteCourseSchema,
  currentCourseSchema,
  addUserCourse,
  updateUserCourse,
  deleteUserCourse
};
