const Joi = require('joi');
const { PASSWORD_PATTERN } = require('../../config/env.config');

const CreateUserSchema = Joi.object({
  name: Joi.string().required(),
  lastname: Joi.string().required(),
  nickname: Joi.string().required(),
  password: Joi.string()
    .regex(new RegExp(PASSWORD_PATTERN))
    .min(8)
    .required(),
  preferredCurrency: Joi.string()
    .valid('USD', 'EUR', 'ARS')
    .insensitive()
    .uppercase()
    .required()
});

module.exports = {
  CreateUserSchema
};
