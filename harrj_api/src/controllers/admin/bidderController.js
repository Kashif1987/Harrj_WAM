const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('user');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;
const BIDDER_ROLE = process.env.BIDDER_ROLE;

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
					// let query = "SELECT a.bid_id,a.bidder_id,a.bid_amount,a.bid_status,DATE_FORMAT(a.add_dt,'%d-%m-%Y %h:%i:%p') as add_dt,a.product_id,b.name as product_name,b.title FROM `bids` as a left join products as b on a.product_id=b.product_id  WHERE a.bidder_id = ? AND a.status=?";
					// let data = [req.body.bidder_id, ACTIVE_STATUS];
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
					query+="ORDER BY bid_id DESC"				
					
					
					
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
						message: 'Something Went Wrong',
						message_arabic:"هناك خطأ ما",
						data: error.message
					});
				}
			}
		});

	},
	List: async (req, res) => {
		try {
			//let query = "SELECT * FROM user WHERE status=? and role=?";
			//let data = [ACTIVE_STATUS, BIDDER_ROLE];
			let query = "SELECT DISTINCT b.bidder_id, b.*, u.email_id, u.mobile_no, u.*,c.comment,p.title FROM `bids` b LEFT JOIN user u ON u.id=b.bidder_id left JOIN comment c on c.bid_id=c.bid_id LEFT JOIN products p on b.product_id=p.product_id WHERE b.status=? AND p.status=? AND u.status=? AND c.status=?";
			let data = [ACTIVE_STATUS,ACTIVE_STATUS,ACTIVE_STATUS,ACTIVE_STATUS];
			if (req.query.name && req.query.name != '') {
				query += ' and name like ?';
				data.push('%#' + req.query.name + '%');
			}
			if (req.query.id && req.query.id != '') {
				query += ' and id like ?';
				data.push('%#' + req.query.id + '%');
			}
			if (req.query.last_id && req.query.last_id > 0) {
				query += " and id<?";
				data.push(eval(req.query.last_id));
			}
			if (req.query.page_records && req.query.page_records > 0) {
				query += ' ORDER BY id DESC LIMIT ?';
				data.push(eval(req.query.page_records));
			}
			else {
				query += ' ORDER BY id DESC';
			}
			let result = await model.QueryListData(query, data, res);
			if (result) {
				// console.log(sql.updates)
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


		} catch (e) {
			console.log(e.message);
		}

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
	},


	Edit: async (req, res) => {
		const validationRule = {
			'id': 'required'
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
				let query = "SELECT * FROM `user` WHERE id = ? AND status=?";
				let data = [req.body.id, ACTIVE_STATUS];
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
	},

	// Update : async(req,res)=>{
	// const validationRule = {
	//  	'id': 'required',
	//  	'name': 'required',
	//  	'email_id': 'required',
	//  	'mobile_no': 'required',
	//    }
	// validator(req.body, validationRule, {}, async(err, status) => {
	// console.log(status);
	// if (!status) {
	// 	res.send({
	// 		success: false,
	// 		message: 'Validation failed',
	// 		data: err
	// 	});
	// }
	// else 
	// {
	// 	let now = moment();
	//    	let todays_dt= now.format("YYYY-MM-DD HH:mm:ss");

	// 	let check  = await model.CheckUnique(`email_id`,`user`,req.body.email_id.trim(),res,`id`,req.body.id);
	//     if(check)
	//     {
	// 		let user_data ={};

	// 		user_data.name = req.body.name;
	// 		user_data.email_id = req.body.email_id;
	// 		user_data.mobile_no = req.body.mobile_no;

	// 		user_data.mdf_by = req.logged_in_id;
	// 		user_data.mdf_dt  = todays_dt;

	// 		let query ="UPDATE `user` SET ? WHERE id=? AND status=?";
	// 		let data=[user_data,req.body.id,ACTIVE_STATUS];
	// 		let result = await model.QueryPostData(query,data,res);
	// 		if (result)
	// 		{	
	// 		     res.send({
	//                 success: true,
	//                 message: 'Customer updated successfully..!',
	//                 data: []
	//         	});
	// 	    }else{
	// 	    	res.send({
	//                 success: false,
	//                 message: 'Customer updated Unsuccessfull..!',
	//                 data: []
	//         	});
	// 	    }
	// 	}
	// 	 else
	// 	{
	// 		res.send({
	//                 success: false,
	//                 message: 'Email Id must be unique',
	//                 data: []
	//         	});
	// 	}

	// 	}
	// });

	// },


	Delete: async (req, res) => {
		const validationRule = {
			'id': 'required'
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

				let where_con = 'bidder_id=? and status=?';
				let where_data = [req.body.id, ACTIVE_STATUS]
				let check = await model.CheckForDelete('bids', where_con, where_data);
				if (check) {
					let query = "UPDATE `user` SET `status` =?, `mdf_by`=?,`mdf_dt`=? WHERE `id` = ?";
					let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.id];

					let result = await model.QueryPostData(query, data, res);
					if (result) {

						return res.send({
							success: true,
							message: 'Bidder deleted successfully',
							message_arabic:"تم حذف مقدم العطاء بنجاح",
							data: []
						});
					} else {
						return res.send({
							success: false,
							message: 'Bidder deleted unsuccessfully',
							message_arabic:"تم حذف مقدم العطاء دون جدوى",
							data: []
						});
					}
				}
				else {
					res.send({
						success: false,
						message: "Can't delete, its in use",
						message_arabic:"لا يمكن حذفه قيد الاستخدام",
						data: []
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
							message: 'Bid status updated successfully',
							message_arabic:"تم تحديث حالة العطاء بنجاح",
							data: []
						});
					} else {
						res.send({
							success: false,
							message: 'Bid status updated unsuccessfully',
							message_arabic:"تم تحديث حالة العطاء دون جدوى",
							data: []
						});
					}
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong',
						message_arabic:"هناك خطأ ما",
						data: error.message
					});
				}

			}
		});

	}
}