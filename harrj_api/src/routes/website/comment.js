var express = require('express');
var router = express.Router();
var commentController= require('../../controllers/website/commentController.js');
const auth = require('../../config/auth');
const cache = require('../../helper/cache.js');

/*router.get('/list',auth.verifyToken, commentController.List);

router.post('/add',auth.verifyToken, commentController.Add);

router.post('/getinfo',auth.verifyToken, commentController.Edit);

router.post('/update',auth.verifyToken, commentController.Update);

router.post('/delete',auth.verifyToken, commentController.Delete);*/

router.get('/list', commentController.List);

router.post('/add', commentController.Add);

router.post('/getinfo', commentController.Edit);

router.post('/update', commentController.Update);

router.post('/delete', commentController.Delete);

// router.post('/cat_sub_cat_list', commentController.CatSubCatList);

// router.post('/cat_brand_list', commentController.CatBrandList);


module.exports = router;