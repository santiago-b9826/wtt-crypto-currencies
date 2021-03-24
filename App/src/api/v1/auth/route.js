const { Router } = require('express');

const { login } = require('./controller');
const { catchWrapper } = require('../../../tools');
const { validateSchema } = require('../../../middlewares');
const { LoginSchema } = require('../../../validation-schemas');

const router = new Router();

router.get('/login', validateSchema(LoginSchema, 'query'), catchWrapper(login));

module.exports = router;
