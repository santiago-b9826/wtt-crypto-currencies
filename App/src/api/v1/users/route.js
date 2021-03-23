const { Router } = require('express');

const { create } = require('./controller');
const { catchWrapper } = require('../../../tools');
const { validateSchema } = require('../../../middlewares');
const { CreateUserSchema } = require('../../../validation-schemas');

const router = new Router();

router.post('/', validateSchema(CreateUserSchema), catchWrapper(create));

module.exports = router;
