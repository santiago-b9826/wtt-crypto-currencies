const { Router } = require('express');

const { read } = require('./controller');
const { catchWrapper } = require('../../../tools');
const { validateSchema, isLoggedIn } = require('../../../middlewares');
const { CoingeckoPaginationSchema } = require('../../../validation-schemas');

const router = new Router();

router.get('/', isLoggedIn, validateSchema(CoingeckoPaginationSchema, 'query'), catchWrapper(read));

module.exports = router;
