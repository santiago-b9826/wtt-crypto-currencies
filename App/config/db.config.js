const { connect } = require('mongoose');

const MONGO_OPS = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

const connection = async (mongoUrl) => {
  await connect(mongoUrl, MONGO_OPS);
};

module.exports = {
  connection
};
