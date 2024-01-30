var express = require('express');
var router = express.Router();
var yearController= require('./../../../src/controllers/admin/yearController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

/*router.get('/list',auth.verifyToken, cityController.List);

router.post('/add',auth.verifyToken, cityController.Add);

router.post('/getinfo',auth.verifyToken, cityController.Edit);

router.post('/update',auth.verifyToken, cityController.Update);

router.post('/delete',auth.verifyToken, cityController.Delete);*/

router.get('/list', yearController.List);

router.post('/add', yearController.Add);

router.post('/getinfo', yearController.Edit);

router.post('/update', yearController.Update);

router.post('/delete', yearController.Delete);
router.get('/listinvalue',yearController.Listbyvalue)


module.exports = router;