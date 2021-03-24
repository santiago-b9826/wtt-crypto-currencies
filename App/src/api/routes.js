const { Router } = require('express');

const v1 = require('./v1/route');

const router = new Router();

router.use('/v1', v1);

module.exports = router;
