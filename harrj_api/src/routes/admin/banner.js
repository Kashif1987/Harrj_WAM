var express = require('express');
var router = express.Router();
var bannerController= require('./../../../src/controllers/admin/bannerController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

/*router.get('/list',auth.verifyToken, bannerController.List);

router.post('/add',auth.verifyToken, bannerController.Add);

router.post('/getinfo',auth.verifyToken, bannerController.Edit);

router.post('/update',auth.verifyToken, bannerController.Update);

router.post('/delete',auth.verifyToken, bannerController.Delete);*/

router.get('/list', bannerController.List);

router.post('/add', bannerController.Add);

router.post('/getinfo', bannerController.Edit);

router.post('/update', bannerController.Update);

router.post('/delete', bannerController.Delete);

module.exports = router;
