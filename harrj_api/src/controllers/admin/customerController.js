const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('user');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;
const CUSTOMER_ROLE = process.env.CUSTOMER_ROLE;

const moment = require('moment');


module.exports = {
	List: async (req, res) => {
		try {
			let query = "SELECT * FROM user WHERE status=? and role=?";
			let data = [ACTIVE_STATUS, CUSTOMER_ROLE];
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
					message_arabic:'ناجح',
					data: result
				});
			} else
				res.send({
					success: false,
					message: 'Failed',
					message_arabic:'باءت بالفشل',
					data: []
				});
		} catch (error) {
			// console.log(e.message);
			res.send({
				success: false,
				message: 'Something Went Wrong',
				message_arabic:'هناك خطأ ما',
				data: error.message
			});
		}
	},



	// Add : async(req,res) =>{
	// const validationRule = {
	//  	'name': 'required',
	//  	'email_id': 'required',
	//  	'mobile_no': 'required',
	//  	'commercial_reg_no': 'required',
	//  	'subscription_id': 'required',
	//  	'subscription_start_date': 'required',
	//  	'subscription_end_date': 'required',

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
	// 	let check  = await model.CheckUnique(`email_id`,`user`,req.body.email_id.trim(),res);
	// 	 if(check)
	// 	 {
	// 		let user_data ={};

	// 		user_data.name = req.body.name;
	// 		user_data.email_id = req.body.email_id;
	// 		user_data.mobile_no = req.body.mobile_no;
	// 		user_data.password= md5(Math.floor(1000 + Math.random() * 9000));
	// 		user_data.commercial_reg_no = req.body.commercial_reg_no;
	// 		user_data.subscription_id = req.body.subscription_id;
	// 		user_data.subscription_start_date = req.body.subscription_start_date;
	// 		user_data.subscription_end_date = req.body.subscription_end_date;
	// 		user_data.role = '2';
	// 		user_data.add_by = req.logged_in_id;
	// 		user_data.add_dt  = todays_dt;
	// 		user_data.status  = ACTIVE_STATUS;


	// 		if(req.files && req.files.cd_doc)
	// 		{
	// 			var element=req.files.cd_doc;
	// 			var image_name= now.format("YYYYMMDDHHmmss")+element.name;
	// 			element.mv('./public/uploads/user/' + image_name);
	// 			user_data.cd_doc=image_name;
	// 		}

	// 		let query ="INSERT INTO `user` SET ? ";
	// 		let data=[user_data];
	// 		let result1 = await model.QueryPostData(query,data,res);
	// 		if (result1 && typeof result1 !=="undefined" && result1.affectedRows>0)
	// 		     res.send({
	//                 success: true,
	//                 message: 'user Added successfully..!',
	//                 data: []
	//         	});
	// 	    else
	// 	    {
	// 	    	res.send({
	//                 success: false,
	//                 message: 'user Not Added successfully..!',
	//                 data: []
	//         	});

	// 	    }
	// 	}else
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
					message_arabic:'فشل التحقق من الصحة',
					data: err
				});
			}
			else {
				try {
					let query = "SELECT * FROM `user` WHERE id = ? AND status=?";
					let data = [req.body.id, ACTIVE_STATUS];
					let result = await model.QueryListData(query, data, res);
					if (result)
						res.send({
							success: true,
							message: '',
							message_arabic:'',
							data: result
						});
					else
						res.send({
							success: false,
							message: '',
							message_arabic:'',
							data: []
						});
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong',
						message_arabic:'هناك خطأ ما',
						data: error.message
					});
				}
			}
		});
	},


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
					message_arabic:'فشل التحقق من الصحة',
					data: err
				});
			}
			else {
				try {
					let now = moment();
					let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");

					let where_con = 'add_by=? and status=?';
					let where_data = [req.body.id, ACTIVE_STATUS]
					let check = await model.CheckForDelete('products', where_con, where_data);
					if (check) {
						let query = "UPDATE `user` SET `status` =?, `mdf_by`=?,`mdf_dt`=? WHERE `id` = ?";
						let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.id];

						let result = await model.QueryPostData(query, data, res);
						if (result) {

							return res.send({
								success: true,
								message: 'Customer deleted successfully',
								message_arabic:'تم حذف العميل بنجاح',
								data: []
							});
						} else {
							return res.send({
								success: false,
								message: 'Customer deleted unsuccessfully',
								message_arabic:'حذف العميل دون جدوى',
								data: []
							});
						}
					}
					else {
						res.send({
							success: false,
							message: "Can't delete, its in use",
							message_arabic:'لا يمكن حذفه قيد الاستخدام',
							data: []
						});
					}
				} catch (error) {
					// console.log(e.message);
					res.send({
						success: false,
						message: 'Something Went Wrong',
						message_arabic:'هناك خطأ ما',
						data: error.message
					});
				}
			}
		});
	}
}