const Joi = require('joi');

const { COINGECKO_MAX_COINS_MARKETS_PER_PAGE } = require('../../config/env.config');

const CoingeckoPaginationSchema = Joi.object().keys({
  all: Joi.boolean().default(false),
  page: Joi.number().min(1).default(1),
  limit: Joi
    .number()
    .min(1)
    .default(COINGECKO_MAX_COINS_MARKETS_PER_PAGE)
});

module.exports = {
  CoingeckoPaginationSchema
};
