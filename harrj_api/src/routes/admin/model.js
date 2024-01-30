var express = require('express');
var router = express.Router();
var modelController= require('./../../../src/controllers/admin/modelController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

/*router.get('/list',auth.verifyToken, brandController.List);

router.post('/add',auth.verifyToken, brandController.Add);

router.post('/getinfo',auth.verifyToken, brandController.Edit);

router.post('/update',auth.verifyToken, brandController.Update);

router.post('/delete',auth.verifyToken, brandController.Delete);*/

router.get('/list', modelController.List);

router.post('/add', modelController.Add);

router.post('/getinfo', modelController.Edit);

router.post('/update', modelController.Update);

router.post('/delete', modelController.Delete);

router.post('/add_many_model_list', modelController.AddManyModelList);

module.exports = router;