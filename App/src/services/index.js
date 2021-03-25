/* eslint-disable global-require */
module.exports = {
  ...require('./user.service'),
  ...require('./coingecko.service')
};
