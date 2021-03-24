const { verify } = require('jsonwebtoken');

const { AuthorizationError } = require('../errors');
const { JWT_SECRET } = require('../../config/env.config');

/**
 * Verify if an user is login in the application, validating the Bearer Token
 * sended through Authorization header. If it is a valid token, save decoded
 * information in req object and continue with the next middleware or function.
 *
 * @throws If it is a invalid token, or token is not sended in Authorization
 * header, or is not a Bearer token, application responses with an
 * Unauthorized(401) http status.
 *
 * @param {Object} req represents the HTTP request and has properties for the request
 * query string, parameters, body, HTTP headers, and so on.
 * @param {Object} res represents the HTTP response that an Express app sends when it
 * gets an HTTP request.
 * @param {Function} next Next middleware function.
 */
const isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization;

  try {
    if (!token) throw new AuthorizationError('Must send Authorization Bearer token');
    if (!token.startsWith('Bearer')) throw new AuthorizationError('No Bearer token sended in the request');

    const decoded = verify(token.split(' ')[1], JWT_SECRET);
    req.locals = decoded;
    return next();
  } catch (error) {
    throw new AuthorizationError(error.message);
  }
};

module.exports = {
  isLoggedIn
};
