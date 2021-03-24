/* eslint-disable global-require */
module.exports = {
  ...require('./user.schema'),
  ...require('./auth.schema')
};
