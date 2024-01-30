var express = require('express');
var router = express.Router();
var countryController= require('./../../../src/controllers/admin/countryController.js');
const auth = require('./../../../src/config/auth');
const cache = require('./../../../src/helper/cache.js');

/*router.get('/list',auth.verifyToken, countryController.List);

router.post('/add',auth.verifyToken, countryController.Add);

router.post('/getinfo',auth.verifyToken, countryController.Edit);

router.post('/update',auth.verifyToken, countryController.Update);

router.post('/delete',auth.verifyToken, countryController.Delete);*/

router.get('/list', countryController.List);

router.post('/add', countryController.Add);

router.post('/getinfo', countryController.Edit);

router.post('/update', countryController.Update);

router.post('/delete', countryController.Delete);

router.post('/country_city_list', countryController.CountryCityList);


module.exports = router;