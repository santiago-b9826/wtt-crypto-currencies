const { INTERNAL_SERVER_ERROR } = require('http-status');

const { INTERNAL_CODE } = require('../../config/codes.config');

// eslint-disable-next-line no-unused-vars
const handler = (err, req, res, next) => {
  const code = err.code || INTERNAL_CODE;
  const status = err.status || INTERNAL_SERVER_ERROR;
  const message = err.message || 'An internal server error ocurred';

  const errorDetails = {
    code,
    message,
    data: {},
    error: true
  };

  return res.status(status).json(errorDetails);
};

module.exports = {
  handler
};
