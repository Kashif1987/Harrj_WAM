const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('subscription');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;


const moment = require('moment');


module.exports = {
	List: async (req, res) => {
		try {
			let query = "SELECT subscription_id,title,description,duration,price FROM subscription WHERE status=?";
			let data = [ACTIVE_STATUS];
			let result = await model.QueryListData(query, data, res);
			if (result) {
				// console.log(sql.updates)
				res.send({
					success: true,
					message: 'Successfull',
					message_arabic:"",
					data: result
				});
			} else
				res.send({
					success: false,
					message: 'Failed',
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

	},


	Add: async (req, res) => {
		const validationRule = {
			'title': 'required',
			'description': 'required',
			'duration': 'required',
			'price': 'required',
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
					let check = await model.CheckUnique(`title`, `subscription`, req.body.title.trim(), res);
					if (check) {
						let query = "INSERT INTO `subscription`(`title`,`description`,`duration`,`price`,`status`,`add_by`,`add_dt`) VALUES (?,?,?,?,?,?,?)";
						let data = [req.body.title.trim(), req.body.description, req.body.duration, req.body.price, ACTIVE_STATUS, req.logged_in_id, todays_dt];
						let result = await model.QueryPostData(query, data, res);
						if (result)
							res.send({
								success: true,
								message: 'Subscription Added successfully..!',
								message_arabic:"تمت إضافة الاشتراك بنجاح",
								data: []
							});
						else
							res.send({
								success: false,
								message: 'Subscription Added Unsuccessfull..!',
								message_arabic:"تمت إضافة الاشتراك دون نجاح",
								data: []
							});
					} else {
						res.send({
							success: false,
							message: 'Subscription must be unique',
							message_arabic:"يجب أن يكون الاشتراك فريدًا",
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

	Edit: async (req, res) => {
		const validationRule = {
			'subscription_id': 'required'
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
					let query = "SELECT subscription_id,title,description,duration,price FROM `subscription` WHERE subscription_id = ? AND status=?";
					let data = [req.body.subscription_id, ACTIVE_STATUS];
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


	Update: async (req, res) => {
		const validationRule = {
			'subscription_id': 'required',
			'title': 'required',
			'description': 'required',
			'duration': 'required',
			'price': 'required',

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
					let check = await model.CheckUnique(`title`, `subscription`, req.body.title.trim(), res, `subscription_id`, req.body.subscription_id);
					if (check) {
						let query = "UPDATE `subscription` SET `title`=?,`description`=?,`duration`=?,`price`=?,`mdf_by`=?,`mdf_dt`=? WHERE subscription_id=? AND status=?";
						let data = [req.body.title.trim(), req.body.description, req.body.duration, req.body.price, req.logged_in_id, todays_dt, req.body.subscription_id, ACTIVE_STATUS];
						let result = await model.QueryPostData(query, data, res);
						if (result) {
							res.send({
								success: true,
								message: 'Subscription updated successfully..!',
								message_arabic:"تم تحديث الاشتراك بنجاح",
								data: []
							});
						} else {
							res.send({
								success: false,
								message: 'Subscription updated Unsuccessfull..!',
								message_arabic:"تم تحديث الاشتراك دون نجاح",
								data: []
							});
						}
					}
					else {
						res.send({
							success: false,
							message: 'Subscription must be unique',
							message_arabic:"يجب أن يكون الاشتراك فريدًا",
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


	Delete: async (req, res) => {
		const validationRule = {
			'subscription_id': 'required'
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
					let where_con = 'subscription_id=? and status=?';
					let where_data = [req.body.subscription_id, ACTIVE_STATUS]

					let query = "UPDATE `subscription` SET `status` =?,`mdf_by`=?,`mdf_dt`=? WHERE `subscription_id` = ?";
					let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.subscription_id];

					let result = await model.QueryPostData(query, data, res);
					if (result) {

						return res.send({
							success: true,
							message: 'Subscription Deleted successfully..!',
							message_arabic:"تم حذف الاشتراك بنجاح",
							data: []
						});
					} else {
						return res.send({
							success: false,
							message: 'Subscription Deleted Unsuccessfull..!',
							message_arabic:"تم حذف الاشتراك دون نجاح",
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
	}
}