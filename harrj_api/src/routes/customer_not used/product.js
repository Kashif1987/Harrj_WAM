var express = require('express');
var router = express.Router();
var productController= require('./../../../src/controllers/customer/productController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

// router.get('/list',productController.List);
router.get('/list',auth.verifyToken, productController.List);
router.post('/add',auth.verifyToken, productController.Add);

// router.post('/getInfo', cache.get, productController.Edit,cache.set);
router.post('/getinfo',productController.Edit);

router.post('/update',auth.verifyToken, productController.Update);

router.post('/delete', productController.Delete);

router.post('/delete_product_imgs', productController.DeleteProductImgs);

router.post('/update_product_status', productController.UpdateProductStatus);

router.post('/product_bids', productController.ProductBids);





module.exports = router;