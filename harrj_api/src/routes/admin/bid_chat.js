var express = require('express');
var router = express.Router();
var bid_chat= require('./../../../src/controllers/admin/bidchatController');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');
router.post('/add',bid_chat.Add)
module.exports=router