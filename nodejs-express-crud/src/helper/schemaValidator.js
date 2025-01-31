const Joi = require("joi");

const registerUsrSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  created_by: Joi.string(),
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


module.exports = {
  registerUsrSchema, 
  updatePwdSchema,
  checkUserSchema,
  loginSchema,
  getAllUserSchema
};
