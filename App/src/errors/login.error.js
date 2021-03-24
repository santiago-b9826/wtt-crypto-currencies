const { NOT_FOUND } = require('http-status');
const { LOGIN_ERROR_CODE } = require('../../config/codes.config');

class LoginError extends Error {
  /**
   * @class Extends from Error class
   */
  constructor() {
    const message = 'Nickname or Password is wrong';
    super(message);

    this.code = LOGIN_ERROR_CODE;
    this.status = NOT_FOUND;
  }
}

module.exports = {
  LoginError
};
