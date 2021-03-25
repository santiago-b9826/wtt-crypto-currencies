const { INTERNAL_SERVER_ERROR } = require('http-status');
const { COINGECKO_ERROR_CODE } = require('../../config/codes.config');

class CoinGeckoError extends Error {
  /**
   * @class Extends from Error class
   * @param {String} message Descriptive message about the error generated.
   */
  constructor(message = 'Unexpected error trying to consume external service') {
    super(message);

    this.code = COINGECKO_ERROR_CODE;
    this.status = INTERNAL_SERVER_ERROR;
  }
}

module.exports = {
  CoinGeckoError
};
