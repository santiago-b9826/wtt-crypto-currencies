require('dotenv').config();

const {
  NODE_ENV,
  PORT,
  MONGO_URL,
  PASSWORD_PATTERN,
  JWT_SECRET,
  COINGECKO_URL,
  COINGECKO_MAX_COINS_MARKETS_PER_PAGE
} = process.env;

module.exports = {
  NODE_ENV,
  PORT,
  MONGO_URL,
  PASSWORD_PATTERN,
  JWT_SECRET,
  COINGECKO_URL,
  COINGECKO_MAX_COINS_MARKETS_PER_PAGE: Number(COINGECKO_MAX_COINS_MARKETS_PER_PAGE)
};
