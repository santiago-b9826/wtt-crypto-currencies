const { Router } = require('express');

const auth = require('./auth/route');
const users = require('./users/route');
const cryptoCurrencies = require('./crypto-currencies/route');

const router = new Router();

router.use('/users', users);
router.use('/auth', auth);
router.use('/crypto-currencies', cryptoCurrencies);

module.exports = router;
