const { handler } = require('../middlewares');
/**
 * It is a higher order function that allows capturing the errors of the async function that
 * it wraps.
 * @param {Function} fn
 */
const catchWrapper = (fn) => (req, res, next) => (
  fn(req, res, next).catch((error) => handler(error, req, res, next)));

module.exports = {
  catchWrapper
};
