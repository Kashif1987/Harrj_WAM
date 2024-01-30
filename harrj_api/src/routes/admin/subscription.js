var express = require('express');
var router = express.Router();
var subscriptionController= require('./../../../src/controllers/admin/subscriptionController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

router.get('/list',auth.verifyToken,subscriptionController.List);

router.post('/add',auth.verifyToken, subscriptionController.Add);

// router.post('/getInfo',auth.verifyToken, cache.get, subscriptionController.Edit,cache.set);
router.post('/getinfo',auth.verifyToken,subscriptionController.Edit);

router.post('/update',auth.verifyToken, subscriptionController.Update);

router.post('/delete',auth.verifyToken, subscriptionController.Delete);

module.exports = router;