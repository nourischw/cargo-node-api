var express = require('express');

var router = express.Router();

// @Test
router.get('/test', require('./test.js'));

router.use('/user', require('controllers/v1/users'));

module.exports = router;
