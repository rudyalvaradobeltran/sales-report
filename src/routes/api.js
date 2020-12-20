const router = require('express').Router();
const apiMainRouter = require('./api/main');

router.use('/reports', apiMainRouter);

module.exports = router;