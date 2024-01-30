var express = require('express');
var router = express.Router();
var cityController= require('./../../../src/controllers/admin/cityController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

/*router.get('/list',auth.verifyToken, cityController.List);

router.post('/add',auth.verifyToken, cityController.Add);

router.post('/getinfo',auth.verifyToken, cityController.Edit);

router.post('/update',auth.verifyToken, cityController.Update);

router.post('/delete',auth.verifyToken, cityController.Delete);*/

router.get('/list', cityController.List);

router.post('/add', cityController.Add);

router.post('/getinfo', cityController.Edit);

router.post('/update', cityController.Update);

router.post('/delete', cityController.Delete);


module.exports = router;