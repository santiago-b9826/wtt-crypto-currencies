/* eslint-disable global-require */
module.exports = {
  ...require('./not-found.middleware'),
  ...require('./handler.middleware'),
  ...require('./validate-data.middleware'),
  ...require('./is-logged-in.middleware')
};
