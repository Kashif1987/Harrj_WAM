var express = require('express');
var router = express.Router();
var loginController= require('./../../src/controllers/loginController.js');

const auth = require('./../../src/config/auth');


router.post('/', loginController.Login);
router.post('/loginadmin', loginController.LoginAdmin);
router.post('/forgotpassword', loginController.ForgotPassword);
// router.post('/login_otp_verify',auth.verifyOTPToken, loginController.Login);
router.post('/logout',auth.verifyToken, loginController.Logout);
router.post('/updatepassword', loginController.UpdatePassword);
router.post('/check_otp', loginController.OtpCheck);

router.post('/google_login', loginController.GoogleLogin);
router.post('/live_login', loginController.LiveLogin);

module.exports = router;