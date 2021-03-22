require('dotenv').config();

const {
  NODE_ENV,
  PORT,
  MONGO_URL
} = process.env;

module.exports = {
  NODE_ENV,
  PORT,
  MONGO_URL
};
