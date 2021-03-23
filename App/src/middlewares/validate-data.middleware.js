const { BAD_REQUEST } = require('http-status');

const { VALIDATION_ERROR_CODE } = require('../../config/codes.config');
/**
 * Options for validate schemas.
 */
const options = {
  abortEarly: false, // Abort after the last validation error
  allowUnknown: true, // Allow unknown keys that will be ignored
  stripUnknown: true, // Remove unknown keys from the validated data
  errors: {
    wrap: {
      label: ''
    }
  }
};

/**
 * Validate that the input data (placed in source) has the structure defined in the schema.
 * If the input data matches the structure of the schema, continue with the next middleware
 * or function.
 *
 * @throws If the input data does not matchthe structure of the schema, application responses
 * with an Bad Request(400) http status and an array in message property of body where it locates
 * the stack of the errors found.
 *
 * @param {Object} schema Joi object where the schema is described.
 * @param {String} [source] Place of the req where the object to be validated is located.
 */
const validateSchema = (schema, source = 'body') => (
  (req, res, next) => {
    const { value, error } = schema.validate(req[source], options);
    if (error) {
      return res.status(BAD_REQUEST).json({
        data: {},
        error: true,
        code: VALIDATION_ERROR_CODE,
        message: error.details.map((errorDetail) => errorDetail.message)
      });
    }
    req[source] = value;
    return next();
  }
);

module.exports = {
  validateSchema
};
