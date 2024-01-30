var createError = require('http-errors');
require('dotenv').config();
var express = require('express');
const fileUpload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash        = require('connect-flash');
const {Cron}=require('./src/controllers/cron/cron')
Cron()

var cors=require('cors');


// var CountryApiRouter = require('./src/routes/admin/country');
// var StateRouter = require('./src/routes/admin/state');
// var CityRouter = require('./src/routes/admin/city');
var YearApiRouter = require('./src/routes/admin/year');
// var Newyearrouter=require('./src/routes/admin/newyear')
var CategoryRouter = require('./src/routes/admin/category');
var SubCategoryRouter = require('./src/routes/admin/sub_category');
var SubscriptionRouter = require('./src/routes/admin/subscription');
var ProductRouter = require('./src/routes/admin/product');
var BannerRouter = require('./src/routes/admin/banner');
var DashboardRouter = require('./src/routes/admin/dashboard');
var AdminCustomerRouter = require('./src/routes/admin/customer');
var AdminBidderRouter = require('./src/routes/admin/bidder');
var CountryRouter = require('./src/routes/admin/country');
var CityRouter = require('./src/routes/admin/city');
var BrandRouter = require('./src/routes/admin/brand');
var ModelRouter = require('./src/routes/admin/model');

var LoginRouter = require('./src/routes/login');
var RegRouter = require('./src/routes/register');
var ContactWebRouter = require('./src/routes/website/contact');
var ContactApiRouter = require('./src/routes/api/contact');

var LoginApiRouter = require('./src/routes/api/login');
var LoginWebRouter = require('./src/routes/website/login');

var RegisterApiRouter = require('./src/routes/api/register');
var RegisterWebRouter = require('./src/routes/website/register');

var BidderApiRouter = require('./src/routes/api/bidder');
var ProductApiRouter = require('./src/routes/api/product');
var CustomerApiRouter = require('./src/routes/api/customer');

var WebBidderApiRouter = require('./src/routes/website/bidder');
var WebProductApiRouter = require('./src/routes/website/product');
var WebCustomerApiRouter = require('./src/routes/website/customer');

var ForgetPasswordApiRouter = require('./src/routes/api/forgetpassword');
var NotoficationWebRouter = require('./src/routes/website/notifications');
var NotoficationApiRouter = require('./src/routes/api/notifications');

var UserAdminRouter = require('./src/routes/admin/user');
var UserApiRouter = require('./src/routes/api/user');
var UserWebRouter = require('./src/routes/website/user');


var CommentAdminRouter = require('./src/routes/admin/comment');
var CommentApiRouter = require('./src/routes/api/comment');
var CommentWebRouter = require('./src/routes/website/comment');

var bid_chatAdminRouter=require('./src/routes/admin/bid_chat')
var bid_chatApiRouter=require('./src/routes/api/bid_chat')
var bid_chatwebsiteRouter=require('./src/routes/admin/bid_chat')

// var ForgetPasswordWebRouter = require('./src/routes/website/forgetpassword');
// new_not used
// var CustomerProductRouter = require('./src/routes/customer/product');

// new end_not used

var app = express();

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());

app.use(cookieParser());

app.use(session({ secret: '123',resave: false,saveUninitialized: false }));

app.use(flash());

var sessionFlash = function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();

}
app.use(sessionFlash)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/site', express.static('static'));

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public')));
// app.use(sqlInjectReject());
// app.use(helmet());

// app.use('/admin/country',CountryApiRouter);
// app.use('/admin/city',CityRouter);
// app.use('/admin/state',StateRouter);
app.use('/admin/category',CategoryRouter);
app.use('/admin/sub_category',SubCategoryRouter);
app.use('/admin/subscription',SubscriptionRouter);
app.use('/admin/product',ProductRouter);
app.use('/admin/banner',BannerRouter);
app.use('/admin/dashboard',DashboardRouter);
app.use('/admin/customer',AdminCustomerRouter);
app.use('/admin/bidder',AdminBidderRouter);
app.use('/admin/country',CountryRouter);
app.use('/admin/city',CityRouter);
app.use('/admin/brand',BrandRouter);
app.use('/admin/model',ModelRouter);
app.use('/admin/year',YearApiRouter);
// app.use('/admin/newyear',Newyearrouter)


// app.use('/user/user_reg',UserRegRouter);
// app.use('/client/client_reg',ClientRegRouter);


app.use('/login', LoginRouter);
app.use('/register', RegRouter);

app.use('/api/contact', ContactApiRouter);
app.use('/website/contact', ContactWebRouter);


app.use('/api/login',LoginApiRouter);
app.use('/api/register',RegisterApiRouter);
app.use('/api/bidder',BidderApiRouter);
app.use('/api/product',ProductApiRouter);
app.use('/api/customer',CustomerApiRouter);
app.use('/api/notify',NotoficationApiRouter);

app.use('/website/login',LoginWebRouter);
app.use('/website/register',RegisterWebRouter);
app.use('/website/bidder',WebBidderApiRouter);
app.use('/website/product',WebProductApiRouter);
app.use('/website/customer',WebCustomerApiRouter);
app.use('/website/notify',NotoficationWebRouter);


app.use('/admin/user',UserAdminRouter);
app.use('/api/user',UserApiRouter);
app.use('/website/user',UserWebRouter);

app.use('/admin/comment',CommentAdminRouter);
app.use('/api/comment',CommentApiRouter);
app.use('/website/comment',CommentWebRouter)
app.use('/admin/bidchat',bid_chatAdminRouter)
app.use('/api/bidchat',bid_chatApiRouter)
app.use('/website/bidchat',bid_chatwebsiteRouter)

// new_not used
// app.use('/customer/product',CustomerProductRouter);
// new end_not used








// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.removeHeader('X-Powered-By');
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

  res.locals.message = err.message;
   console.log(err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page

  res.status(err.status || 500);
  res.send({success: false,message: 'Api Not Found',data: []}); 
});

module.exports = app;