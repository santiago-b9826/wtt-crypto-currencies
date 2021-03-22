const { NotFoundError } = require('../errors');

const notFound = (req, res, next) => {
  const err = new NotFoundError();
  next(err);
};

module.exports = {
  notFound
};
