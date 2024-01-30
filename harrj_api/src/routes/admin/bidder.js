var express = require('express');
var router = express.Router();
var bidderController= require('./../../../src/controllers/admin/bidderController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

router.get('/list',auth.verifyToken,bidderController.List);

// router.post('/add',auth.verifyToken, bidderController.Add);

// router.post('/getInfo',auth.verifyToken, cache.get, bidderController.Edit,cache.set);
router.post('/getinfo',auth.verifyToken,bidderController.Edit);

// router.post('/update',auth.verifyToken, bidderController.Update);

router.post('/delete',auth.verifyToken, bidderController.Delete);
router.post('/bidlist_by_productid',auth.verifyToken, bidderController.BidListByProductId);
router.post('/award_bid',auth.verifyToken, bidderController.AwardBid);

module.exports = router;