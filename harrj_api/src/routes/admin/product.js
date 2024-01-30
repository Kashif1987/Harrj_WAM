var express = require('express');
var router = express.Router();
var productController= require('./../../../src/controllers/admin/productController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

router.get('/list',productController.List);
router.get('/archive_list',productController.ArchiveList);
router.post('/add',auth.verifyToken, productController.Add);
router.post('/golive',auth.verifyToken, productController.AddLive);
// router.post('/getInfo', cache.get, productController.Edit,cache.set);
router.post('/getinfo',productController.Edit);
router.post('/archive',productController.Archive);
router.post('/update', productController.Update);

router.post('/delete', productController.Delete);

router.post('/delete_product_imgs', productController.DeleteProductImgs);

router.post('/update_product_status', productController.UpdateProductStatus);

router.post('/product_bids', productController.ProductBids);
router.post('/update_meeting_status', productController.UpdateMeetingStatus);
router.get('/listbyorder', productController.listinsequence)





module.exports = router;