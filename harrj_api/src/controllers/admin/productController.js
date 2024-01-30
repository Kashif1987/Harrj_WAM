

const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('products');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;
const ADMIN_ROLE = process.env.ADMIN_ROLE;
const ACTIVE_PRODUCT = process.env.ACTIVE_PRODUCT;
const ARCHIVE_STATUS = process.env.ARCHIVE_STATUS;
// const fs = require('fs');
const cmn_help = require('./../../../src/helper/comman_helper');
const firebase=require('../../helper/firebaseapp')


const Productsfolderpath = '/xampp/htdocs/sauction_api_bk_05022022_new_1230pm/sauction_api/public/uploads/products/';
const ProductsUploadLink = process.env.HOST + process.env.PORT + '/uploads/products/';

const moment = require('moment');
const { max } = require('moment');
const { error } = require('console');
let now = moment();
var dt_tim = moment.utc().format();
var todays_dt = moment.utc(dt_tim).local().add(5, 'hours').add(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");

async function GetProductFirstImg(result, res) {
	return new Promise(async function (resolve, reject) {
		for (let i = 0; i < result.length; i++) {
			result[i]['product_img'] = await model.GetProductFirstImg(result[i]['product_id']);
		}
		resolve(result);
	});
}

// module.exports = {
// 	List: async (req, res) => {
// 		try {
// 			let query = "SELECT p.product_id,totalbids.bidCount,p.category_id,cat.category_name,p.sub_category_id,p.brand_id,b.brand_name,b.brand_name_arabic,p.model_id,m.model_name,m.model_name_arabic,p.year_id,p.starting_price,p.country_id,co.country_name,p.city_id,ci.city_name,p.title,p.name,p.auction_type, DATE_FORMAT(p.start_date_time,'%d-%m-%Y') as start_date_time,	TIME_FORMAT(p.start_time,'%h:%i %p') as start_time, DATE_FORMAT(p.end_date_time,'%d-%m-%Y') as end_date_time, TIME_FORMAT(p.end_time,'%h:%i %p') as end_time FROM products p LEFT JOIN country co ON co.country_id=p.country_id LEFT JOIN category cat ON cat.category_id=p.category_id LEFT JOIN city ci ON ci.city_id=p.city_id LEFT JOIN brand b ON b.brand_id=p.brand_id LEFT JOIN model m ON m.model_id=p.model_id LEFT JOIN (select count(b1.bid_id) as bidCount,b1.product_id from bids b1 group by b1.product_id) as totalbids on totalbids.product_id = p.product_id WHERE p.status=?";

// 			let data = [ACTIVE_STATUS];
// 			if (req.query.name && req.query.name != '') {
// 				query += ' and p.name like ?';
// 				data.push('%#' + req.query.name + '%');
// 			}
// 			if (req.query.max_price_filter && req.query.max_price_filter != ''  && req.query.max_price_filter != 0) {
// 				query += ' and p.starting_price <= ?';
// 				data.push(req.query.max_price_filter);
// 			}
// 			if (req.query.product_id && req.query.product_id != '') {
// 				let proid_arr= req.query.product_id.split(',');
// 				query += " and p.product_id in (?)";
// 				data.push(proid_arr);
// 				// query += ' and product_id in ?';
// 				// data.push('%#' + req.query.product_id + '%');
// 			}
			
// 			if (req.query.category_id && req.query.category_id != '') {				
// 				let cat_arr= req.query.category_id.split(',');
// 				query += " and p.category_id in (?)";
// 				data.push(cat_arr);
// 			}
// 			if(req.query.sub_category_id && req.query.sub_category_id!='')
// 			{
// 				let subcat_arr= req.query.sub_category_id.split(',');
// 				query+=" and p.sub_category_id in (?)";
// 				data.push(eval(subcat_arr));
// 			}

// 			if (req.query.brand_id && req.query.brand_id != '') {
// 				let brand_arr= req.query.brand_id.split(',');
// 				query += " and p.brand_id in (?)";
// 				data.push(eval(brand_arr));
// 			}
// 			if (req.query.model_id && req.query.model_id != '') {
// 				let model_arr= req.query.model_id.split(',');
// 				query += " and p.model_id in (?)";
// 				data.push(eval(model_arr));
// 			}
// 			if (req.query.city_id && req.query.city_id != '') {
// 				let city_arr= req.query.city_id.split(',');
// 				query += " and p.city_id in (?)";
// 				data.push(eval(city_arr));
// 			}
// 			if (req.query.country_id && req.query.country_id != '') {
// 				let country_arr= req.query.country_id.split(',');
// 				query += " and p.country_id in (?)";
// 				data.push(eval(country_arr));
// 			}
// 			if (req.query.auction_type && req.query.auction_type != '') {
// 				let auc_arr= String(req.query.auction_type).split(',');
// 				query += " and p.auction_type in (?)";
// 				data.push(eval(auc_arr));
// 				console.log("BAstard2 " + auc_arr);
// 			}
// 			if (req.query.year_id && req.query.year_id != '') {
// 				let year_arr= req.query.year_id.split(',');
// 				query += " and p.year_id in (?)";
// 				data.push(eval(year_arr));
// 			}

// 			// if (req.query.last_id && req.query.last_id > 0) {
// 			// 	query += " and product_id<?";
// 			// 	data.push(eval(req.query.last_id));
// 			// }
// 			if (req.query.sort_by && req.query.sort_by != '') {
// 				if (req.query.sort_by == 'low_to_high') {
// 					query += " ORDER BY p.starting_price DESC";
// 				}
// 				else if (req.query.sort_by == 'high_to_low') {
// 					query += " ORDER BY p.starting_price";
// 				}
// 				// else if(req.query.sort_by=='high_to_low')
// 				// {
// 				// 	query+=" ORDER BY starting_price";
// 				// 	data.push(req.query.sort_by);
// 				// }
// 				if (req.query.page_records && req.query.page_records > 0) {
// 					query += ' LIMIT ?';
// 					data.push(eval(req.query.page_records));
// 				}

// 			}
// 			else {
// 				if (req.query.page_records && req.query.page_records > 0) {
// 					query += ' ORDER BY p.product_id DESC LIMIT ?';
// 					data.push(eval(req.query.page_records));
// 				}
// 				else {
// 					query += ' ORDER BY p.product_id DESC';
// 				}
// 			}

// 			let result = await model.QueryListData(query, data, res);
// 			if (result) {

// 				result = await GetProductFirstImg(result, res);

// 				res.send({
// 					success: true,
// 					message: 'Successfull',
// 					data: result
// 				});
// 			} else
// 				res.send({
// 					success: false,
// 					message: 'Failed',
// 					data: []
// 				});
// 		} catch (error) {
// 			// console.log(e.message);
// 			res.send({
// 				success: false,
// 				message: 'Something Went Wrong...',
// 				data: error.message
// 			});
// 		}

// 	},

// 	ArchiveList: async (req, res) => {
// 		try {
// 			let query = "SELECT p.product_id,totalbids.bidCount,p.category_id,p.sub_category_id,p.brand_id,b.brand_name,p.model_id,m.model_name,p.year_id,p.starting_price,p.country_id,co.country_name,p.city_id,ci.city_name,p.title,p.name,p.auction_type, DATE_FORMAT(p.start_date_time,'%d-%m-%Y') as start_date_time,	TIME_FORMAT(p.start_time,'%h:%i %p') as start_time, DATE_FORMAT(p.end_date_time,'%d-%m-%Y') as end_date_time, TIME_FORMAT(p.end_time,'%h:%i %p') as end_time FROM products p LEFT JOIN country co ON co.country_id=p.country_id LEFT JOIN city ci ON ci.city_id=p.city_id LEFT JOIN brand b ON b.brand_id=p.brand_id LEFT JOIN model m ON m.model_id=p.model_id LEFT JOIN (select count(b1.bid_id) as bidCount,b1.product_id from bids b1 group by b1.product_id) as totalbids on totalbids.product_id = p.product_id WHERE p.status=?";

// 			let data = [ARCHIVE_STATUS];
// 			if (req.query.name && req.query.name != '') {
// 				query += ' and p.name like ?';
// 				data.push('%#' + req.query.name + '%');
// 			}
// 			if (req.query.max_price_filter && req.query.max_price_filter != ''  && req.query.max_price_filter != 0) {
// 				query += ' and p.starting_price <= ?';
// 				data.push(req.query.max_price_filter);
// 			}
// 			if (req.query.product_id && req.query.product_id != '') {
// 				let proid_arr= req.query.product_id.split(',');
// 				query += " and p.product_id in (?)";
// 				data.push(proid_arr);
// 				// query += ' and product_id in ?';
// 				// data.push('%#' + req.query.product_id + '%');
// 			}
			
// 			if (req.query.category_id && req.query.category_id != '') {				
// 				let cat_arr= req.query.category_id.split(',');
// 				query += " and p.category_id in (?)";
// 				data.push(cat_arr);
// 			}
// 			if(req.query.sub_category_id && req.query.sub_category_id!='')
// 			{
// 				let subcat_arr= req.query.sub_category_id.split(',');
// 				query+=" and p.sub_category_id in (?)";
// 				data.push(eval(subcat_arr));
// 			}

// 			if (req.query.brand_id && req.query.brand_id != '') {
// 				let brand_arr= req.query.brand_id.split(',');
// 				query += " and p.brand_id in (?)";
// 				data.push(eval(brand_arr));
// 			}
// 			if (req.query.model_id && req.query.model_id != '') {
// 				let model_arr= req.query.model_id.split(',');
// 				query += " and p.model_id in (?)";
// 				data.push(eval(model_arr));
// 			}
// 			if (req.query.city_id && req.query.city_id != '') {
// 				let city_arr= req.query.city_id.split(',');
// 				query += " and p.city_id in (?)";
// 				data.push(eval(city_arr));
// 			}
// 			if (req.query.country_id && req.query.country_id != '') {
// 				let country_arr= req.query.country_id.split(',');
// 				query += " and p.country_id in (?)";
// 				data.push(eval(country_arr));
// 			}
// 			if (req.query.auction_type && req.query.auction_type != '') {
// 				let auc_arr= req.query.auction_type.split(',');
// 				query += " and p.auction_type=?";
// 				data.push(eval(auc_arr));
// 			}
// 			if (req.query.year_id && req.query.year_id != '') {
// 				let year_arr= req.query.year_id.split(',');
// 				query += " and p.year_id in (?)";
// 				data.push(eval(year_arr));
// 			}

// 			// if (req.query.last_id && req.query.last_id > 0) {
// 			// 	query += " and product_id<?";
// 			// 	data.push(eval(req.query.last_id));
// 			// }
// 			if (req.query.sort_by && req.query.sort_by != '') {
// 				if (req.query.sort_by == 'low_to_high') {
// 					query += " ORDER BY p.starting_price DESC";
// 				}
// 				else if (req.query.sort_by == 'high_to_low') {
// 					query += " ORDER BY p.starting_price";
// 				}
// 				// else if(req.query.sort_by=='high_to_low')
// 				// {
// 				// 	query+=" ORDER BY starting_price";
// 				// 	data.push(req.query.sort_by);
// 				// }
// 				if (req.query.page_records && req.query.page_records > 0) {
// 					query += ' LIMIT ?';
// 					data.push(eval(req.query.page_records));
// 				}

// 			}
// 			else {
// 				if (req.query.page_records && req.query.page_records > 0) {
// 					query += ' ORDER BY product_id DESC LIMIT ?';
// 					data.push(eval(req.query.page_records));
// 				}
// 				else {
// 					query += ' ORDER BY product_id DESC';
// 				}
// 			}

// 			let result = await model.QueryListData(query, data, res);
// 			if (result) {

// 				result = await GetProductFirstImg(result, res);

// 				res.send({
// 					success: true,
// 					message: 'Successfull',
// 					data: result
// 				});
// 			} else
// 				res.send({
// 					success: false,
// 					message: 'Failed',
// 					data: []
// 				});
// 		} catch (error) {
// 			// console.log(e.message);
// 			res.send({
// 				success: false,
// 				message: 'Something Went Wrong...',
// 				data: error.message
// 			});
// 		}

// 	},


// 	Add: async (req, res) => {
// 		const validationRule = {
// 			'name': 'required',
// 			'title': 'required',
// 			'description': 'required',
// 			'keywords': 'required',
// 			'category_id': 'required',
// 			'sub_category_id': 'required',
// 			'brand_id': 'required',
// 			'model_id': 'required',
// 			'country_id': 'required',
// 			'city_id': 'required',
// 			'auction_type': 'required',
// 			'start_date_time': 'required',
// 			// 'end_date_time': 'required',
// 			'starting_price': 'required',
// 			'refund': 'required',
// 			'customer_id':'required'
// 			// 'refund_days': 'required',
// 		}
// 		validator(req.query, validationRule, {}, async (err, status) => {
// 			console.log(status);
// 			if (!status) {
// 				res.send({
// 					success: false,
// 					message: 'Validation failed',
// 					data: err
// 				});
// 			}
// 			else {
// 				try {
// 					let now = moment();
// 					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
// 					let products_data = {};

// 					products_data.name = req.body.name;
// 					products_data.title = req.body.title;
// 					products_data.description = req.body.description;
// 					products_data.keywords = req.body.keywords;
// 					products_data.category_id = req.body.category_id;
// 					products_data.sub_category_id = req.body.sub_category_id;
// 					products_data.brand_id = req.body.brand_id;
// 					products_data.model_id = req.body.model_id;
// 					products_data.country_id = req.body.country_id;
// 					products_data.city_id = req.body.city_id;
// 					products_data.auction_type = req.body.auction_type;
// 					products_data.start_date_time = req.body.start_date_time;
// 					// products_data.end_date_time = req.body.end_date_time;
// 					products_data.starting_price = req.body.starting_price;
// 					products_data.refund = req.body.refund;
// 					products_data.refund_days = req.body.refund_days;
// 					// products_data.add_by = req.logged_in_id;
// 					products_data.add_dt = todays_dt;
// 					products_data.status = ACTIVE_STATUS;
// 					products_data.product_status = ACTIVE_PRODUCT;
// 					if (req.logged_in_id && req.logged_in_id != 'undefined' && req.logged_in_id != '') {
// 						products_data.add_by = req.logged_in_id;
// 					}
// 					else{
// 						products_data.add_by = req.body.customer_id;
// 					}
					
// 					if (req.body.start_time && req.body.start_time != 'undefined' && req.body.start_time != '') {
// 						products_data.start_time = req.body.start_time;
// 					}
// 					if (req.body.end_time && req.body.end_time != 'undefined' && req.body.end_time != '') {
// 						products_data.end_time = req.body.end_time;
// 					}

// 					// if (req.role && req.role !== 'undefined' && req.role !== '' ) {
// 					// 	products_data.product_status = ACTIVE_PRODUCT;
// 					// }
// 					if (req.body.zoom_link && req.body.zoom_link != 'undefined' && req.body.zoom_link != '') {
// 						products_data.zoom_link = req.body.zoom_link;
// 					}
// 					if (req.body.end_date_time && req.body.end_date_time !== 'undefined' && req.body.end_date_time !== '' ) {
// 						products_data.end_date_time = req.body.end_date_time;
// 					}
// 					if (req.body.year_id && req.body.year_id !== 'undefined' && req.body.year_id !== '') {
// 						products_data.year_id = req.body.year_id;
// 					}
					
// 					if (req.files && req.files.video) {
// 						var element = req.files.video;
// 						var image_name = now.format("YYYYMMDDHHmmss") + element.name;
// 						element.mv('./public/uploads/products/' + image_name);
// 						products_data.video = image_name;
// 					}
					
// 					let query = "INSERT INTO `products`SET ? ";
// 					let data = [products_data];
// 					let result1 = await model.QueryPostData(query, data, res);
// 					// console.log("Shree");
// 					console.log(result1);
// 					if (result1 && typeof result1 !== "undefined" && result1.affectedRows > 0) {
// 						if (req.files && req.files.product_img && req.files.product_img != '' && req.files.product_img != 'undefined') {
// 							var product_img = req.files.product_img;
// 							if (!Array.isArray(product_img)) {
// 								var temp = product_img;
// 								product_img = [];
// 								product_img.push(temp);
// 							}
// 							let i = 0;
// 							product_img.forEach(async element => {
// 								i++;
// 								image_name = i + "_" + now.format("YYYYMMDDHHmmss") + element.name;
// 								element.mv('./public/uploads/products/' + image_name);
// 								let sub_query = "INSERT INTO `product_imgs`(`product_img`, `product_id`,`status`,`add_dt`,`add_by`) VALUES (?,?,?,?,?)";
// 								let sub_data = [image_name, result1.insertId, ACTIVE_STATUS, todays_dt, req.logged_in_id];
// 								await model.QueryPostData(sub_query, sub_data, res);

// 							});
// 						}
// 						res.send({
// 							success: true,
// 							message: 'Product Added successfully..!',
// 							data: []
// 						});
// 					}
// 					else {
// 						res.send({
// 							success: false,
// 							message: 'Product Not Added successfully..!',
// 							data: []
// 						});

// 					}
// 				} catch (error) {
// 					// console.log(e.message);
// 					res.send({
// 						success: false,
// 						message: 'Something Went Wrong...',
// 						data: error.message
// 					});
// 				}
// 			}
// 		});

// 	},

// 	AddLive: async (req, res) => {
// 		const validationRule = {
// 			// 'name': 'required',
// 			'title': 'required',
// 			'description': 'required',
// 			// 'keywords': 'required',
// 			// 'category_id': 'required',
// 			// 'sub_category_id': 'required',
// 			// 'brand_id': 'required',
// 			// 'model_id': 'required',
// 			'country_id': 'required',
// 			'city_id': 'required',
// 			'auction_type': 'required',
// 			'start_date_time': 'required',
// 			// 'end_date_time': 'required',
// 			// 'starting_price': 'required',
// 			// 'refund': 'required'
// 			// 'refund_days': 'required',
// 		}
// 		validator(req.body, validationRule, {}, async (err, status) => {
// 			console.log(status);
// 			if (!status) {
// 				res.send({
// 					success: false,
// 					message: 'Validation failed',
// 					data: err
// 				});
// 			}
// 			else {
// 				try {
// 					let now = moment();
// 					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
// 					let products_data = {};
// 					let session_meet_id= 'Harrj'+req.body.title.substring(0,5)+ (Math.floor(Math.random()*90000) + 10000);
// 					let session_meet_pass= Math.floor(Math.random()*90000) + 10000;
					
// 					console.log(session_meet_id);
// 					// products_data.name = req.body.name;
// 					products_data.title = req.body.title;
// 					products_data.description = req.body.description;
// 					// products_data.keywords = req.body.keywords;
// 					// products_data.category_id = req.body.category_id;
// 					// products_data.sub_category_id = req.body.sub_category_id;
// 					// products_data.brand_id = req.body.brand_id;
// 					// products_data.model_id = req.body.model_id;
// 					products_data.country_id = req.body.country_id;
// 					products_data.city_id = req.body.city_id;
// 					products_data.auction_type = req.body.auction_type;
// 					products_data.start_date_time = req.body.start_date_time;
// 					// products_data.end_date_time = req.body.end_date_time;
// 					// products_data.starting_price = req.body.starting_price;
// 					// products_data.refund = req.body.refund;
// 					// products_data.refund_days = req.body.refund_days;
// 					products_data.meeting_id =session_meet_id;
// 					products_data.meeting_password =session_meet_pass;
// 					products_data.add_by = req.logged_in_id;
// 					products_data.add_dt = todays_dt;
// 					products_data.status = ACTIVE_STATUS;
// 					products_data.product_status = ACTIVE_PRODUCT;
					
// 					if (req.body.start_time && req.body.start_time != 'undefined' && req.body.start_time != '') {
// 						products_data.start_time = req.body.start_time;
// 					}
// 					if (req.body.end_time && req.body.end_time != 'undefined' && req.body.end_time != '') {
// 						products_data.end_time = req.body.end_time;
// 					}

// 					// if (req.role && req.role !== 'undefined' && req.role !== '' ) {
// 					// 	products_data.product_status = ACTIVE_PRODUCT;
// 					// }
// 					if (req.body.zoom_link && req.body.zoom_link != 'undefined' && req.body.zoom_link != '') {
// 						products_data.zoom_link = req.body.zoom_link;
// 					}
// 					if (req.body.end_date_time && req.body.end_date_time !== 'undefined' && req.body.end_date_time !== '' ) {
// 						products_data.end_date_time = req.body.end_date_time;
// 					}
// 					if (req.body.year_id && req.body.year_id !== 'undefined' && req.body.year_id !== '') {
// 						products_data.year_id = req.body.year_id;
// 					}
					


// 					if (req.files && req.files.video) {
// 						var element = req.files.video;
// 						var image_name = now.format("YYYYMMDDHHmmss") + element.name;
// 						element.mv('./public/uploads/products/' + image_name);
// 						products_data.video = image_name;
// 					}

// 					let query = "INSERT INTO `products`SET ? ";
// 					let data = [products_data];
// 					let result1 = await model.QueryPostData(query, data, res);
// 					// console.log("Shree");
// 					console.log(result1);
// 					if (result1 && typeof result1 !== "undefined" && result1.affectedRows > 0) {
// 						if (req.files && req.files.product_img && req.files.product_img != '' && req.files.product_img != 'undefined') {
// 							var product_img = req.files.product_img;
// 							if (!Array.isArray(product_img)) {
// 								var temp = product_img;
// 								product_img = [];
// 								product_img.push(temp);
// 							}
// 							let i = 0;
// 							product_img.forEach(async element => {
// 								i++;
// 								image_name = i + "_" + now.format("YYYYMMDDHHmmss") + element.name;
// 								element.mv('./public/uploads/products/' + image_name);
// 								let sub_query = "INSERT INTO `product_imgs`(`product_img`, `product_id`,`status`,`add_dt`,`add_by`) VALUES (?,?,?,?,?)";
// 								let sub_data = [image_name, result1.insertId, ACTIVE_STATUS, todays_dt, req.logged_in_id];
// 								await model.QueryPostData(sub_query, sub_data, res);

// 							});

// 						}
// 						let res_obj={};
// 							res_obj['meeting_id']=session_meet_id;
// 							res_obj['metteing_pass']=session_meet_pass;

// 						res.send({							
// 							success: true,
// 							message: 'Product Added successfully..!',
// 							data: res_obj
// 						});
// 					}
// 					else {
// 						res.send({
// 							success: false,
// 							message: 'Product Not Added successfully..!',
// 							data: []
// 						});

// 					}
// 				} catch (error) {
// 					// console.log(e.message);
// 					res.send({
// 						success: false,
// 						message: 'Something Went Wrong...',
// 						data: error.message
// 					});
// 				}
// 			}
// 		});

// 	},

// 	Edit: async (req, res) => {
// 		const validationRule = {
// 			'product_id': 'required'
// 		}
// 		validator(req.body, validationRule, {}, async (err, status) => {
// 			console.log(status);
// 			if (!status) {
// 				res.send({
// 					success: false,
// 					message: 'Validation failed',
// 					data: err
// 				});
// 			}
// 			else {
// 				try {
// 					let query = "SELECT a.*,DATE_FORMAT(a.start_date_time,'%Y-%m-%d') as start_date_time,TIME_FORMAT(a.start_time,'%H:%i') as start_time, Concat(?, CASE WHEN a.video  != '' THEN  Concat(a.video) end) as video,b.category_name,c.brand_name,d.model_name FROM `products` as a left join category as b on a.category_id=b.category_id left join brand as c on a.brand_id=c.brand_id left join model as d on a.model_id=d.model_id left join year as y on a.year_id=y.year_id left join sub_category as e on e.sub_category_id=a.sub_category_id WHERE a.product_id = ? AND a.status=?";
// 					let data = [ProductsUploadLink, req.body.product_id, ACTIVE_STATUS];
// 					if (req.body.year_id && req.body.year_id != '') {
// 						query += " and a.year_id=?";
// 						data.push(eval(req.body.year_id));
// 					}
// 					let result = await model.QueryListData(query, data, res);
// 					if (result && result.length > 0) {
// 						query = "SELECT product_img_id,Concat(?, CASE WHEN product_img  != '' THEN  Concat(product_img ) end) as product_img FROM product_imgs WHERE product_id=? and status=?";
// 						data = [ProductsUploadLink, result[0]['product_id'], ACTIVE_STATUS];
// 						result[0]['product_img_list'] = await model.QueryListData(query, data, res);

// 						res.send({
// 							success: true,
// 							message: '',
// 							data: result
// 						});
// 					}
// 					else
// 						res.send({
// 							success: false,
// 							message: '',
// 							data: []
// 						});
// 				} catch (error) {
// 					// console.log(e.message);
// 					res.send({
// 						success: false,
// 						message: 'Something Went Wrong...',
// 						data: error.message
// 					});
// 				}
// 			}
// 		});
// 	},
	
// 	Update: async (req, res) => {
// 		const validationRule = {
// 			'product_id': 'required',
// 			'name': 'required',
// 			'title': 'required',
// 			'description': 'required',
// 			'keywords': 'required',
// 			'category_id': 'required',
// 			'sub_category_id': 'required',
// 			'brand_id': 'required',
// 			'model_id': 'required',
// 			'country_id': 'required',
// 			'city_id': 'required',
// 			'auction_type': 'required',
// 			'start_date_time': 'required',
// 			// 'end_date_time': 'required',
// 			'starting_price': 'required',
// 			'refund': 'required'
// 			// 'refund_days': 'required',
// 		}
// 		validator(req.body, validationRule, {}, async (err, status) => {
// 			console.log(status);
// 			if (!status) {
// 				res.send({
// 					success: false,
// 					message: 'Validation failed',
// 					data: err
// 				});
// 			}
// 			else {
// 				try {
// 					let now = moment();
// 					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
// 					let products_data = {};

// 					products_data.name = req.body.name;
// 					products_data.keywords = req.body.keywords;
// 					products_data.category_id = req.body.category_id;
// 					products_data.sub_category_id = req.body.sub_category_id;
// 					products_data.brand_id = req.body.brand_id;
// 					products_data.model_id = req.body.model_id;
// 					products_data.country_id = req.body.country_id;
// 					products_data.city_id = req.body.city_id;
// 					products_data.title = req.body.title;
// 					products_data.description = req.body.description;
// 					products_data.auction_type = req.body.auction_type;
// 					products_data.start_date_time = req.body.start_date_time;
// 					// products_data.end_date_time = req.body.end_date_time;
// 					products_data.starting_price = req.body.starting_price;
// 					// products_data.high_price = req.body.high_price;
// 					// products_data.final_price = req.body.final_price;
// 					products_data.refund = req.body.refund;
// 					products_data.refund_days = req.body.refund_days;
// 					products_data.mdf_by = req.logged_in_id;
// 					products_data.mdf_dt = todays_dt;

// 					if (req.body.start_time && req.body.start_time != 'undefined' && req.body.start_time != '') {
// 						products_data.start_time = req.body.start_time;
// 					}
// 					if (req.body.end_time && req.body.end_time != 'undefined' && req.body.end_time != '') {
// 						products_data.end_time = req.body.end_time;
// 					}
// 					if (req.body.zoom_link && req.body.zoom_link != 'undefined' && req.body.zoom_link != '') {
// 						products_data.zoom_link = req.body.zoom_link;
// 					}
// 					if (req.body.end_date_time && req.body.end_date_time !== 'undefined' && req.body.end_date_time !== '') {
// 						products_data.end_date_time = req.body.end_date_time;
// 					}
// 					if (req.body.year_id && req.body.year_id != '' && req.body.year_id !== 'undefined') {
// 						products_data.year_id = req.body.year_id;
// 					}

// 					if (req.files && req.files.video) {
// 						var element = req.files.video;
// 						var image_name = now.format("YYYYMMDDHHmmss") + element.name;
// 						element.mv('./public/uploads/products/' + image_name);
// 						products_data.video = image_name;
// 					}

// 					let query = "UPDATE `products` SET ? WHERE product_id=? AND status=?";
// 					// console.log(query);
// 					let data = [products_data, req.body.product_id, ACTIVE_STATUS];
// 					let result = await model.QueryPostData(query, data, res);
// 					if (result) {
// 						if (req.files && req.files.product_img && req.files.product_img != '' && req.files.product_img != 'undefined') {
// 							var product_img = req.files.product_img;
// 							if (!Array.isArray(product_img)) {
// 								var temp = product_img;
// 								product_img = [];
// 								product_img.push(temp);
// 							}
// 							let i = 1;
// 							// console.log("Shree");
// 							console.log(product_img);
// 							product_img.forEach(async element => {
// 								if (element.name != '') {
// 									i++;
// 									image_name = i + "_" + now.format("YYYYMMDDHHmmss") + element.name;
// 									element.mv('./public/uploads/products/' + image_name);
// 									let sub_query = "INSERT INTO `product_imgs`(`product_img`, `product_id`,`status`,`add_dt`,`add_by`) VALUES (?,?,?,?,?)";
// 									let sub_data = [image_name, req.body.product_id, ACTIVE_STATUS, todays_dt, req.logged_in_id];
// 									await model.QueryPostData(sub_query, sub_data, res);

// 								}

// 							});
// 						}
// 						res.send({
// 							success: true,
// 							message: 'Product updated successfully..!',
// 							data: []
// 						});
// 					} else {
// 						res.send({
// 							success: false,
// 							message: 'Product updated Unsuccessfull..!',
// 							data: []
// 						});
// 					}
// 				} catch (error) {
// 					// console.log(e.message);
// 					res.send({
// 						success: false,
// 						message: 'Something Went Wrong...',
// 						data: error.message
// 					});
// 				}

// 			}
// 		});

// 	},

// 	Archive: async (req, res) => {
// 		const validationRule = {
// 			'product_id': 'required'
// 		}
// 		validator(req.body, validationRule, {}, async (err, status) => {
// 			console.log(status);
// 			if (!status) {
// 				res.send({
// 					success: false,
// 					message: 'Validation failed',
// 					data: err
// 				});
// 			}
// 			else {
// 				try {
// 					let now = moment();
// 					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
// 					let query = "UPDATE `products` SET `status` =?, `mdf_by`=?,`mdf_dt`=? WHERE `product_id` = ?";
// 					let data = [ARCHIVE_STATUS, req.logged_in_id, todays_dt, req.body.product_id];

// 					let result = await model.QueryPostData(query, data, res);
// 					if (result) {

// 						return res.send({
// 							success: true,
// 							message: 'Product Archived successfully..!',
// 							data: []
// 						});
// 					} else {
// 						return res.send({
// 							success: false,
// 							message: 'Product Archived Unsuccessfull..!',
// 							data: []
// 						});
// 					}
// 				} catch (error) {
// 					// console.log(e.message);
// 					res.send({
// 						success: false,
// 						message: 'Something Went Wrong...',
// 						data: error.message
// 					});
// 				}
// 			}
// 		});
// 	},
	
// 	Delete: async (req, res) => {
// 		const validationRule = {
// 			'product_id': 'required'
// 		}
// 		validator(req.body, validationRule, {}, async (err, status) => {
// 			console.log(status);
// 			if (!status) {
// 				res.send({
// 					success: false,
// 					message: 'Validation failed',
// 					data: err
// 				});
// 			}
// 			else {
// 				try {
// 					let now = moment();
// 					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
// 					let query = "UPDATE `products` SET `status` =?, `mdf_by`=?,`mdf_dt`=? WHERE `product_id` = ?";
// 					let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.product_id];

// 					let result = await model.QueryPostData(query, data, res);
// 					if (result) {

// 						return res.send({
// 							success: true,
// 							message: 'Product Deleted successfully..!',
// 							data: []
// 						});
// 					} else {
// 						return res.send({
// 							success: false,
// 							message: 'Product Deleted Unsuccessfull..!',
// 							data: []
// 						});
// 					}
// 				} catch (error) {
// 					// console.log(e.message);
// 					res.send({
// 						success: false,
// 						message: 'Something Went Wrong...',
// 						data: error.message
// 					});
// 				}
// 			}
// 		});
// 	},

// 	DeleteProductImgs: async (req, res) => {
// 		const validationRule = {
// 			'product_img_id': 'required'
// 		}
// 		validator(req.body, validationRule, {}, async (err, status) => {
// 			console.log(status);
// 			if (!status) {
// 				res.send({
// 					success: false,
// 					message: 'Validation failed',
// 					data: err
// 				});
// 			}
// 			else {
// 				try {
					
// 					let query1 = "Select product_img from product_imgs WHERE product_img_id=?";
// 					// console.log("day00");
// 					let result = await model.QueryListData(query1, [req.body.product_img_id], res);

// 					if (result) {
// 							// console.log(result[0].product_img);
// 							// console.log(Productsfolderpath+result[0].product_img);
// 							var flag=0;
// 							fs.unlink(Productsfolderpath+result[0].product_img, (err => {
// 								if (err){
// 									console.log(err);
// 									flag=1;									
// 								} 
// 								else {
// 								  console.log("\nDeleted file:" + result[0].product_img);
// 								//   console.log("day4");							  
// 								}
// 							  }));
// 							  let query= "Delete from product_imgs WHERE product_img_id=?";
// 							let result1 = await model.QueryListData(query, [req.body.product_img_id], res);
// 							var msg='';
// 							if(result1)
// 							{
// 								if(flag==1){
// 									msg="image does not exist but records removed";
// 								}
// 								else{
// 									msg="Product img file removed successfully...!";
// 								}
// 								res.send({
// 									success: true,
// 									message: msg,
// 									data: []
// 								});
// 							}
// 							else{
// 								res.send({
// 									success: false,
// 									message: 'Product img file not removed ...!',
// 									data: []
// 								});
// 							}
							
// 					}
// 					else
// 					{		res.send({
// 								success: false,
// 								message: 'Product img file name not found...!',
// 								data: []
// 							});
// 					}
// 				} catch (error) {
// 					// console.log(e.message);
// 					res.send({
// 						success: false,
// 						message: 'Something Went Wrong...',
// 						data: error.message
// 					});
// 				}

// 			}
// 		});
// 	},


// 	UpdateProductStatus: async (req, res) => {
// 		const validationRule = {
// 			'product_id': 'required',
// 			'product_status': 'required',
// 		}
// 		validator(req.body, validationRule, {}, async (err, status) => {
// 			console.log(status);
// 			if (!status) {
// 				res.send({
// 					success: false,
// 					message: 'Validation failed',
// 					data: err
// 				});
// 			}
// 			else {
// 				try {
// 					let now = moment();
// 					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
// 					let products_data = {};

// 					products_data.product_status = req.body.product_status;
// 					products_data.mdf_by = req.logged_in_id;
// 					products_data.mdf_dt = todays_dt;


// 					let query = "UPDATE `products` SET ? WHERE product_id=? AND status=?";
// 					let data = [products_data, req.body.product_id, ACTIVE_STATUS];
// 					let result = await model.QueryPostData(query, data, res);
// 					if (result) {
// 						res.send({
// 							success: true,
// 							message: 'Product Status Updated Successfully..!',
// 							data: []
// 						});
// 					} else {
// 						res.send({
// 							success: false,
// 							message: 'Product Status Updated Unsuccessfull..!',
// 							data: []
// 						});
// 					}
// 				} catch (error) {
// 					// console.log(e.message);
// 					res.send({
// 						success: false,
// 						message: 'Something Went Wrong...',
// 						data: error.message
// 					});
// 				}
// 			}
// 		});

// 	},


// 	ProductBids: async (req, res) => {
// 		const validationRule = {
// 			'product_id': 'required'
// 		}
// 		validator(req.body, validationRule, {}, async (err, status) => {
// 			console.log(status);
// 			if (!status) {
// 				res.send({
// 					success: false,
// 					message: 'Validation failed',
// 					data: err
// 				});
// 			}
// 			else {
// 				try {
// 					let query = "SELECT a.bid_id,a.bidder_id,a.bid_amount,a.bid_status,DATE_FORMAT(a.add_dt,'%d-%m-%Y %h:%i:%p') as add_dt,a.product_id,c.name as customer_name,b.name as bidder_name,a.bid_amount,a.bid_status,a.add_dt as bid_date,a.mdf_dt as bid_modified_date	FROM `bids` as a left join user as b on a.bidder_id=b.id left join user as c on a.customer_id=c.id	WHERE a.product_id = ? AND a.status=?";
// 					let data = [req.body.product_id, ACTIVE_STATUS];
// 					let result = await model.QueryListData(query, data, res);
// 					if (result && result.length > 0) {
// 						res.send({
// 							success: true,
// 							message: '',
// 							data: result
// 						});
// 					}
// 					else
// 						res.send({
// 							success: false,
// 							message: '',
// 							data: []
// 						});
// 				} catch (error) {
// 					// console.log(e.message);
// 					res.send({
// 						success: false,
// 						message: 'Something Went Wrong...',
// 						data: error.message
// 					});
// 				}
// 			}
// 		});
// 	},


// }

module.exports = {
	List: async (req, res) => {
		var dt_timm = moment.utc().format();
		var todays_dtts = moment.utc(dt_timm).format("YYYY.MM.DD HH:mm:ss");
		try {
			// let query = "SELECT p.product_id,totalbids.bidCount, max_bid.max_bid_amount,p.category_id,p.sub_category_id,cat.category_name,p.brand_id,p.starting_price,p.max_price,b.brand_name,b.brand_name_arabic,p.model_id,m.model_name,m.model_name_arabic,p.year_id,p.starting_price,p.country_id,co.country_name,p.city_id,ci.city_name,p.title,p.name,p.auction_type, p.meeting_status, DATE_FORMAT(p.start_date_time,'%Y-%m-%d') as start_date_time,	TIME_FORMAT(p.start_time,'%h:%i:%S') as start_time, DATE_FORMAT(p.end_date_time,'%Y-%m-%d') as end_date_time, TIME_FORMAT(p.end_time,'%h:%i:%S') as end_time FROM products p LEFT JOIN country co ON co.country_id=p.country_id LEFT JOIN city ci ON ci.city_id=p.city_id LEFT JOIN category cat ON cat.category_id=p.category_id LEFT JOIN brand b ON b.brand_id=p.brand_id LEFT JOIN model m ON m.model_id=p.model_id LEFT JOIN (select count(b1.bid_id) as bidCount,b1.product_id from bids b1 group by b1.product_id) as totalbids on totalbids.product_id = p.product_id LEFT JOIN (select max(b2.bid_amount) as max_bid_amount,b2.product_id from bids b2 group by b2.product_id) as max_bid on max_bid.product_id = p.product_id WHERE p.status=? and p.meeting_status!=2 and (p.end_date_time>=? or p.end_date_time is null) ";
			let query = "SELECT p.product_id,totalbids.bidCount, max_bid.max_bid_amount,p.category_id,p.sub_category_id,cat.category_name,p.brand_id,p.starting_price,p.max_price,b.brand_name,b.brand_name_arabic,p.model_id,m.model_name,m.model_name_arabic,p.year_id,p.starting_price,p.country_id,co.country_name,p.city_id,ci.city_name,p.title,p.name,p.auction_type, p.meeting_status, DATE_FORMAT(p.start_date_time,'%Y-%m-%d') as start_date_time,	TIME_FORMAT(p.start_time,'%h:%i:%S') as start_time, DATE_FORMAT(p.end_date_time,'%Y-%m-%d') as end_date_time, TIME_FORMAT(p.end_time,'%h:%i:%S') as end_time FROM products p LEFT JOIN country co ON co.country_id=p.country_id LEFT JOIN city ci ON ci.city_id=p.city_id LEFT JOIN category cat ON cat.category_id=p.category_id LEFT JOIN brand b ON b.brand_id=p.brand_id LEFT JOIN model m ON m.model_id=p.model_id LEFT JOIN (select count(b1.bid_id) as bidCount,b1.product_id from bids b1 group by b1.product_id) as totalbids on totalbids.product_id = p.product_id LEFT JOIN (select max(b2.bid_amount) as max_bid_amount,b2.product_id from bids b2 group by b2.product_id) as max_bid on max_bid.product_id = p.product_id WHERE p.status=? ";
			let data = [ACTIVE_STATUS];
			
			if (req.query.name && req.query.name != '') {
				query += ' and p.name like ?';
				data.push('%' + req.query.name + '%');
			}
			if (req.query.title && req.query.title != '') {
				query += ' and p.title like ?';
				data.push('%' + req.query.title + '%');
			}
			if (req.query.description && req.query.description != '') {
				query += ' and p.description like ?';
				data.push('%' + req.query.description + '%');
			}
			if (req.query.max_price_filter && req.query.max_price_filter != ''  && req.query.max_price_filter != 0) {
				query += ' and p.starting_price <= ?';
				data.push(req.query.max_price_filter);
			}
			if (req.query.product_id && req.query.product_id != '') {
				let proid_arr= req.query.product_id.split(',');
				query += " and p.product_id in (?)";
				data.push(proid_arr);
				// query += ' and product_id in ?';
				// data.push('%#' + req.query.product_id + '%');
			}
			
			if (req.query.category_id && req.query.category_id != '') {				
				let cat_arr= req.query.category_id.split(',');
				query += " and p.category_id in (?)";
				data.push(cat_arr);
			}
			if(req.query.sub_category_id && req.query.sub_category_id!='')
			{
				let subcat_arr= req.query.sub_category_id.split(',');
				query+=" and p.sub_category_id in (?)";
				data.push(eval(subcat_arr));
			}

			if (req.query.brand_id && req.query.brand_id != '') {
				let brand_arr= req.query.brand_id.split(',');
				query += " and p.brand_id in (?)";
				data.push(eval(brand_arr));
			}
			if (req.query.model_id && req.query.model_id != '') {
				let model_arr= req.query.model_id.split(',');
				query += " and p.model_id in (?)";
				data.push(eval(model_arr));
			}
			if (req.query.city_id && req.query.city_id != '') {
				let city_arr= req.query.city_id.split(',');
				query += " and p.city_id in (?)";
				data.push(eval(city_arr));
			}
			if (req.query.country_id && req.query.country_id != '') {
				let country_arr= req.query.country_id.split(',');
				query += " and p.country_id in (?)";
				data.push(eval(country_arr));
			}
			if (req.query.auction_type == 'golivenow') {
				console.log("yo");
				let auc_arr= String(req.query.auction_type).split(',');
				query += " and p.auction_type ='golivenow' and p.end_date_time >= ? and p.end_date_time IS NOT NULL";
				data.push(todays_dtts);
				// data.push(todays_dt);
			}
			if (req.query.auction_type && req.query.auction_type != '' && req.query.auction_type != 'currentgolivenow' && req.query.auction_type != 'currentonline' && req.query.auction_type != 'golivenow') {
				console.log("yo1");
				let auc_arr= String(req.query.auction_type).split(',');
				query += " and p.auction_type in (?)";
				data.push(eval(auc_arr));
			}
			if (req.query.auction_type == 'currentgolivenow') {
				console.log("yo2");
				let auc_arr= String(req.query.auction_type).split(',');
				// query += " and p.auction_type ='golivenow' and p.start_date_time < ? and p.end_date_time >= ?";
				query += " and p.auction_type ='golivenow'and  p.meeting_status=0 and p.end_date_time > ?";
				data.push(todays_dtts);
				// data.push(todays_dt);
			}
			if (req.query.auction_type == 'currentonline') {
				console.log("yo3");
				let auc_arr= String(req.query.auction_type).split(',');
				query += " and p.auction_type ='online' and p.meeting_status=0 and p.end_date_time > ?";
				data.push(todays_dtts);
				// data.push(todays_dt);
			}
			if (req.query.year_id && req.query.year_id != '') {
				let year_arr= req.query.year_id.split(',');
				query += " and p.year_id in (?)";
				data.push(eval(year_arr));
			}
			if (req.query.last_id && req.query.last_id != '' && req.query.last_id != 0) {
				// let year_arr= req.query.year_id.split(',');
				query += " and p.product_id<? ";
				data.push(req.query.last_id);
			}
			// if (req.query.last_id && req.query.last_id > 0) {
			// 	query += " and product_id<?";
			// 	data.push(eval(req.query.last_id));
			// }
			if (req.query.sort_by && req.query.sort_by != '') {
				if (req.query.sort_by == 'low_to_high') {
					query += " ORDER BY p.starting_price DESC";
				}
				else if (req.query.sort_by == 'high_to_low') {
					query += " ORDER BY p.starting_price";
				}
				// else if(req.query.sort_by=='high_to_low')
				// {
				// 	query+=" ORDER BY starting_price";
				// 	data.push(req.query.sort_by);
				// }
				if (req.query.page_records && req.query.page_records > 0) {
					query += ' LIMIT ?';
					data.push(eval(req.query.page_records));
				}

			}
			else {
				if (req.query.page_records && req.query.page_records > 0) {
					query += ' ORDER BY p.product_id DESC LIMIT ?';
					data.push(eval(req.query.page_records));
				}
				else {
					query += ' ORDER BY p.product_id DESC';
				}
			}

			let result = await model.QueryListData(query, data, res);
			if (result) {

				result = await GetProductFirstImg(result, res);

				res.send({
					success: true,
					message: 'Successfull',
					message_arabic:"ناجح",
					data: result
				});
			} else
				res.send({
					success: false,
					message: 'Failed',
					message_arabic:"فشل",
					data: []
				});
		} catch (error) {
			// console.log(e.message);
			res.send({
				success: false,
				message: 'Something Went Wrong...',
				message_arabic:"حدث خطأ صوتي",
				data: error.message
			});
		}

	},

	ArchiveList: async (req, res) => {
		try {
			let query = "SELECT p.product_id,totalbids.bidCount,p.category_id,p.sub_category_id,p.brand_id,b.brand_name,b.brand_name_arabic,p.model_id,m.model_name,m.model_name_arabic,p.year_id,p.starting_price,p.country_id,co.country_name,p.city_id,ci.city_name,p.title,p.name,p.auction_type, DATE_FORMAT(p.start_date_time,'%Y-%m-%d') as start_date_time,	TIME_FORMAT(p.start_time,'%h:%i:%S') as start_time, DATE_FORMAT(p.end_date_time,'%Y-%m-%d') as end_date_time, TIME_FORMAT(p.end_time,'%h:%i:%S') as end_time FROM products p LEFT JOIN country co ON co.country_id=p.country_id LEFT JOIN city ci ON ci.city_id=p.city_id LEFT JOIN brand b ON b.brand_id=p.brand_id LEFT JOIN model m ON m.model_id=p.model_id LEFT JOIN (select count(b1.bid_id) as bidCount,b1.product_id from bids b1 group by b1.product_id) as totalbids on totalbids.product_id = p.product_id WHERE p.status=?";

			let data = [ARCHIVE_STATUS];
			if (req.query.name && req.query.name != '') {
				query += ' and p.name like ?';
				data.push('%' + req.query.name + '%');
			}
			if (req.query.title && req.query.title != '') {
				query += ' and p.title like ?';
				data.push('%' + req.query.title + '%');
			}
			if (req.query.max_price_filter && req.query.max_price_filter != ''  && req.query.max_price_filter != 0) {
				query += ' and p.starting_price <= ?';
				data.push(req.query.max_price_filter);
			}
			if (req.query.product_id && req.query.product_id != '') {
				let proid_arr= req.query.product_id.split(',');
				query += " and p.product_id in (?)";
				data.push(proid_arr);
				// query += ' and product_id in ?';
				// data.push('%#' + req.query.product_id + '%');
			}
			
			if (req.query.category_id && req.query.category_id != '') {				
				let cat_arr= req.query.category_id.split(',');
				query += " and p.category_id in (?)";
				data.push(cat_arr);
			}
			if(req.query.sub_category_id && req.query.sub_category_id!='')
			{
				let subcat_arr= req.query.sub_category_id.split(',');
				query+=" and p.sub_category_id in (?)";
				data.push(eval(subcat_arr));
			}

			if (req.query.brand_id && req.query.brand_id != '') {
				let brand_arr= req.query.brand_id.split(',');
				query += " and p.brand_id in (?)";
				data.push(eval(brand_arr));
			}
			if (req.query.model_id && req.query.model_id != '') {
				let model_arr= req.query.model_id.split(',');
				query += " and p.model_id in (?)";
				data.push(eval(model_arr));
			}
			if (req.query.city_id && req.query.city_id != '') {
				let city_arr= req.query.city_id.split(',');
				query += " and p.city_id in (?)";
				data.push(eval(city_arr));
			}
			if (req.query.country_id && req.query.country_id != '') {
				let country_arr= req.query.country_id.split(',');
				query += " and p.country_id in (?)";
				data.push(eval(country_arr));
			}
			if (req.query.auction_type && req.query.auction_type != '') {
				let auc_arr= req.query.auction_type.split(',');
				query += " and p.auction_type=?";
				data.push(eval(auc_arr));
			}
			if (req.query.year_id && req.query.year_id != '') {
				let year_arr= req.query.year_id.split(',');
				query += " and p.year_id in (?)";
				data.push(eval(year_arr));
			}

			// if (req.query.last_id && req.query.last_id > 0) {
			// 	query += " and product_id<?";
			// 	data.push(eval(req.query.last_id));
			// }
			if (req.query.sort_by && req.query.sort_by != '') {
				if (req.query.sort_by == 'low_to_high') {
					query += " ORDER BY p.starting_price DESC";
				}
				else if (req.query.sort_by == 'high_to_low') {
					query += " ORDER BY p.starting_price";
				}
				// else if(req.query.sort_by=='high_to_low')
				// {
				// 	query+=" ORDER BY starting_price";
				// 	data.push(req.query.sort_by);
				// }
				if (req.query.page_records && req.query.page_records > 0) {
					query += ' LIMIT ?';
					data.push(eval(req.query.page_records));
				}

			}
			else {
				if (req.query.page_records && req.query.page_records > 0) {
					query += ' ORDER BY p.product_id DESC LIMIT ?';
					data.push(eval(req.query.page_records));
				}
				else {
					query += ' ORDER BY p.product_id DESC';
				}
			}

			let result = await model.QueryListData(query, data, res);
			if (result) {

				result = await GetProductFirstImg(result, res);

				res.send({
					success: true,
					message: 'Successfull',
					message_arabic:"ناجح",
					data: result
				});
			} else
				res.send({
					success: false,
					message: 'Failed',
					message_arabic:"فشل",
					data: []
				});
		} catch (error) {
			// console.log(e.message);
			res.send({
				success: false,
				message: 'Something Went Wrong...',
				message_arabic:"حدث خطأ صوتي",
				data: error.message
			});
		}

	},

	Add: async (req, res) => {
		const validationRule = {
			// 'name': 'required',
			'title': 'required',
			//'description': 'required',
			// 'keywords': 'required',
			'category_id': 'required',
			'sub_category_id': 'required',
			'brand_id': 'required',
			'model_id': 'required',
			'country_id': 'required',
			'city_id': 'required',
			'auction_type': 'required',
			'start_date_time': 'required',
			// 'end_date_time': 'required',
			
			//'refund': 'required',  // as per requirment
			'customer_id':'required'
			// 'refund_days': 'required',
		}
		validator(req.body, validationRule, {}, async (err, status) => {
			console.log(status);
			if (!status) {
				res.send({
					success: false,
					message: 'Validation failed',
					message_arabic:"فشل التحقق من الصحة",
					data: err
				});
			}
			else {
				try {
					let now = moment();
					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
					let products_data = {};

					products_data.name = req.body.name;
					products_data.title = req.body.title;
					products_data.description = req.body.description;
					products_data.keywords = req.body.keywords;
					products_data.category_id = req.body.category_id;
					products_data.sub_category_id = req.body.sub_category_id;
					products_data.brand_id = req.body.brand_id;
					products_data.model_id = req.body.model_id;
					products_data.country_id = req.body.country_id;
					products_data.city_id = req.body.city_id;
					products_data.auction_type = req.body.auction_type;
					products_data.start_date_time = req.body.start_date_time;
					// products_data.end_date_time = req.body.end_date_time;
					if (req.body.starting_price && req.body.starting_price!=="" && req.body.starting_price!=="undefined") {
						products_data.starting_price = req.body.starting_price;
					}
					
					//products_data.refund = req.body.refund;
					products_data.refund_days = req.body.refund_days;
					// products_data.add_by = req.logged_in_id;
					products_data.add_dt = todays_dt;
					products_data.status = ACTIVE_STATUS;
					products_data.product_status = ACTIVE_PRODUCT;
					if (req.logged_in_id && req.logged_in_id != 'undefined' && req.logged_in_id != '') {
						products_data.add_by = req.logged_in_id;
					}
					else{
						products_data.add_by = req.body.customer_id;
					}
					
					if (req.body.start_time && req.body.start_time != 'undefined' && req.body.start_time != '') {
						products_data.start_time = req.body.start_time;
					}
					if (req.body.end_time && req.body.end_time != 'undefined' && req.body.end_time != '') {
						products_data.end_time = req.body.end_time;
					}

					// if (req.role && req.role !== 'undefined' && req.role !== '' ) {
					// 	products_data.product_status = ACTIVE_PRODUCT;
					// }
					if (req.body.zoom_link && req.body.zoom_link != 'undefined' && req.body.zoom_link != '') {
						products_data.zoom_link = req.body.zoom_link;
					}
					if (req.body.end_date_time && req.body.end_date_time !== 'undefined' && req.body.end_date_time !== '' ) {
						products_data.end_date_time = req.body.end_date_time;
					}
					if (req.body.year_id && req.body.year_id !== 'undefined' && req.body.year_id !== '') {
						products_data.year_id = req.body.year_id;
					}
					if(req.body.starting_price && req.body.starting_price!='' && req.body.starting_price!='undefined'){
						products_data.starting_price=req.body.starting_price
					}
					if(req.body.max_price && req.body.max_price!='' && req.body.max_price!='undefined'){
						products_data.max_price=req.body.max_price
					}
					if (req.files && req.files.video) {
						var element = req.files.video;
						var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						element.mv('./public/uploads/products/' + image_name);
						products_data.video = image_name;
					}
					
					let query = "INSERT INTO `products`SET ? ";
					let data = [products_data];
					let result1 = await model.QueryPostData(query, data, res);
					// console.log("Shree");
					console.log(result1);
					if (result1 && typeof result1 !== "undefined" && result1.affectedRows > 0) {
						if (req.files && req.files.product_img && req.files.product_img != '' && req.files.product_img != 'undefined') {
							var product_img = req.files.product_img;
							if (!Array.isArray(product_img)) {
								var temp = product_img;
								product_img = [];
								product_img.push(temp);
							}
							let i = 0;
							product_img.forEach(async element => {
								i++;
								image_name = i + "_" + now.format("YYYYMMDDHHmmss") + element.name;
								element.mv('./public/uploads/products/' + image_name);
								let sub_query = "INSERT INTO `product_imgs`(`product_img`, `product_id`,`status`,`add_dt`,`add_by`) VALUES (?,?,?,?,?)";
								let sub_data = [image_name, result1.insertId, ACTIVE_STATUS, todays_dt, req.logged_in_id];
								await model.QueryPostData(sub_query, sub_data, res);

							});
						}
						res.send({
							success: true,
							message: 'Product added successfully',
							message_arabic:"تمت إضافة المنتج بنجاح",
							data: []
						});
					}
					else {
						res.send({
							success: false,
							message: 'Product added unsuccessfully',
							message_arabic:"تمت إضافة المنتج دون جدوى",
							data: []
						});

					}
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong',
						message_arabic:"حدث خطأ صوتي",
						data: error.message
					});
				}
			}
		});

	},

	AddLive: async (req, res) => {
		const validationRule = {
			'name': 'required',
			'title': 'required',
			'description': 'required',
			'keyword': 'required',
			// 'category_id': 'required',
			// 'sub_category_id': 'required',
			// 'brand_id': 'required',
			// 'model_id': 'required',
			'country_id': 'required',
			'city_id': 'required',
			'auction_type': 'required',
			'start_date_time': 'required',
			// 'end_date_time': 'required',
			// 'max_price': 'required',
			// 'refund': 'required'
			// 'refund_days': 'required',
		}
		validator(req.body, validationRule, {}, async (err, status) => {
			console.log(status);
			if (!status) {
				res.send({
					success: false,
					message: 'Validation failed',
					message_arabic:"فشل التحقق من الصحة",
					data: err
				});
			}
			else {
				try {
					let now = moment();
					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
					let products_data = {};
					let session_meet_id= 'Harrj'+req.body.title.substring(0,5)+ (Math.floor(Math.random()*90000) + 10000);
					let session_meet_pass= Math.floor(Math.random()*90000) + 10000;
					
					console.log(session_meet_id);
					// products_data.name = req.body.name;
					products_data.title = req.body.title;
					products_data.description = req.body.description;
					products_data.keywords = req.body.keywords;
					// products_data.category_id = req.body.category_id;
					// products_data.sub_category_id = req.body.sub_category_id;
					// products_data.brand_id = req.body.brand_id;
					// products_data.model_id = req.body.model_id;
					if(req.body.category_id && req.body.category_id!='' && req.body.category_id!='undefined'){
						products_data.category_id = req.body.category_id;
					}
					if(req.body.sub_category_id && req.body.sub_category_id!='' && req.body.sub_category_id!='undefined'){
						products_data.sub_category_id = req.body.sub_category_id;
					}
					if(req.body.brand_id && req.body.brand_id!='' && req.body.brand_id!='undefined'){
						products_data.brand_id = req.body.brand_id;
					}
					if(req.body.model_id && req.body.model_id!='' && req.body.model_id!='undefined'){
						products_data.model_id = req.body.model_id;
					}
					products_data.country_id = req.body.country_id;
					products_data.city_id = req.body.city_id;
					products_data.auction_type = req.body.auction_type;
					products_data.start_date_time = req.body.start_date_time;
					// products_data.end_date_time = req.body.end_date_time;
					// products_data.starting_price = req.body.starting_price;
					// products_data.refund = req.body.refund;
					// products_data.refund_days = req.body.refund_days;
					products_data.meeting_id =session_meet_id;
					products_data.meeting_password =session_meet_pass;
					// products_data.add_by = req.logged_in_id;
					products_data.add_dt = todays_dt;
					products_data.status = ACTIVE_STATUS;
					products_data.product_status = ACTIVE_PRODUCT;
					
					if (req.logged_in_id && req.logged_in_id != 'undefined' && req.logged_in_id != '') {
						products_data.add_by = req.logged_in_id;
					}
					else{
						products_data.add_by = req.body.customer_id;
					}

					if (req.body.start_time && req.body.start_time != 'undefined' && req.body.start_time != '') {
						products_data.start_time = req.body.start_time;
					}
					if (req.body.end_time && req.body.end_time != 'undefined' && req.body.end_time != '') {
						products_data.end_time = req.body.end_time;
					}

					// if (req.role && req.role !== 'undefined' && req.role !== '' ) {
					// 	products_data.product_status = ACTIVE_PRODUCT;
					// }
					if (req.body.zoom_link && req.body.zoom_link != 'undefined' && req.body.zoom_link != '') {
						products_data.zoom_link = req.body.zoom_link;
					}
					if (req.body.end_date_time && req.body.end_date_time !== 'undefined' && req.body.end_date_time !== '' ) {
						products_data.end_date_time = req.body.end_date_time;
					}
					if (req.body.year_id && req.body.year_id !== 'undefined' && req.body.year_id !== '') {
						products_data.year_id = req.body.year_id;
					}
					


					if (req.files && req.files.video) {
						var element = req.files.video;
						var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						element.mv('./public/uploads/products/' + image_name);
						products_data.video = image_name;
					}

					let query = "INSERT INTO `products`SET ? ";
					let data = [products_data];
					let result1 = await model.QueryPostData(query, data, res);
					// console.log("Shree");
					console.log(result1);
					if (result1 && typeof result1 !== "undefined" && result1.affectedRows > 0) {
						if (req.files && req.files.product_img && req.files.product_img != '' && req.files.product_img != 'undefined') {
							var product_img = req.files.product_img;
							if (!Array.isArray(product_img)) {
								var temp = product_img;
								product_img = [];
								product_img.push(temp);
							}
							let i = 0;
							product_img.forEach(async element => {
								i++;
								image_name = i + "_" + now.format("YYYYMMDDHHmmss") + element.name;
								element.mv('./public/uploads/products/' + image_name);
								let sub_query = "INSERT INTO `product_imgs`(`product_img`, `product_id`,`status`,`add_dt`,`add_by`) VALUES (?,?,?,?,?)";
								let sub_data = [image_name, result1.insertId, ACTIVE_STATUS, todays_dt, req.logged_in_id];
								await model.QueryPostData(sub_query, sub_data, res);

							});

						}
						let res_obj={};
						res_obj['product_id']= result1.insertId;
							res_obj['meeting_id']=session_meet_id;
							res_obj['metteing_pass']=session_meet_pass;

						res.send({							
							success: true,
							message: 'Product added successfully',
							message_arabic:"تمت إضافة المنتج بنجاح",
							data: res_obj
						});
					}
					else {
						res.send({
							success: false,
							message: 'Product added unsuccessfully',
							message_arabic:"تمت إضافة المنتج دون جدوى							",
							data: []
						});

					}
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong',
						message_arabic:"حدث خطأ صوتي",
						data: error.message
					});
				}
			}
		});

	},
	AddLive: async (req, res) => {
		const validationRule = {
			// 'name': 'required',
			'title': 'required',
			'description': 'required',
			// 'keywords': 'required',
			// 'category_id': 'required',
			// 'sub_category_id': 'required',
			// 'brand_id': 'required',
			// 'model_id': 'required',
			'country_id': 'required',
			'city_id': 'required',
			'auction_type': 'required',
			'start_date_time': 'required',
			// 'end_date_time': 'required',
			// 'starting_price': 'required',
			// 'refund': 'required'
			// 'refund_days': 'required',
		}
		validator(req.body, validationRule, {}, async (err, status) => {
			console.log(status);
			if (!status) {
				res.send({
					success: false,
					message: 'Validation failed',
					message_arabic:"فشل التحقق من الصحة",
					data: err
				});
			}
			else {
				try {
					let now = moment();
					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
					let products_data = {};
					let session_meet_id= 'Harrj'+req.body.title.substring(0,5)+ (Math.floor(Math.random()*90000) + 10000);
					let session_meet_pass= Math.floor(Math.random()*90000) + 10000;
					
					console.log(session_meet_id);
					// products_data.name = req.body.name;
					products_data.title = req.body.title;
					products_data.description = req.body.description;
					
					if(req.body.category_id && req.body.category_id!='' && req.body.category_id!='undefined'){
						products_data.category_id = req.body.category_id;
					}
					if(req.body.keywords && req.body.keywords!='' && req.body.keywords!='undefined'){
						products_data.keywords = req.body.keywords;
					}
					if(req.body.sub_category_id && req.body.sub_category_id!='' && req.body.sub_category_id!='undefined'){
						products_data.sub_category_id = req.body.sub_category_id;
					}
					if(req.body.brand_id && req.body.brand_id!='' && req.body.brand_id!='undefined'){
						products_data.brand_id = req.body.brand_id;
					}
					if(req.body.model_id && req.body.model_id!='' && req.body.model_id!='undefined'){
						products_data.model_id = req.body.model_id;
					}
					
					
					
					
					products_data.country_id = req.body.country_id;
					products_data.city_id = req.body.city_id;
					products_data.auction_type = req.body.auction_type;
					products_data.start_date_time = req.body.start_date_time;
					// products_data.end_date_time = req.body.end_date_time;
					// products_data.starting_price = req.body.starting_price;
					// products_data.refund = req.body.refund;
					// products_data.refund_days = req.body.refund_days;
					products_data.meeting_id =session_meet_id;
					products_data.meeting_password =session_meet_pass;
					// products_data.add_by = req.logged_in_id;
					products_data.add_dt = todays_dt;
					products_data.status = ACTIVE_STATUS;
					products_data.product_status = ACTIVE_PRODUCT;
					if (req.logged_in_id && req.logged_in_id != 'undefined' && req.logged_in_id != '') {
						products_data.add_by = req.logged_in_id;
					}
					else{
						products_data.add_by = req.body.customer_id;
					}
					if (req.body.start_time && req.body.start_time != 'undefined' && req.body.start_time != '') {
						products_data.start_time = req.body.start_time;
					}
					if (req.body.end_time && req.body.end_time != 'undefined' && req.body.end_time != '') {
						products_data.end_time = req.body.end_time;
					}

					// if (req.role && req.role !== 'undefined' && req.role !== '' ) {
					// 	products_data.product_status = ACTIVE_PRODUCT;
					// }
					if (req.body.zoom_link && req.body.zoom_link != 'undefined' && req.body.zoom_link != '') {
						products_data.zoom_link = req.body.zoom_link;
					}
					if (req.body.end_date_time && req.body.end_date_time !== 'undefined' && req.body.end_date_time !== '' ) {
						products_data.end_date_time = req.body.end_date_time;
					}
					if (req.body.year_id && req.body.year_id !== 'undefined' && req.body.year_id !== '') {
						products_data.year_id = req.body.year_id;
					}
					


					if (req.files && req.files.video) {
						var element = req.files.video;
						var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						element.mv('./public/uploads/products/' + image_name);
						products_data.video = image_name;
					}

					let query = "INSERT INTO `products`SET ? ";
					let data = [products_data];
					let result1 = await model.QueryPostData(query, data, res);
					// console.log("Shree");
					console.log(result1);
					if (result1 && typeof result1 !== "undefined" && result1.affectedRows > 0) {
						if (req.files && req.files.product_img && req.files.product_img != '' && req.files.product_img != 'undefined') {
							var product_img = req.files.product_img;
							if (!Array.isArray(product_img)) {
								var temp = product_img;
								product_img = [];
								product_img.push(temp);
							}
							let i = 0;
							product_img.forEach(async element => {
								i++;
								image_name = i + "_" + now.format("YYYYMMDDHHmmss") + element.name;
								element.mv('./public/uploads/products/' + image_name);
								let sub_query = "INSERT INTO `product_imgs`(`product_img`, `product_id`,`status`,`add_dt`,`add_by`) VALUES (?,?,?,?,?)";
								let sub_data = [image_name, result1.insertId, ACTIVE_STATUS, todays_dt, req.logged_in_id];
								await model.QueryPostData(sub_query, sub_data, res);

							});

						}
						let res_obj={};
						res_obj['product_id']= result1.insertId;
							res_obj['meeting_id']=session_meet_id;
							res_obj['metteing_pass']=session_meet_pass;

						res.send({							
							success: true,
							message: 'Product added successfully',
							message_arabic:"تمت إضافة المنتج بنجاح",
							data: res_obj
						});
					}
					else {
						res.send({
							success: false,
							message: 'Product added unsuccessfully',
							message_arabic:"تمت إضافة المنتج دون جدوى",
							data: []
						});

					}
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong...',
						message_arabic:"حدث خطأ صوتي",
						data: error.message
					});
				}
			}
		});

	},

	Edit: async (req, res) => {
		const validationRule = {
			'product_id': 'required'
		}
		validator(req.body, validationRule, {}, async (err, status) => {
			console.log(status);
			if (!status) {
				res.send({
					success: false,
					message: 'Validation failed',
					message_arabic:"فشل التحقق من الصحة",
					data: err
				});
			}
			else {
				try {
					// ,DATE_FORMAT(a.start_date_time,'%Y-%m-%d %H:%m:%S') as start_date_time,TIME_FORMAT(a.start_time,'%H:%i') as start_time
					
					let query = "SELECT a.product_id,a.title,a.name,a.description,a.keywords,a.category_id,a.sub_category_id,a.brand_id,a.model_id,a.country_id,a.city_id,a.year_id,a.auction_type,a.start_date_time,a.end_date_time,a.start_time,a.end_time,a.starting_price,a.max_price,a.refund,a.refund_days,a.video,a.meeting_id,a.meeting_status,a.meeting_password,a.zoom_link,a.product_status,a.status,a.add_by,a.mdf_by,a.add_dt,a.mdf_dt ,max_bid.max_bid_amount,f.city_name,DATE_FORMAT(a.start_date_time,'%Y-%m-%d') as start_date_time,DATE_FORMAT(a.end_date_time,'%Y-%m-%d') as end_date_time,TIME_FORMAT(a.start_time,'%H:%i:%S') as start_time,TIME_FORMAT(a.end_time,'%H:%i:%S') as end_time, Concat(?, CASE WHEN a.video  != '' THEN  Concat(a.video) end) as video,b.category_name,b.category_name_arabic,o.sub_category_name,o.sub_category_name_arabic,c.brand_name,c.brand_name_arabic,d.model_name,d.model_name_arabic FROM `products` as a left join category as b on a.category_id=b.category_id left join sub_category as o on a.sub_category_id=o.sub_category_id left join brand as c on a.brand_id=c.brand_id left join model as d on a.model_id=d.model_id left join year as y on a.year_id=y.year_id left join sub_category as e on e.sub_category_id=a.sub_category_id left join city f on f.city_id=a.city_id LEFT JOIN (select max(b2.bid_amount) as max_bid_amount,b2.product_id from bids b2 group by b2.product_id) as max_bid on max_bid.product_id = a.product_id WHERE a.product_id = ?  AND a.status=?";
					let data = [ProductsUploadLink, req.body.product_id, ACTIVE_STATUS];
					if (req.body.year_id && req.body.year_id != '') {
						query += " and a.year_id=?";
						data.push(eval(req.body.year_id));
					}
					let result = await model.QueryListData(query, data, res);
					if (result && result.length > 0) {
						query = "SELECT product_img_id,Concat(?, CASE WHEN product_img  != '' THEN  Concat(product_img ) end) as product_img FROM product_imgs WHERE product_id=? and status=?";
						data = [ProductsUploadLink, result[0]['product_id'], ACTIVE_STATUS];
						result[0]['product_img_list'] = await model.QueryListData(query, data, res);

						res.send({
							success: true,
							message: '',
							message_arabic:"",
							data: result
						});
					}
					else
						res.send({
							success: false,
							message: '',
							message_arabic:"",
							data: []
						});
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong...',
						message_arabic:"حدث خطأ صوتي",
						data: error.message
					});
				}
			}
		});
	},

	Update: async (req, res) => {
		const validationRule = {
			'product_id': 'required',
			// 'name': '',
			// 'title': '',
			// 'description': '',
			// // 'keywords': 'required',
			// 'category_id': 'required',
			// 'sub_category_id': 'required',
			// 'brand_id': 'required',
			// 'model_id': 'required',
			// 'country_id': 'required',
			// 'city_id': 'required',
			// 'auction_type': 'required',
			// 'start_date_time': 'required',
			// // 'end_date_time': 'required',
			// 'starting_price': 'required',
			// 'refund': 'required'
			// // 'refund_days': 'required',
		}
		validator(req.body, validationRule, {}, async (err, status) => {
			console.log(status);
			if (!status) {
				res.send({
					success: false,
					message: 'Validation failed',
					message_arabic:"فشل التحقق من الصحة",
					data: err
				});
			}
			else {
				try {
					let now = moment();
					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
					let products_data = {};
					if (req.body.name && req.body.name != 'undefined' && req.body.name != '') {
						products_data.name = req.body.name;
					}	
					if (req.body.title && req.body.title != 'undefined' && req.body.title != '') {
						products_data.title = req.body.title;
					}	
					if (req.body.description && req.body.description != 'undefined' && req.body.description != '') {
						products_data.description = req.body.description;
					}	
					if (req.body.category_id && req.body.category_id != 'undefined' && req.body.category_id != '') {
						products_data.category_id = req.body.category_id;
					}	
					if (req.body.sub_category_id && req.body.sub_category_id != 'undefined' && req.body.sub_category_id != '') {
						products_data.sub_category_id = req.body.sub_category_id;
					}	
					if (req.body.brand_id && req.body.brand_id != 'undefined' && req.body.brand_id != '') {
						products_data.brand_id = req.body.brand_id;
					}	
					if (req.body.model_id && req.body.model_id != 'undefined' && req.body.model_id != '') {
						products_data.model_id = req.body.model_id;
					}	
					if (req.body.country_id && req.body.country_id != 'undefined' && req.body.country_id != '') {
						products_data.country_id = req.body.country_id;
					}	
					if (req.body.city_id && req.body.city_id != 'undefined' && req.body.city_id != '') {
						products_data.city_id = req.body.city_id;
					}	
					if (req.body.auction_type && req.body.auction_type != 'undefined' && req.body.auction_type != '') {
						products_data.auction_type = req.body.auction_type;
					}	
					if (req.body.start_date_time && req.body.start_date_time != 'undefined' && req.body.start_date_time != '') {
						products_data.start_date_time = req.body.start_date_time;
					}	
					if (req.body.starting_price && req.body.starting_price != 'undefined' && req.body.starting_price != '') {
						products_data.starting_price = req.body.starting_price;
					}	
					if (req.body.refund && req.body.refund != 'undefined' && req.body.refund != '') {
						products_data.refund = req.body.refund;
					}	
					if (req.body.refund_days && req.body.refund_days != 'undefined' && req.body.refund_days != '') {
						products_data.refund_days = req.body.refund_days;
					}	
					// if (req.body.mdf_by && req.body.mdf_by != 'undefined' && req.body.mdf_by != '') {
					// 	products_data.mdf_by = req.body.mdf_by;
					// }
					if (req.body.keywords && req.body.keywords != 'undefined' && req.body.keywords != '') {
						products_data.keywords = req.body.keywords;
					}
					if (req.body.final_price && req.body.final_price != 'undefined' && req.body.final_price != '') {
						products_data.final_price = req.body.final_price;
					}
					if (req.body.high_price && req.body.high_price != 'undefined' && req.body.high_price != '') {
						products_data.high_price = req.body.high_price;
					}
					
					// products_data.name = req.body.name;
					// products_data.keywords = req.body.keywords;
					// products_data.category_id = req.body.category_id;
					// products_data.sub_category_id = req.body.sub_category_id;
					// products_data.brand_id = req.body.brand_id;
					// products_data.model_id = req.body.model_id;
					// products_data.country_id = req.body.country_id;
					// products_data.city_id = req.body.city_id;
					// products_data.title = req.body.title;
					// products_data.description = req.body.description;
					// products_data.auction_type = req.body.auction_type;
					// products_data.start_date_time = req.body.start_date_time;
					// // products_data.end_date_time = req.body.end_date_time;
					// products_data.starting_price = req.body.starting_price;
					// // products_data.high_price = req.body.high_price;
					// // products_data.final_price = req.body.final_price;
					// products_data.refund = req.body.refund;
					// products_data.refund_days = req.body.refund_days;
					// products_data.mdf_by = req.logged_in_id;
					products_data.mdf_dt = todays_dt;

					if (req.logged_in_id && req.logged_in_id != 'undefined' && req.logged_in_id != '') {
						products_data.mdf_by = req.logged_in_id;
					}
					else{
						products_data.mdf_by = req.body.customer_id;
					}

					if (req.body.start_time && req.body.start_time != 'undefined' && req.body.start_time != '') {
						products_data.start_time = req.body.start_time;
					}
					if (req.body.end_time && req.body.end_time != 'undefined' && req.body.end_time != '') {
						products_data.end_time = req.body.end_time;
					}
					if (req.body.zoom_link && req.body.zoom_link != 'undefined' && req.body.zoom_link != '') {
						products_data.zoom_link = req.body.zoom_link;
					}
					if (req.body.end_date_time && req.body.end_date_time !== 'undefined' && req.body.end_date_time !== '') {
						products_data.end_date_time = req.body.end_date_time;
					}
					if (req.body.year_id && req.body.year_id != '' && req.body.year_id !== 'undefined') {
						products_data.year_id = req.body.year_id;
					}

					if (req.files && req.files.video) {
						var element = req.files.video;
						var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						element.mv('./public/uploads/products/' + image_name);
						products_data.video = image_name;
					}

					let query = "UPDATE `products` SET ? WHERE product_id=? AND status=?";
					// console.log(query);
					let data = [products_data, req.body.product_id, ACTIVE_STATUS];
					let result = await model.QueryPostData(query, data, res);
					if (result) {
						if (req.files && req.files.product_img && req.files.product_img != '' && req.files.product_img != 'undefined') {
							var product_img = req.files.product_img;
							if (!Array.isArray(product_img)) {
								var temp = product_img;
								product_img = [];
								product_img.push(temp);
							}
							let i = 1;
							// console.log("Shree");
							console.log(product_img);
							product_img.forEach(async element => {
								if (element.name != '') {
									i++;
									image_name = i + "_" + now.format("YYYYMMDDHHmmss") + element.name;
									element.mv('./public/uploads/products/' + image_name);
									let sub_query = "INSERT INTO `product_imgs`(`product_img`, `product_id`,`status`,`add_dt`,`add_by`) VALUES (?,?,?,?,?)";
									let sub_data = [image_name, req.body.product_id, ACTIVE_STATUS, todays_dt, req.logged_in_id];
									await model.QueryPostData(sub_query, sub_data, res);

								}

							});
						}
						res.send({
							success: true,
							message: 'Product updated successfully',
							message_arabic:"تم تحديث المنتج بنجاح",
							data: []
						});
					} else {
						res.send({
							success: false,
							message: 'Product updated unsuccessfully',
							message_arabic:"تم تحديث المنتج دون جدوى",
							data: []
						});
					}
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong...',
						message_arabic:"حدث خطأ صوتي",
						data: error.message
					});
				}

			}
		});

	},

	UpdateMeetingStatus: async (req, res) => {
		const validationRule = {
			'product_id': 'required',
			'meeting_status': 'required'
		}
		validator(req.body, validationRule, {}, async (err, status) => {
			console.log(status);
			if (!status) {
				res.send({
					success: false,
					message: 'Validation failed',
					message_arabic:"فشل التحقق من الصحة",
					data: err
				});
			}
			else {
				try {
					let now = moment();
					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
					let products_data = {};

					products_data.meeting_status = req.body.meeting_status;
					
					products_data.mdf_by = req.logged_in_id;
					products_data.mdf_dt = todays_dt;

					if (req.logged_in_id && req.logged_in_id != 'undefined' && req.logged_in_id != '') {
						products_data.mdf_by = req.logged_in_id;
					}
					else{
						products_data.mdf_by = req.body.customer_id;
					}

					let query = "UPDATE `products` SET ? WHERE product_id=? AND status=?";
					// console.log(query);
					let data = [products_data, req.body.product_id, ACTIVE_STATUS];
					let result = await model.QueryPostData(query, data, res);
					if (req.body.meeting_status == 2) {
						let userresult= await model.QueryListData("select `firebase_token` from user where status=1 and role=customer AND `firebase_token` is NOT NULL",[ACTIVE_STATUS],res)
						let temp=[]
						userresult.forEach(element => {
							temp.push(element.firebase_token)
						});
						let productinfo=await model.QueryListData("select * from products where status=? and id=?",[ACTIVE_PRODUCT,req.body.product_id],res)
					if (productinfo.length>0) {
						let message = {
							"notification": {
								//   title: 'New Notification about lead',
								//   body: 'Lead has been generated against '+req.body.src+"",
							},
							"data": {
								"title": "Schedule live start",
								"title_arabic": "جدولة بدء البث المباشر",
								"body": "JOIN NOW",
								"body_arabic": "نضم الان",
								"product_name": productinfo[0].title.toString(),
								"product_id": productinfo[0].product_id.toString() ,
								"add_by": productinfo[0].add_by.toString()
							},
							"tokens": temp,
							"priority": "high",
							"content_available": true,
							"apns": {
								"payload": {
								  "aps": {
									"contentAvailable": true,
									"badge" : 0
								  },
								},
							  },

						}	
						let send = await firebase.messaging().sendMulticast(message)
						// .then((respomce) => {
						// 	console.log("responce send successfully", respomce);
						// }).catch((error) => {
						// 	console.log("error", error);
						// })
						console.log("send");
						console.log(send);
					}
						
					}
					if (result) {						
						res.send({
							success: true,
							message: 'Product meeting status updated successfully',
							message_arabic:"تم تحديث حالة اجتماع المنتج بنجاح",
							data: []
						});
					} else {
						res.send({
							success: false,
							message: 'Product meeting status updated unsuccessfull',
							message_arabic:"تم تحديث حالة اجتماع المنتج غير ناجحة",
							data: []
						});
					}
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong',
						message_arabic:"حدث خطأ صوتي",
						data: error.message
					});
				}

			}
		});

	},

	Archive: async (req, res) => {
		const validationRule = {
			'product_id': 'required'
		}
		validator(req.body, validationRule, {}, async (err, status) => {
			console.log(status);
			if (!status) {
				res.send({
					success: false,
					message: 'Validation failed',
					message_arabic:"فشل التحقق من الصحة",
					data: err
				});
			}
			else {
				try {
					let now = moment();
					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
					let query = "UPDATE `products` SET `status` =?, `mdf_by`=?,`mdf_dt`=? WHERE `product_id` = ?";
					let data = [ARCHIVE_STATUS, req.logged_in_id, todays_dt, req.body.product_id];

					let result = await model.QueryPostData(query, data, res);
					if (result) {

						return res.send({
							success: true,
							message: 'Product archived successfully',
							message_arabic:"تمت أرشفة المنتج بنجاح",
							data: []
						});
					} else {
						return res.send({
							success: false,
							message: 'Product archived unsuccessfully',
							message_arabic:"أرشيف المنتج دون جدوى",
							data: []
						});
					}
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong',
						message_arabic:"حدث خطأ صوتي",
						data: error.message
					});
				}
			}
		});
	},

	Delete: async (req, res) => {
		const validationRule = {
			'product_id': 'required'
		}
		validator(req.body, validationRule, {}, async (err, status) => {
			console.log(status);
			if (!status) {
				res.send({
					success: false,
					message: 'Validation failed',
					message_arabic:"فشل التحقق من الصحة",
					data: err
				});
			}
			else {
				try {
					let now = moment();
					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
					let query = "UPDATE `products` SET `status` =?, `mdf_by`=?,`mdf_dt`=? WHERE `product_id` = ?";
					let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.product_id];

					let result = await model.QueryPostData(query, data, res);
					if (result) {

						return res.send({
							success: true,
							message: 'Product deleted successfully',
							message_arabic:"تم حذف المنتج بنجاح",
							data: []
						});
					} else {
						return res.send({
							success: false,
							message: 'Product deleted unsuccessfully',
							message_arabic:"تم حذف المنتج دون نجاح",
							data: []
						});
					}
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong...',
						message_arabic:"حدث خطأ صوتي",
						data: error.message
					});
				}
			}
		});
	},

	DeleteProductImgs: async (req, res) => {
		const validationRule = {
			'product_img_id': 'required'
		}
		validator(req.body, validationRule, {}, async (err, status) => {
			console.log(status);
			if (!status) {
				res.send({
					success: false,
					message: 'Validation failed',
					message_arabic:"فشل التحقق من الصحة",
					data: err
				});
			}
			else {
				try {
					
					let query1 = "Select product_img from product_imgs WHERE product_img_id=?";
					// console.log("day00");
					let result = await model.QueryListData(query1, [req.body.product_img_id], res);

					if (result) {
							// console.log(result[0].product_img);
							// console.log(Productsfolderpath+result[0].product_img);
							var flag=0;
							fs.unlink(Productsfolderpath+result[0].product_img, (err => {
								if (err){
									console.log(err);
									flag=1;									
								} 
								else {
								  console.log("\nDeleted file:" + result[0].product_img);
								//   console.log("day4");							  
								}
							  }));
							  let query= "Delete from product_imgs WHERE product_img_id=?";
							let result1 = await model.QueryListData(query, [req.body.product_img_id], res);
							var msg='';
							var msgarb=""
							if(result1)
							{
								if(flag==1){
									msg="Image does not exist but records removed";
									msgarb="الصورة غير موجودة ولكن تمت إزالة السجلات"
								}
								else{
									msg="Product img file removed successfully";
									msgarb="تمت إزالة ملف صورة المنتج بنجاح"
								}
								res.send({
									success: true,
									message: msg,
									message_arabic:msgarb,
									data: []
								});
							}
							else{
								res.send({
									success: false,
									message: 'Product img file not removed',
									message_arabic:"لم تتم إزالة ملف img المنتج",
									data: []
								});
							}
							
					}
					else
					{		res.send({
								success: false,
								message: 'Product img file name not found',
								message_arabic:"اسم ملف img المنتج غير موجود",
								data: []
							});
					}
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong...',
						message_arabic:"حدث خطأ صوتي",
						data: error.message
					});
				}

			}
		});
	},


	UpdateProductStatus: async (req, res) => {
		const validationRule = {
			'product_id': 'required',
			'product_status': 'required',
		}
		validator(req.body, validationRule, {}, async (err, status) => {
			console.log(status);
			if (!status) {
				res.send({
					success: false,
					message: 'Validation failed',
					message_arabic:"فشل التحقق من الصحة",
					data: err
				});
			}
			else {
				try {
					let now = moment();
					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
					let products_data = {};

					products_data.product_status = req.body.product_status;
					products_data.mdf_by = req.logged_in_id;
					products_data.mdf_dt = todays_dt;


					let query = "UPDATE `products` SET ? WHERE product_id=? AND status=?";
					let data = [products_data, req.body.product_id, ACTIVE_STATUS];
					let result = await model.QueryPostData(query, data, res);
					if (result) {
						res.send({
							success: true,
							message: 'Product status updated successfully',
							message_arabic:"تم تحديث حالة المنتج بنجاح",
							data: []
						});
					} else {
						res.send({
							success: false,
							message: 'Product status updated unsuccessfully',
							message_arabic:"تم تحديث حالة المنتج غير ناجحة",
							data: []
						});
					}
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong...',
						message_arabic:"حدث خطأ صوتي",
						data: error.message
					});
				}
			}
		});

	},


	ProductBids: async (req, res) => {
		const validationRule = {
			'product_id': 'required'
		}
		validator(req.body, validationRule, {}, async (err, status) => {
			console.log(status);
			if (!status) {
				res.send({
					success: false,
					message: 'Validation failed',
					message_arabic:"فشل التحقق من الصحة",
					data: err
				});
			}
			else {
				try {
					let query = "SELECT a.bid_id,a.bidder_id,a.bid_amount,a.bid_status,DATE_FORMAT(a.add_dt,'%d-%m-%Y %h:%i:%p') as add_dt,a.product_id,c.name as customer_name,b.name as bidder_name,a.bid_amount,a.bid_status,a.add_dt as bid_date,a.mdf_dt as bid_modified_date	FROM `bids` as a left join user as b on a.bidder_id=b.id left join user as c on a.customer_id=c.id	WHERE a.product_id = ? AND a.status=?";
					let data = [req.body.product_id, ACTIVE_STATUS];
					let result = await model.QueryListData(query, data, res);
					if (result && result.length > 0) {
						res.send({
							success: true,
							message: '',
							message_arabic:"",
							data: result
						});
					}
					else
						res.send({
							success: false,
							message: '',
							message_arabic:"",
							data: []
						});
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong...',
						message_arabic:"حدث خطأ صوتي",
						data: error.message
					});
				}
			}
		});
	},

	CustomerProductAds: async (req, res) => {
		const validationRule = {
			'customer_id': 'required'
		}
		validator(req.body, validationRule, {}, async (err, status) => {
			console.log(status);
			if (!status) {
				res.send({
					success: false,
					message: 'Validation failed',
					message_arabic:"فشل التحقق من الصحة",
					data: err
				});
			}
			else {
				try {
					let query = "SELECT a.bid_id,a.bidder_id,a.bid_amount,a.bid_status,DATE_FORMAT(a.add_dt,'%d-%m-%Y %h:%i:%p') as add_dt,a.product_id,c.name as customer_name,b.name as bidder_name,a.bid_amount,a.bid_status,a.add_dt as bid_date,a.mdf_dt as bid_modified_date	FROM `bids` as a left join user as b on a.bidder_id=b.id left join user as c on a.customer_id=c.id	WHERE a.product_id = ? AND a.status=?";
					let data = [req.body.product_id, ACTIVE_STATUS];
					let result = await model.QueryListData(query, data, res);
					if (result && result.length > 0) {
						res.send({
							success: true,
							message: '',
							message_arabic:"",
							data: result
						});
					}
					else
						res.send({
							success: false,
							message: '',
							message_arabic:"",
							data: []
						});
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong...',
						message_arabic:"حدث خطأ صوتي",
						data: error.message
					});
				}
			}
		});
	},
	listinsequence:async (req, res)=>{
		// let now = moment();
var dt_timm = moment.utc().format();
		var finalResult = [];
		var todays_dtts = moment.utc(dt_timm).format("YYYY.MM.DD HH:mm:ss");
		try{
			let temp_query=" SELECT p.product_id,totalbids.bidCount, max_bid.max_bid_amount,p.category_id,p.sub_category_id,cat.category_name,p.brand_id,p.starting_price,p.max_price,b.brand_name,b.brand_name_arabic,p.model_id,m.model_name,m.model_name_arabic,p.year_id,p.starting_price,p.country_id,co.country_name,p.city_id,ci.city_name,p.title,p.name,p.auction_type, p.meeting_status, DATE_FORMAT(p.start_date_time,'%Y-%m-%d') as start_date_time,	TIME_FORMAT(p.start_time,'%h:%i:%S') as start_time, DATE_FORMAT(p.end_date_time,'%Y-%m-%d') as end_date_time, TIME_FORMAT(p.end_time,'%h:%i:%S') as end_time FROM products p LEFT JOIN country co ON co.country_id=p.country_id LEFT JOIN city ci ON ci.city_id=p.city_id LEFT JOIN category cat ON cat.category_id=p.category_id LEFT JOIN brand b ON b.brand_id=p.brand_id LEFT JOIN model m ON m.model_id=p.model_id LEFT JOIN (select count(b1.bid_id) as bidCount,b1.product_id from bids b1 group by b1.product_id) as totalbids on totalbids.product_id = p.product_id LEFT JOIN (select max(b2.bid_amount) as max_bid_amount,b2.product_id from bids b2 group by b2.product_id) as max_bid on max_bid.product_id = p.product_id WHERE p.status=?"
			let data=[ACTIVE_STATUS]
			if (req.query.name&&req.query.name!==" ") {
				console.log("filter")
				console.log(req.query.name)
				temp_query+= ' and p.name like ?';
				// queryforSchedule += ' and p.name like ?';
				// queryforNotStarted += ' and p.name like ?';
				// queryforended += ' and p.name like ?';
				data.push('%' + req.query.name + '%');
			}
			if (req.query.title && req.query.title !== '') {
				temp_query += ' and p.title like ?';
				// queryforSchedule += ' and p.title like ?';
				// queryforNotStarted += ' and p.title like ?';
				// queryforended += ' and p.title like ?';
				data.push('%' + req.query.title + '%');
			}
			if (req.query.description && req.query.description !== '') {
				temp_query += ' and p.description like ?';
				// queryforSchedule += ' and p.description like ?';
				// queryforNotStarted += ' and p.description like ?';
				// queryforended += ' and p.description like ?';
				data.push('%' + req.query.description + '%');
			}
			if (req.query.max_price_filter && req.query.max_price_filter !== ''  && req.query.max_price_filter !== 0) {
				temp_query += ' and p.starting_price <= ?';
				// queryforSchedule += ' and p.starting_price <= ?';
				// queryforNotStarted += ' and p.starting_price <= ?';
				// queryforended += ' and p.starting_price <= ?';
				data.push(req.query.max_price_filter);
			}

			
			if (req.query.category_id && req.query.category_id !== '') {				
				let cat_arr= req.query.category_id.split(',');
				temp_query += " and p.category_id in (?)";
				// queryforSchedule += " and p.category_id in (?)";
				// queryforNotStarted += " and p.category_id in (?)";
				// queryforended += " and p.category_id in (?)";
				data.push(cat_arr);
			}
			if(req.query.sub_category_id && req.query.sub_category_id!=='')
			{
				let subcat_arr= req.query.sub_category_id.split(',');
				temp_query+=" and p.sub_category_id in (?)";
				// queryforSchedule+=" and p.sub_category_id in (?)";
				// queryforNotStarted+=" and p.sub_category_id in (?)";
				// queryforended+=" and p.sub_category_id in (?)";

				data.push(eval(subcat_arr));
			}

			if (req.query.brand_id && req.query.brand_id !== '') {
				let brand_arr= req.query.brand_id.split(',');
				temp_query += " and p.brand_id in (?)";
				// queryforSchedule += " and p.brand_id in (?)";
				// queryforNotStarted += " and p.brand_id in (?)";
				// queryforended += " and p.brand_id in (?)";
				data.push(eval(brand_arr));
			}
			if (req.query.model_id && req.query.model_id !== '') {
				let model_arr= req.query.model_id.split(',');
				temp_query += " and p.model_id in (?)";
				// queryforSchedule += " and p.model_id in (?)";
				// queryforNotStarted += " and p.model_id in (?)";
				// queryforended+= " and p.model_id in (?)";
				data.push(eval(model_arr));
			}
			if (req.query.city_id && req.query.city_id !== '') {
				let city_arr= req.query.city_id.split(',');
				temp_query += " and p.city_id in (?)";
				// queryforSchedule += " and p.city_id in (?)";
				// queryforNotStarted += " and p.city_id in (?)";
				// queryforended += " and p.city_id in (?)";
				data.push(eval(city_arr));
			}
			if (req.query.country_id && req.query.country_id !== '') {
				let country_arr= req.query.country_id.split(',');
				temp_query += " and p.country_id in (?)";
				// queryforSchedule += " and p.country_id in (?)";
				// queryforNotStarted += " and p.country_id in (?)";
				// queryforended += " and p.country_id in (?)";
				data.push(eval(country_arr));
			}
			//let query="("+temp_query+" "+"AND auction_type='golivenow' AND meeting_status=1 order by p.product_id DESC)"+" "+"UNION"+" "+"("+temp_query+" "+"AND auction_type='online' AND meeting_status=0 order by p.product_id DESC)"+" "+"UNION"+" "+"("+temp_query+" "+"AND auction_type = 'golivenow' AND meeting_status=0 order by p.product_id DESC)"+" "+"UNION"+" "+"("+temp_query+" "+"AND meeting_status=2 order by p.product_id DESC)"
			let queryforSchedulelive=temp_query+"AND auction_type='online' AND meeting_status=1 order by p.product_id DESC"
			let queryforlive = temp_query+" AND auction_type='golivenow' AND meeting_status=1 order by p.product_id DESC";

			let queryforSchedule= temp_query+" AND auction_type='online' AND meeting_status=0 and end_date_time >= ? order by p.product_id DESC"
			let queryforNotStarted= temp_query+" AND auction_type = 'golivenow' and end_date_time >= ? AND meeting_status=0 order by p.product_id DESC"
			let queryforended=temp_query+" AND meeting_status=2 order by p.product_id DESC"
			
		
		
			let resultforlive=await model.QueryListData(queryforlive,data, res)
			finalResult = finalResult.concat(resultforlive)
			let resultforschedulelive=await model.QueryListData(queryforSchedulelive,data, res)
			finalResult=finalResult.concat(resultforschedulelive)
				data.push(todays_dtts)
				data.push(todays_dtts)
			let resultforschedule=await model.QueryListData(queryforSchedule,data,res)
			finalResult = finalResult.concat(resultforschedule)
			let resultfornotstarted= await model.QueryListData(queryforNotStarted, data, res)
			finalResult = finalResult.concat(resultfornotstarted)
			// let resultforended= await model.QueryListData(queryforended, data, res)
			// finalResult = finalResult.concat(resultforended)

			if(resultforlive&&resultfornotstarted&&resultforschedule){
				finalResult = await GetProductFirstImg(finalResult, res);
				res.send({
					success:true,
					message:"List in a order",
					message_arabic:"قائمة بالترتيب",
					data:finalResult
				})
			}
			else{
				res.send({
					success:false,
					message:"Record not fetched",
					message_arabic:"لم يتم جلب السجل",
					error:error
				})
			}
		}	
		catch(error){
			res.send({
				success:false,
				message:"Something Went Wrong",
				message_arabic:"حدث خطأ صوتي",
				error:error.message
			})
		}
	},
	listofgoliveandschedule:async(req, res)=>{
		try{
			let temp_query="SELECT p.product_id,totalbids.bidCount, max_bid.max_bid_amount,p.category_id,p.sub_category_id,cat.category_name,p.brand_id,p.starting_price,p.max_price,b.brand_name,b.brand_name_arabic,p.model_id,m.model_name,m.model_name_arabic,p.year_id,p.starting_price,p.country_id,co.country_name,p.city_id,ci.city_name,p.title,p.name,p.auction_type, p.meeting_status, DATE_FORMAT(p.start_date_time,'%Y-%m-%d') as start_date_time,	TIME_FORMAT(p.start_time,'%h:%i:%S') as start_time, DATE_FORMAT(p.end_date_time,'%Y-%m-%d') as end_date_time, TIME_FORMAT(p.end_time,'%h:%i:%S') as end_time FROM products p LEFT JOIN country co ON co.country_id=p.country_id LEFT JOIN city ci ON ci.city_id=p.city_id LEFT JOIN category cat ON cat.category_id=p.category_id LEFT JOIN brand b ON b.brand_id=p.brand_id LEFT JOIN model m ON m.model_id=p.model_id LEFT JOIN (select count(b1.bid_id) as bidCount,b1.product_id from bids b1 group by b1.product_id) as totalbids on totalbids.product_id = p.product_id LEFT JOIN (select max(b2.bid_amount) as max_bid_amount,b2.product_id from bids b2 group by b2.product_id) as max_bid on max_bid.product_id = p.product_id WHERE p.status=? AND((auction_type='golivenow' AND meeting_status=1) OR (auction_type='online' AND meeting_status=0))"
			let data=[ACTIVE_STATUS]
			if (req.query.name&&req.query.name!=" ") {
				console.log("filter")
				console.log(req.query.name)
				temp_query+= ' and p.name like ?';
				// queryforSchedule += ' and p.name like ?';
				// queryforNotStarted += ' and p.name like ?';
				// queryforended += ' and p.name like ?';
				data.push('%' + req.query.name + '%');
			}
			if (req.query.title && req.query.title != '') {
				temp_query += ' and p.title like ?';
				// queryforSchedule += ' and p.title like ?';
				// queryforNotStarted += ' and p.title like ?';
				// queryforended += ' and p.title like ?';
				data.push('%' + req.query.title + '%');
			}
			if (req.query.description && req.query.description != '') {
				temp_query += ' and p.description like ?';
				// queryforSchedule += ' and p.description like ?';
				// queryforNotStarted += ' and p.description like ?';
				// queryforended += ' and p.description like ?';
				data.push('%' + req.query.description + '%');
			}
			if (req.query.max_price_filter && req.query.max_price_filter != ''  && req.query.max_price_filter != 0) {
				temp_query += ' and p.starting_price <= ?';
				// queryforSchedule += ' and p.starting_price <= ?';
				// queryforNotStarted += ' and p.starting_price <= ?';
				// queryforended += ' and p.starting_price <= ?';
				data.push(req.query.max_price_filter);
			}

			
			if (req.query.category_id && req.query.category_id != '') {				
				let cat_arr= req.query.category_id.split(',');
				temp_query += " and p.category_id in (?)";
				// queryforSchedule += " and p.category_id in (?)";
				// queryforNotStarted += " and p.category_id in (?)";
				// queryforended += " and p.category_id in (?)";
				data.push(cat_arr);
			}
			if(req.query.sub_category_id && req.query.sub_category_id!='')
			{
				let subcat_arr= req.query.sub_category_id.split(',');
				temp_query+=" and p.sub_category_id in (?)";
				// queryforSchedule+=" and p.sub_category_id in (?)";
				// queryforNotStarted+=" and p.sub_category_id in (?)";
				// queryforended+=" and p.sub_category_id in (?)";

				data.push(eval(subcat_arr));
			}

			if (req.query.brand_id && req.query.brand_id != '') {
				let brand_arr= req.query.brand_id.split(',');
				temp_query += " and p.brand_id in (?)";
				// queryforSchedule += " and p.brand_id in (?)";
				// queryforNotStarted += " and p.brand_id in (?)";
				// queryforended += " and p.brand_id in (?)";
				data.push(eval(brand_arr));
			}
			if (req.query.model_id && req.query.model_id != '') {
				let model_arr= req.query.model_id.split(',');
				temp_query += " and p.model_id in (?)";
				// queryforSchedule += " and p.model_id in (?)";
				// queryforNotStarted += " and p.model_id in (?)";
				// queryforended+= " and p.model_id in (?)";
				data.push(eval(model_arr));
			}
			if (req.query.city_id && req.query.city_id != '') {
				let city_arr= req.query.city_id.split(',');
				temp_query += " and p.city_id in (?)";
				// queryforSchedule += " and p.city_id in (?)";
				// queryforNotStarted += " and p.city_id in (?)";
				// queryforended += " and p.city_id in (?)";
				data.push(eval(city_arr));
			}
			if (req.query.country_id && req.query.country_id != '') {
				let country_arr= req.query.country_id.split(',');
				temp_query += " and p.country_id in (?)";
				// queryforSchedule += " and p.country_id in (?)";
				// queryforNotStarted += " and p.country_id in (?)";
				// queryforended += " and p.country_id in (?)";
				data.push(eval(country_arr));
			}
			temp_query+="ORDER BY p.product_id DESC"
			let result=await model.QueryListData(temp_query,data,res)
			if(result){
				result = await GetProductFirstImg(result, res);
				res.send({
					success:true,
					message:"Record fetched",
					message_arabic:"تم جلب السجل",
					data:result
				})
			}
			else{
				res.send({
					success:false,
					message:"Record not fetched",
					message_arabic:"لم يتم جلب السجل",
					error:error
				})
			}
		}

		catch(error){
			res.send({
				success:false,
				message:"Something Went Wrong.....",
				message_arabic:"هناك خطأ ما",
				error:error.message
			})

		}
	}


}