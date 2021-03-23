const { Router } = require('express');

const usersV1 = require('./v1/users/route');

const router = new Router();

router.use('/v1/users', usersV1);

module.exports = router;
