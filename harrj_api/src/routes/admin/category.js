var express = require('express');
var router = express.Router();
var categoryController= require('./../../../src/controllers/admin/categoryController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

/*router.get('/list',auth.verifyToken, categoryController.List);

router.post('/add',auth.verifyToken, categoryController.Add);

router.post('/getinfo',auth.verifyToken, categoryController.Edit);

router.post('/update',auth.verifyToken, categoryController.Update);

router.post('/delete',auth.verifyToken, categoryController.Delete);*/

router.get('/list', categoryController.List);

router.post('/add', categoryController.Add);

router.post('/getinfo', categoryController.Edit);

router.post('/update', categoryController.Update);

router.post('/delete', categoryController.Delete);

router.post('/cat_sub_cat_list', categoryController.CatSubCatList);

router.post('/cat_brand_list', categoryController.CatBrandList);


module.exports = router;