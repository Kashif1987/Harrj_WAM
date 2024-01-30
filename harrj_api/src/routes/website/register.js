var express = require('express');
var router = express.Router();
var registrationController= require('../../controllers/website/registrationController.js');

const auth = require('../../config/auth');

router.post('/', registrationController.Register);

module.exports = router;