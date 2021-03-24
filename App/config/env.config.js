require('dotenv').config();

const {
  NODE_ENV,
  PORT,
  MONGO_URL,
  PASSWORD_PATTERN,
  JWT_SECRET
} = process.env;

module.exports = {
  NODE_ENV,
  PORT,
  MONGO_URL,
  PASSWORD_PATTERN,
  JWT_SECRET
};
