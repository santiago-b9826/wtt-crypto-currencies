const { Router } = require('express');

const auth = require('./auth/route');
const users = require('./users/route');

const router = new Router();

router.use('/users', users);
router.use('/auth', auth);

module.exports = router;
