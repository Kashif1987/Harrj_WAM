var express = require('express');
var router = express.Router();
var customerController= require('./../../../src/controllers/website/customerController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');


router.post('/bid_list_by_customer_id', customerController.BidListByCustomerId);

router.post('/update_bid_status', auth.verifyToken,customerController.UpdateBidStatus);

router.post('/bid_getinfo',auth.verifyToken, customerController.Edit);
// bid_list_by_bidder_id

router.post('/list_myads',auth.verifyToken, customerController.ListMyAds);
// router.post('/getinfo_myads', customerController.GetInfoMyAds);
// router.post('/update_myads', customerController.UpdateMyAds);
// router.post('/delete_myads', customerController.DeleteMyAds);

router.post('/email-send',auth.verifyToken, customerController.EmailSend);
// router.post('/change-password',auth.verifyToken, customerController.ChangePassword);
module.exports = router;

