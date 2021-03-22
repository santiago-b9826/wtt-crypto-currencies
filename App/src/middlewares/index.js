/* eslint-disable global-require */
module.exports = {
  ...require('./not-found.middleware'),
  ...require('./handler.middleware')
};
