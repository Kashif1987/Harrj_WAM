var express = require('express');
var router = express.Router();
var customerController= require('./../../../src/controllers/api/customerController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');


router.post('/bid_list_by_customer_id', customerController.BidListByCustomerId);

router.post('/update_bid_status', customerController.UpdateBidStatus);

router.post('/bid_getinfo', customerController.Edit);



module.exports = router;