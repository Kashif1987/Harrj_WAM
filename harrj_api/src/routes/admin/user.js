var express = require('express');
var router = express.Router();
var userController= require('../../controllers/admin/userController.js');
const auth = require('../../config/auth');
const cache = require('../../helper/cache.js');

/*router.get('/list',auth.verifyToken, bannerController.List);

router.post('/add',auth.verifyToken, bannerController.Add);

router.post('/getinfo',auth.verifyToken, bannerController.Edit);

router.post('/update',auth.verifyToken, bannerController.Update);

router.post('/delete',auth.verifyToken, bannerController.Delete);*/

router.get('/list', userController.List);
module.exports = router;
