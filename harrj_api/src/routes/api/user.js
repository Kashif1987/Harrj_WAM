var express = require('express');
var router = express.Router();
//var userController= require('../../controllers/admin/userController.js');
var userController= require('../../controllers/api/userController.js');
const auth = require('../../config/auth');
const cache = require('../../helper/cache.js');

/*router.get('/list',auth.verifyToken, bannerController.List);

router.post('/add',auth.verifyToken, bannerController.Add);

router.post('/getinfo',auth.verifyToken, bannerController.Edit);

router.post('/update',auth.verifyToken, bannerController.Update);

router.post('/delete',auth.verifyToken, bannerController.Delete);*/

router.get('/list', userController.List);

router.post('/getinfo',auth.verifyToken,userController.getinfo);
router.post('/update',auth.verifyToken,userController.Update)
module.exports = router;
