var express = require('express');
var router = express.Router();
var contactController= require('../../controllers/api/contactController.js');

const auth = require('../../config/auth');

router.post('/', contactController.Contactus);

module.exports = router;