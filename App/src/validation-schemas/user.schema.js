const Joi = require('joi');
const { PASSWORD_PATTERN, MAX_TOP_N } = require('../../config/env.config');

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

const AddCryptosToUserSchema = Joi.object({
  cryptos: Joi.array().items(Joi.string()).min(1).required()
});

const TopNCryptosSchema = Joi.object({
  n: Joi.number().min(1).max(MAX_TOP_N).required(),
  order: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .insensitive()
    .lowercase()
});

module.exports = {
  CreateUserSchema,
  TopNCryptosSchema,
  AddCryptosToUserSchema
};
