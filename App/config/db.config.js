const { connect } = require('mongoose');

const { MONGO_URL } = require('./env.config');

const MONGO_OPS = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

const connection = async () => {
  await connect(MONGO_URL, MONGO_OPS);
};

module.exports = {
  connection
};
