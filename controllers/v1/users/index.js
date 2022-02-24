var express = require('express');
var router = express.Router();

router.post('/signup', require('./signUp.js'));
router.post('/signin', require('./signIn.js'));

module.exports = router;
