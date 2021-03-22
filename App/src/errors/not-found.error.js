const { NOT_FOUND } = require('http-status');
const { NOT_FOUND_CODE } = require('../../config/codes.config');

class NotFoundError extends Error {
  /**
   * @class Extends from Error class
   * @param {Number} status Error http status to response.
   * @param {String} message Descriptive message about the error generated.
   */
  constructor() {
    const message = 'The requested resource was not found';
    super(message);

    this.code = NOT_FOUND_CODE;
    this.status = NOT_FOUND;
  }
}

module.exports = {
  NotFoundError
};
