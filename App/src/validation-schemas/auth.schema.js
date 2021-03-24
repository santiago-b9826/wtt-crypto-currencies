const Joi = require('joi');

const LoginSchema = Joi.object({
  nickname: Joi.string().required(),
  password: Joi.string().required()
});

module.exports = {
  LoginSchema
};
