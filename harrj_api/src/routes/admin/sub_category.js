var express = require('express');
var router = express.Router();
var sub_categoryController= require('./../../../src/controllers/admin/sub_categoryController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

router.get('/list', sub_categoryController.List);

router.post('/add', sub_categoryController.Add);

router.post('/getinfo', sub_categoryController.Edit);

router.post('/update', sub_categoryController.Update);

router.post('/delete', sub_categoryController.Delete);

// router.post('/list_by_category_id', sub_categoryController.listOncategory);

router.get('/list', sub_categoryController.List);

router.post('/add', sub_categoryController.Add);

router.post('/getinfo', sub_categoryController.Edit);

router.post('/update', sub_categoryController.Update);

router.post('/delete', sub_categoryController.Delete);

router.get('/list_by_category_id', sub_categoryController.listOncategory);

router.post('/add_many_list', sub_categoryController.AddManyList);

module.exports = router;

