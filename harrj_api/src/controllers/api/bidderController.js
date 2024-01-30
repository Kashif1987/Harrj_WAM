const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('bidder');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;

const moment = require('moment');


async function GetProductFirstImg(result, res) {
	return new Promise(async function (resolve, reject) {
		for (let i = 0; i < result.length; i++) {
			result[i]['product_img'] = await model.GetProductFirstImg(result[i]['product_id']);
		}
		resolve(result);
	});
}
module.exports = {
	BidListByBidderId: async (req, res) => {
		const validationRule = {
			'bidder_id': 'required'
			// ,'search_name':'required'
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
					let query = "SELECT totalbids.bidCount,a.bid_id,a.bidder_id,a.customer_id,a.bid_amount,a.bid_status,DATE_FORMAT(a.add_dt,'%d-%m-%Y %h:%i:%p') as add_dt,a.product_id,b.name as product_name,b.title FROM `bids` as a left join products as b on a.product_id=b.product_id  LEFT JOIN (select count(b1.bid_id) as bidCount,b1.product_id, b1.customer_id from bids b1 WHERE b1.status=? group by b1.product_id,b1.customer_id) as totalbids on totalbids.product_id = a.product_id and totalbids.customer_id = a.customer_id WHERE a.bidder_id = ? AND a.status=? and b.status=?";
					let data = [ACTIVE_STATUS, req.body.bidder_id, ACTIVE_STATUS,ACTIVE_STATUS];
					if(req.body.search_name && typeof(req.body.search_name)!='undefined' && req.body.search_name!=='')
					{
						query+=' AND b.title like ?';
						data.push('%' + req.body.search_name+ '%');
					}
					if (req.query.name && req.query.name != '') {
						query += ' and b.name like ?';
						data.push('%' + req.query.name + '%');
					}

					if (req.query.title && req.query.title != '') {
						query += ' and b.title like ?';
						data.push('%' + req.query.title + '%');
					}

					if (req.query.max_bid_amount && req.query.max_bid_amount != ''  && req.query.max_bid_amount != 0) {
						query += ' and a.bid_amount <= ?';
						data.push(req.query.max_bid_amount);
					}

					if (req.query.bid_id && req.query.bid_id != '') {
						let proid_arr= req.query.bid_id.split(',');
						query += " and a.bid_id in (?)";
						data.push(proid_arr);
					}

					if (req.query.bid_status && req.query.bid_status != '') {
						query += ' and a.bid_status=?';
						data.push(req.query.bid_status);
					}					
					query+="order by bid_id DESC"
					// if (result) {

					// 	result = await GetProductFirstImg(result, res);

					// 	res.send({
					// 		success: true,
					// 		message: 'Successfull',
					// 		data: result
					// 	});
					// } else
					// res.send({
					// 	success: false,
					// 	message: 'Failed',
					// 	data: []
					// });
					
					
					
					
					
					
					let result = await model.QueryListDataNew(query, data, res);
					if (result && result.length) {
						// result[0]['product_img'] = await model.GetProductFirstImg(result[0]['product_id']);
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
							message: 'No Data Found',
							message_arabic:"لاتوجد بيانات",
							data: []
						});


				} catch (error) {
					console.log(error);
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


	AddBid: async (req, res) => {
		const validationRule = {
			'bidder_id': 'required',
			'product_id': 'required',
			'bid_amount': 'required',
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
				let now = moment();
				let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");

				var bid_data = {};
				bid_data.bidder_id = req.body.bidder_id;
				bid_data.product_id = req.body.product_id;
				bid_data.bid_amount = req.body.bid_amount;
				bid_data.customer_id = req.body.customer_id;
				bid_data.add_by = req.logged_in_id;
				bid_data.add_dt = todays_dt;
				bid_data.status = ACTIVE_STATUS;

				let query = "INSERT INTO `bids` SET ?";
				let data = [bid_data];
				try {
					let result = await model.QueryPostData(query, data, res);
					if (result)
						res.send({
							success: true,
							message: 'Bid Added Successfully..!',
							message_arabic:"تمت إضافة العطاء بنجاح",
							data: result
						});
					else
						res.send({
							success: false,
							message: 'Bid Not Added Successfully..!',
							message_arabic:"لم يضاف العطاء بنجاح",
							data: []
						});

				}
				catch (error) {
					res.send({
						success: false,
						message: 'Something Went Wrong..!',
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
					let query = "SELECT a.bid_id,a.bidder_id,a.bid_amount,a.customer_id,a.bid_status,DATE_FORMAT(a.add_dt,'%d-%m-%Y %h:%i:%p') as add_dt,a.product_id,b.name as product_name,b.title,c.name as customer_name FROM `bids` as a left join products as b on a.product_id=b.product_id left join users as c on a.customer_id=c.id  WHERE a.bid_id = ? AND a.status=?";
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
				}
				catch (error) {
					res.send({
						success: false,
						message: 'Something Went Wrong..!',
						message_arabic:"هناك خطأ ما",
						data: error.message
					});
				}
			}
		});
	},



	Delete: async (req, res) => {
		const validationRule = {
			'bid_id': 'required',
			'bidder_id': 'required',

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
				let now = moment();
				let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
				try {
					//       let where_con='bid_id=? and status=?';
					//       let where_data=[req.body.bid_id,ACTIVE_STATUS]
					// let check = await model.CheckForDelete('products',where_con,where_data);
					// if(check)
					// {
					let query = "UPDATE `bids` SET `status` =?,`mdf_by`=?,`mdf_dt`=? WHERE `bid_id` = ?";
					let data = [IN_ACTIVE_STATUS, req.body.bidder_id, todays_dt, req.body.bid_id];

					let result = await model.QueryPostData(query, data, res);
					if (result) {
						return res.send({
							success: true,
							message: 'Bid Deleted successfully..!',
							message_arabic:"تم حذف العطاء بنجاح",
							data: []
						});
					} else {
						return res.send({
							success: false,
							message: 'Bid Deleted Unsuccessfull..!',
							message_arabic:"تم حذف العطاء غير ناجح",
							data: []
						});
					}

					//   }
					// else
					// {
					// 	res.send({
					//               success: true,
					//               message: 'Cant Delete..In Used!',
					//               data: []
					//       	});
					// }
				}
				catch (error) {
					res.send({
						success: false,
						message: 'Something Went Wrong..!',
						message_arabic:"هناك خطأ ما",
						data: error.message
					});
				}
			}
		});
	},

	AwardBid: async (req, res) => {
		const validationRule = {
			'bid_id': 'required',
			'bid_status': 'required',
			'customer_id': 'required',
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


					// let bids_data = {};

					// bids_data.bid_status = req.body.bid_status;
					// bids_data.mdf_by = req.body.customer_id;
					// bids_data.mdf_dt = todays_dt;

					let bids_data_accepted = {};

					bids_data_accepted.bid_status = req.body.bid_status;
					bids_data_accepted.mdf_by = req.body.customer_id;
					bids_data_accepted.mdf_dt = todays_dt;
					

					let bids_data_other = {};

					if(req.body.bid_status=='accepted')
					{
						bids_data_other.bid_status = 'rejected';
					}
					else{
						bids_data_other.bid_status = 'pending';
					}
					// bids_data_other.product_id = req.body.product_id;
					bids_data_other.mdf_by = req.body.customer_id;
					bids_data_other.mdf_dt = todays_dt;

					console.log(bids_data_accepted.bid_status);
					let query = "UPDATE `bids` SET ? WHERE product_id=? AND customer_id=? and bid_id=? AND status=?;";
					let data = [bids_data_accepted, req.body.product_id, req.body.customer_id,req.body.bid_id, ACTIVE_STATUS];
					let result = await model.QueryPostData(query, data, res);
					
					
					let query1 = "UPDATE `bids` SET ? WHERE product_id=? AND customer_id=? and bid_id!=? and status=?;";
					let data1 = [bids_data_other, req.body.product_id, req.body.customer_id,req.body.bid_id, ACTIVE_STATUS];
					let result1 = await model.QueryPostData(query1, data1, res);
					if (result && result1) {
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
	BidListByProductId: async (req, res) => {
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
				let query = "SELECT b.*, u.email_id, u.mobile_no FROM `bids` b LEFT JOIN user u ON u.id=b.bidder_id WHERE b.product_id = ? AND b.status=?";
				let data = [req.body.product_id, ACTIVE_STATUS];
				let result = await model.QueryListData(query, data, res);
				if (result)
					res.send({
						success: true,
						message: '',
						message_arabic:"",
						data: result
					});
				else
					res.send({
						success: false,
						message: '',
						message_arabic:"",
						data: []
					});
			}
		});
	}
}