const { connect } = require('mongoose');

const MONGO_OPS = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

const connection = async (mongoUrl) => {
  const db = await connect(mongoUrl, MONGO_OPS);
  return db;
};

module.exports = {
  connection
};
