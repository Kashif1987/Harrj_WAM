var express = require('express');
var router = express.Router();
var dashboardController= require('./../../../src/controllers/admin/dashboardController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

router.get('/dashboard_count',dashboardController.Dashboardcount);


module.exports = router;