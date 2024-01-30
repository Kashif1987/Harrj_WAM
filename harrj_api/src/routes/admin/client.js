var express = require('express');
var router = express.Router();
var customerController= require('./../../../src/controllers/admin/customerController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

router.get('/list',auth.verifyToken,customerController.List);

router.post('/add',auth.verifyToken, customerController.Add);

// router.post('/getInfo',auth.verifyToken, cache.get, customerController.Edit,cache.set);
router.post('/getinfo',auth.verifyToken,customerController.Edit);

router.post('/update',auth.verifyToken, customerController.Update);

// router.post('/delete',auth.verifyToken, customerController.Delete);

module.exports = router;