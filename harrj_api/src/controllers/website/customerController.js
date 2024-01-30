// const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('bidder');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const Otp = require('./../../../src/models/otp');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;

const moment = require('moment');
const ProductsUploadLink = process.env.HOST + process.env.PORT + '/uploads/products/';

async function GetProductFirstImg(result, res) {
	return new Promise(async function (resolve, reject) {
		for (let i = 0; i < result.length; i++) {
			result[i]['product_img'] = await model.GetProductFirstImg(result[i]['product_id']);
		}
		resolve(result);
	});
}

module.exports = {
	BidListByCustomerId: async (req, res) => {
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
					let query = "SELECT a.bid_id,a.bidder_id,a.customer_id,a.bid_amount,a.bid_status,DATE_FORMAT(a.add_dt,'%d-%m-%Y %h:%i:%p') as add_dt,a.product_id,b.name as product_name,b.title,c.name as bidder_name FROM `bids` as a left join products as b on a.product_id=b.product_id left join user as c on a.bidder_id=c.id  WHERE a.customer_id = ? AND a.status=?";
					let data = [req.body.customer_id, ACTIVE_STATUS];
					if(req.body.search_title && typeof(req.body.search_title)!='undefined' && req.body.search_title!=''){
						query+='AND b.title like ?';
						data.push('%'+req.body.search_title+'%');
					}
					let result = await model.QueryListDataNew(query, data, res);
					if (result && result.length) {
						result[0]['product_img'] = await model.GetProductFirstImg(result[0]['product_id']);
						res.send({
							success: true,
							message: 'Successfull',
							message_arabic:"ناجح",
							data: result
						});
					} else
						res.send({
							success: false,
							message: 'No Data Found',
							message_arabic:"لاتوجد بيانات",
							data: []
						});


				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong...',
						message_arabic:"هناك خطأ ما",
						data: error.message
					});
				}
			}
		});

	},



	Edit: async (req, res) => {
		const validationRule = {
			'bid_id': 'required'
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
					let query = "SELECT a.bid_id,a.bidder_id,a.bid_amount,a.bid_status,DATE_FORMAT(a.add_dt,'%d-%m-%Y %h:%i:%p') as add_dt,a.product_id,b.name as product_name,b.title,c.name as bidder_name FROM `bids` as a left join products as b on a.product_id=b.product_id left join user as c on a.bidder_id=c.id  WHERE a.bid_id = ? AND a.status=?";
					let data = [req.body.bid_id, ACTIVE_STATUS];
					let result = await model.QueryListData(query, data, res);
					if (result && result.length) {
						result[0]['product_img'] = await model.GetProductFirstImg(result[0]['product_id']);
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
						message_arabic:"هناك خطأ ما",
						data: error.message
					});
				}
			}
		});
	},



	UpdateBidStatus: async (req, res) => {
		const validationRule = {
			'bid_id': 'required',
			'bid_status': 'required',
			'customer_id': 'required',
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
					let bids_data = {};

					bids_data.bid_status = req.body.bid_status;
					bids_data.mdf_by = req.body.customer_id;
					bids_data.mdf_dt = todays_dt;


					let query = "UPDATE `bids` SET ? WHERE bid_id=? AND status=?";
					let data = [bids_data, req.body.bid_id, ACTIVE_STATUS];
					let result = await model.QueryPostData(query, data, res);
					if (result) {
						res.send({
							success: true,
							message: 'Bid Status Updated Successfully..!',
							message_arabic:"تم تحديث حالة العطاء بنجاح",
							data: []
						});
					} else {
						res.send({
							success: false,
							message: 'Bid Status Updated Unsuccessfull..!',
							message_arabic:"تم تحديث حالة العطاء غير ناجحة",
							data: []
						});
					}
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong...',
						message_arabic:"هناك خطأ ما",
						data: error.message
					});
				}

			}
		});

	},


	ListMyAds: async (req, res) => {
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
					let query = "SELECT p.product_id,totalbids.bidCount,p.category_id,p.sub_category_id,p.brand_id,b.brand_name,b.brand_name_arabic,p.model_id,m.model_name,m.model_name_arabic,p.year_id,p.starting_price,p.country_id,co.country_name,co.country_name_arabic,p.city_id,ci.city_name,ci.city_name_arabic,p.title,p.name,p.auction_type,p.meeting_id,p.meeting_password, DATE_FORMAT(p.start_date_time,'%d-%m-%Y') as start_date_time,	TIME_FORMAT(p.start_time,'%h:%i %p') as start_time, DATE_FORMAT(p.end_date_time,'%d-%m-%Y') as end_date_time, TIME_FORMAT(p.end_time,'%h:%i %p') as end_time, p.add_by FROM products p LEFT JOIN country co ON co.country_id=p.country_id LEFT JOIN city ci ON ci.city_id=p.city_id LEFT JOIN brand b ON b.brand_id=p.brand_id LEFT JOIN model m ON m.model_id=p.model_id LEFT JOIN (select count(b1.bid_id) as bidCount,b1.product_id from bids b1 group by b1.product_id) as totalbids on totalbids.product_id = p.product_id WHERE p.add_by=? and p.status=?";
					let data = [req.body.customer_id, ACTIVE_STATUS];
					if(req.body.search_title && typeof(req.body.search_title)!='undefined' && req.body.search_title!=''){
						query+='AND p.title like ?';
						data.push('%'+req.body.search_title+'%');
					}
					if (req.query.category_id && req.query.category_id != '') {
						query += ' and p.category_id=?';
						data.push(req.query.category_id);
					}
					if (req.query.sub_category_id && req.query.sub_category_id != '') {
						query += ' and p.sub_category_id=?';
						data.push(req.query.sub_category_id);
					}
					if (req.query.brand_id && req.query.brand_id != '') {
						query += ' and p.brand_id=?';
						data.push(req.query.brand_id);
					}
					if (req.query.brand_name && req.query.brand_name != '') {
						query += ' and b.brand_name like ?';
						data.push('%' + req.query.brand_name + '%');
					}
					if (req.query.brand_name_arabic && req.query.brand_name_arabic != '') {
						query += ' and b.brand_name_arabic like ?';
						data.push('%' + req.query.brand_name_arabic + '%');
					}
					

					if (req.query.title && req.query.title != '') {
						query += ' and p.title like ?';
						data.push('%' + req.query.title + '%');
					}
					if (req.query.name && req.query.name != '') {
						query += ' and p.name like ?';
						data.push('%' + req.query.name + '%');
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
					if (req.query.auction_type && req.query.auction_type != '' && req.query.auction_type != 'currentgolivenow' && req.query.auction_type != 'currentonline') {
						let auc_arr= String(req.query.auction_type).split(',');
						query += " and p.auction_type in (?)";
						data.push(eval(auc_arr));
					}
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
						message_arabic:"باءت بالفشل",
						data: []
					});


					// let result = await model.QueryListDataNew(query, data, res);
					// if (result && result.length) {
					// 	result[0]['product_img'] = await model.GetProductFirstImg(result[0]['product_id']);
					// 	console.log(result[0]);
					// 	res.send({
					// 		success: true,
					// 		message: 'Successfull',
					// 		data: result
					// 	});
					// } else
					// 	res.send({
					// 		success: false,
					// 		message: 'No Data Found',
					// 		data: []
					// 	});


				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong...',
						message_arabic:"هناك خطأ ما",
						data: error.message
					});
				}
			}
		});

	},
	EmailSend : 
		async (req, res) => {
			const validationRule = {
				'email_id': 'required'
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
						let check1 = await model.CheckIfExists(`email_id`, `user`, req.body.email_id.trim(), res);
						console.log(check1);
          				if (check1) {
							let otpcode = Math.floor((Math.random()*10000)+1);
							console.log(otpcode);
							let otpData = new Otp({
								email:req.body.email_id,
								code:otpcode,
								expireIn: new Date().getTime() + 300*1000
							})
							let otpResponse = await otpData.save();
							res.send({
								success: true,
								message: 'Please check your email id',
								message_arabic:"يرجى التحقق من معرف البريد الإلكتروني الخاص بك",
								data: result
							});
						  }
						  else
							res.send({
								success: false,
								message: 'Invalid email Id or it doesnt exist',
								message_arabic:"معرف البريد الإلكتروني غير صالح أو أنه غير موجود",
								data: []
							});
					} catch (error) {
							// console.log(e.message);
							res.send({
								success: false,
								message: 'Something Went Wrong...',
								message_arabic:"هناك خطأ ما",
								data: error.message
							});
					}	  
				}
			});
		}	
	}


	// ChangePassword : async (req,res)=>{
	// 	res.status(200).json('okk');
	// }



	// GetInfoMyAds: async (req, res) => {
	// 	const validationRule = {
	// 		'customer_id': 'required',
	// 		'product_id': 'required'
	// 	}
	// 	validator(req.body, validationRule, {}, async (err, status) => {
	// 		console.log(status);
	// 		if (!status) {
	// 			res.send({
	// 				success: false,
	// 				message: 'Validation failed',
	// 				data: err
	// 			});
	// 		}
	// 		else {
	// 			try {
	// 				let query = "SELECT a.*,DATE_FORMAT(a.start_date_time,'%Y-%m-%d') as start_date_time,TIME_FORMAT(a.start_time,'%H:%i') as start_time, Concat(?, CASE WHEN a.video  != '' THEN  Concat(a.video) end) as video,b.category_name,c.brand_name,d.model_name FROM `products` as a left join category as b on a.category_id=b.category_id left join brand as c on a.brand_id=c.brand_id left join model as d on a.model_id=d.model_id left join year as y on a.year_id=y.year_id left join sub_category as e on e.sub_category_id=e.sub_category_id WHERE a.product_id = ? and a.add_by=? and a.status=?";
	// 				let data = [ProductsUploadLink, req.body.product_id,req.body.customer_id, ACTIVE_STATUS];
	// 				if (req.body.year_id && req.body.year_id != '') {
	// 					query += " and a.year_id=?";
	// 					data.push(eval(req.body.year_id));
	// 				}
	// 				let result = await model.QueryListData(query, data, res);
	// 				if (result && result.length > 0) {
	// 					query = "SELECT product_img_id,Concat(?, CASE WHEN product_img  != '' THEN  Concat(product_img ) end) as product_img FROM product_imgs WHERE product_id=? and status=?";
	// 					data = [ProductsUploadLink, result[0]['product_id'], ACTIVE_STATUS];
	// 					result[0]['product_img_list'] = await model.QueryListData(query, data, res);

	// 					res.send({
	// 						success: true,
	// 						message: '',
	// 						data: result
	// 					});
	// 				}
	// 				else
	// 					res.send({
	// 						success: false,
	// 						message: '',
	// 						data: []
	// 					});
	// 			} catch (error) {
	// 				// console.log(e.message);
	// 				res.send({
	// 					success: false,
	// 					message: 'Something Went Wrong...',
	// 					data: error.message
	// 				});
	// 			}
	// 		}
	// 	});
	// },

		
	// UpdateMyAds: async (req, res) => {
	// 	const validationRule = {
	// 		'product_id': 'required',
	// 		'customer_id': 'required',
	// 		'name': 'required',
	// 		'title': 'required',
	// 		'description': 'required',
	// 		'keywords': 'required',
	// 		'category_id': 'required',
	// 		'sub_category_id': 'required',
	// 		'brand_id': 'required',
	// 		'model_id': 'required',
	// 		'country_id': 'required',
	// 		'city_id': 'required',
	// 		'auction_type': 'required',
	// 		'start_date_time': 'required',
	// 		// 'end_date_time': 'required',
	// 		'starting_price': 'required',
	// 		'refund': 'required'
	// 		// 'refund_days': 'required',
	// 	}
	// 	validator(req.body, validationRule, {}, async (err, status) => {
	// 		console.log(status);
	// 		if (!status) {
	// 			res.send({
	// 				success: false,
	// 				message: 'Validation failed',
	// 				data: err
	// 			});
	// 		}
	// 		else {
	// 			try {
	// 				let now = moment();
	// 				let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
	// 				let products_data = {};

	// 				products_data.name = req.body.name;
	// 				products_data.keywords = req.body.keywords;
	// 				products_data.category_id = req.body.category_id;
	// 				products_data.sub_category_id = req.body.sub_category_id;
	// 				products_data.brand_id = req.body.brand_id;
	// 				products_data.model_id = req.body.model_id;
	// 				products_data.country_id = req.body.country_id;
	// 				products_data.city_id = req.body.city_id;
	// 				products_data.title = req.body.title;
	// 				products_data.description = req.body.description;
	// 				products_data.auction_type = req.body.auction_type;
	// 				products_data.start_date_time = req.body.start_date_time;
	// 				// products_data.end_date_time = req.body.end_date_time;
	// 				products_data.starting_price = req.body.starting_price;
	// 				// products_data.high_price = req.body.high_price;
	// 				// products_data.final_price = req.body.final_price;
	// 				products_data.refund = req.body.refund;
	// 				products_data.refund_days = req.body.refund_days;
	// 				products_data.mdf_by = req.logged_in_id;
	// 				products_data.mdf_dt = todays_dt;

	// 				if (req.body.start_time && req.body.start_time != 'undefined' && req.body.start_time != '') {
	// 					products_data.start_time = req.body.start_time;
	// 				}
	// 				if (req.body.end_time && req.body.end_time != 'undefined' && req.body.end_time != '') {
	// 					products_data.end_time = req.body.end_time;
	// 				}
	// 				if (req.body.zoom_link && req.body.zoom_link != 'undefined' && req.body.zoom_link != '') {
	// 					products_data.zoom_link = req.body.zoom_link;
	// 				}
	// 				if (req.body.end_date_time && req.body.end_date_time !== 'undefined' && req.body.end_date_time !== '') {
	// 					products_data.end_date_time = req.body.end_date_time;
	// 				}
	// 				if (req.body.year_id && req.body.year_id != '' && req.body.year_id !== 'undefined') {
	// 					products_data.year_id = req.body.year_id;
	// 				}
	// 				if (req.files && req.files.video) {
	// 					var element = req.files.video;
	// 					var image_name = now.format("YYYYMMDDHHmmss") + element.name;
	// 					element.mv('./public/uploads/products/' + image_name);
	// 					products_data.video = image_name;
	// 				}

	// 				let query = "UPDATE `products` SET ? WHERE product_id = ? and add_by=? and status=?";
	// 				// console.log(query);
	// 				let data = [products_data, req.body.product_id,req.body.customer_id, ACTIVE_STATUS];
	// 				let result = await model.QueryPostData(query, data, res);
	// 				if (result) {
	// 					if (req.files && req.files.product_img && req.files.product_img != '' && req.files.product_img != 'undefined') {
	// 						var product_img = req.files.product_img;
	// 						if (!Array.isArray(product_img)) {
	// 							var temp = product_img;
	// 							product_img = [];
	// 							product_img.push(temp);
	// 						}
	// 						let i = 1;
	// 						// console.log("Shree");
	// 						console.log(product_img);
	// 						product_img.forEach(async element => {
	// 							if (element.name != '') {
	// 								i++;
	// 								image_name = i + "_" + now.format("YYYYMMDDHHmmss") + element.name;
	// 								element.mv('./public/uploads/products/' + image_name);
	// 								let sub_query = "INSERT INTO `product_imgs`(`product_img`, `product_id`,`status`,`add_dt`,`add_by`) VALUES (?,?,?,?,?)";
	// 								let sub_data = [image_name, req.body.product_id, ACTIVE_STATUS, todays_dt, req.logged_in_id];
	// 								await model.QueryPostData(sub_query, sub_data, res);

	// 							}

	// 						});
	// 					}
	// 					res.send({
	// 						success: true,
	// 						message: 'Product updated successfully..!',
	// 						data: []
	// 					});
	// 				} else {
	// 					res.send({
	// 						success: false,
	// 						message: 'Product updated Unsuccessfull..!',
	// 						data: []
	// 					});
	// 				}
	// 			} catch (error) {
	// 				// console.log(e.message);
	// 				res.send({
	// 					success: false,
	// 					message: 'Something Went Wrong...',
	// 					data: error.message
	// 				});
	// 			}

	// 		}
	// 	});

	// },

	// DeleteMyAds: async (req, res) => {
	// 	const validationRule = {
	// 		'product_id': 'required',
	// 		'customer_id': 'required'
	// 	}
	// 	validator(req.body, validationRule, {}, async (err, status) => {
	// 		console.log(status);
	// 		if (!status) {
	// 			res.send({
	// 				success: false,
	// 				message: 'Validation failed',
	// 				data: err
	// 			});
	// 		}
	// 		else {
	// 			try {
	// 				let now = moment();
	// 				let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
	// 				let query = "UPDATE `products` SET `status` =?, `mdf_by`=?,`mdf_dt`=? WHERE `product_id` = ? and add_by=?";
	// 				let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.product_id,req.body.customer_id];

	// 				let result = await model.QueryPostData(query, data, res);
	// 				if (result) {

	// 					return res.send({
	// 						success: true,
	// 						message: 'Product Deleted successfully..!',
	// 						data: []
	// 					});
	// 				} else {
	// 					return res.send({
	// 						success: false,
	// 						message: 'Product Deleted Unsuccessfull..!',
	// 						data: []
	// 					});
	// 				}
	// 			} catch (error) {
	// 				// console.log(e.message);
	// 				res.send({
	// 					success: false,
	// 					message: 'Something Went Wrong...',
	// 					data: error.message
	// 				});
	// 			}
	// 		}
	// 	});
	// }







