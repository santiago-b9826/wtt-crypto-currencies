const { INTERNAL_SERVER_ERROR } = require('http-status');
const { DATABASE_ERROR_CODE } = require('../../config/codes.config');

class DatabaseError extends Error {
  /**
   * @class Extends from Error class
   * @param {String} message Descriptive message about the error generated.
   */
  constructor(message = 'Unexpected error when trying to access the database') {
    super(message);

    this.code = DATABASE_ERROR_CODE;
    this.status = INTERNAL_SERVER_ERROR;
  }
}

module.exports = {
  DatabaseError
};
