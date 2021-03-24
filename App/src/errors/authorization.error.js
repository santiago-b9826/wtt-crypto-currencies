const { UNAUTHORIZED } = require('http-status');
const { AUTHORIZATION_ERROR_CODE } = require('../../config/codes.config');

class AuthorizationError extends Error {
  /**
   * @class Extends from Error class
   * @param {String} message Descriptive message about the error generated.
   */
  constructor(message) {
    super(message);

    this.code = AUTHORIZATION_ERROR_CODE;
    this.status = UNAUTHORIZED;
  }
}

module.exports = {
  AuthorizationError
};
