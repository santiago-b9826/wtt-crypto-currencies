const { Router } = require('express');

const { create, addCryptos } = require('./controller');
const { catchWrapper } = require('../../../tools');
const { validateSchema, isLoggedIn } = require('../../../middlewares');
const { CreateUserSchema, AddCryptosToUserSchema } = require('../../../validation-schemas');

const router = new Router();

router.post('/', validateSchema(CreateUserSchema), catchWrapper(create));
router.patch('/:nickname/crypto-currencies', isLoggedIn, validateSchema(AddCryptosToUserSchema), catchWrapper(addCryptos));

module.exports = router;
