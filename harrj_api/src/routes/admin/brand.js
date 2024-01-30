var express = require('express');
var router = express.Router();
var brandController= require('./../../../src/controllers/admin/brandController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

/*router.get('/list',auth.verifyToken, brandController.List);

router.post('/add',auth.verifyToken, brandController.Add);

router.post('/getinfo',auth.verifyToken, brandController.Edit);

router.post('/update',auth.verifyToken, brandController.Update);

router.post('/delete',auth.verifyToken, brandController.Delete);*/

router.get('/list', brandController.List);

router.post('/add', brandController.Add);

router.post('/getinfo', brandController.Edit);

router.post('/update', brandController.Update);

router.post('/delete', brandController.Delete);

router.post('/brand_model_list', brandController.BrandModelList);

router.post('/subcat_brand_list', brandController.SubCatBrandList);

router.post('/add_many_brand_list', brandController.AddManyBrandList);




module.exports = router;