var express = require('express');
var router = express.Router();
var productController= require('../../controllers/website/productController.js');
const auth = require('../../config/auth');
const cache = require('../../helper/cache.js');

router.get('/list',productController.List);
router.get('/archive_list',productController.ArchiveList);
router.post('/add', auth.verifyToken,productController.Add);
router.post('/golive',auth.verifyToken, productController.AddLive);

// router.post('/getInfo', cache.get, productController.Edit,cache.set);
router.post('/getinfo',productController.Edit);
router.post('/archive',productController.Archive);
router.post('/update', auth.verifyToken,productController.Update);

router.post('/delete', auth.verifyToken,productController.Delete);

router.post('/delete_product_imgs',auth.verifyToken, productController.DeleteProductImgs);
router.post('/update_meeting_status', productController.UpdateMeetingStatus);
router.get('/listbyorder', productController.listinsequence)
router.get('/listofgoliveandschedule',productController.listofgoliveandschedule)


module.exports = router;