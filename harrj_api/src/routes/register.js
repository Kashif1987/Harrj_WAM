var express = require('express');
var router = express.Router();
var registrationController= require('./../../src/controllers/registrationController.js');

const auth = require('./../../src/config/auth');

router.post('/', registrationController.Register);

module.exports = router;