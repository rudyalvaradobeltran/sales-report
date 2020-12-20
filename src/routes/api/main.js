const router = require('express').Router();
const { main } = require('../../controller');

router.post('/main', main);

module.exports = router;