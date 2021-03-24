/* eslint-disable global-require */
module.exports = {
  ...require('./not-found.error'),
  ...require('./database.error'),
  ...require('./login.error'),
  ...require('./authorization.error')
};
