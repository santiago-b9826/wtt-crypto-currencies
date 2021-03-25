const { Router } = require('express');

const { catchWrapper } = require('../../../tools');
const { create, addCryptos, getTopCryptos } = require('./controller');
const { validateSchema, isLoggedIn } = require('../../../middlewares');
const { CreateUserSchema, AddCryptosToUserSchema, TopNCryptosSchema } = require('../../../validation-schemas');

const router = new Router();

router.post('/', validateSchema(CreateUserSchema), catchWrapper(create));
router.patch('/:nickname/crypto-currencies', isLoggedIn, validateSchema(AddCryptosToUserSchema), catchWrapper(addCryptos));
router.get('/:nickname/crypto-currencies/top', isLoggedIn, validateSchema(TopNCryptosSchema, 'query'), catchWrapper(getTopCryptos));

module.exports = router;
