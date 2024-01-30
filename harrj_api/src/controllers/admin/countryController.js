const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('country');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;

const moment = require('moment');


module.exports = {
	List: async (req, res) => {
		try {
			let query = "SELECT country_id,country_name,country_name_arabic FROM country WHERE status=?";
			let data = [ACTIVE_STATUS];
			let result = await model.QueryListData(query, data, res);
			if (result && result.length) {
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
					message_arabic:"فشل",
					data: []
				});
		} catch (error) {
			// console.log(e.message);
			res.send({
				success: false,
				message: 'Something Went Wrong',
				message_arabic:"هناك خطأ ما",
				data: error.message
			});
		}

	},

	CountryCityList: async (req, res) => {
		const validationRule = {
			'country_id': 'required'
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
			// let query = "SELECT country_id,country_name, FROM country WHERE status=?";
			// let data = [ACTIVE_STATUS];
			// let result = await model.QueryListData(query, data, res);
			// if (result) {
			// 	// console.log(sql.updates)
			// 	if (result && result.length) {
			// 		result.forEach(async (element, index) => {
						let query = "SELECT city_id, city_name, city_name_arabic FROM `city` where country_id=? AND status=?";
						let data = [req.body.country_id, ACTIVE_STATUS];
						let result = await model.QueryListData(query, data, res);
				// 	})
				// }
			if (result && result.length) {
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
				message: 'Something Went Wrong',
				message_arabic:"هناك خطأ ما",
				data: error.message
			});
		}	}
		});

	},



	Add: async (req, res) => {
		const validationRule = {
			'country_name': 'required',
			'country_name_arabic': 'required'
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
					let check = await model.CheckUniqueTwoFields(`country_name`,`country_name_arabic`, `country`, req.body.country_name.trim(),req.body.country_name_arabic.trim(), res);
					if (check) {
						var country_data = {};
						country_data.country_name = req.body.country_name;
						country_data.country_name_arabic = req.body.country_name_arabic;
						country_data.add_by = req.logged_in_id;
						country_data.add_dt = todays_dt;
						country_data.status = ACTIVE_STATUS;
						// if (req.files && req.files.category_img && req.files.category_img != '') {
						// 	var element = req.files.category_img;
						// 	var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						// 	element.mv('./public/uploads/category/' + image_name);
						// 	category_data.category_img = image_name;
						// }
						// let query ="INSERT INTO `category`(`category_name`,`status`,`add_by`,`add_dt`) VALUES (?,?,?,?)";
						// let data=[req.body.category_name.trim(),ACTIVE_STATUS,req.logged_in_id,todays_dt];
						let query = "INSERT INTO `country` SET ?";
						let data = [country_data];
						let result = await model.QueryPostData(query, data, res);
						if (result && result.affectedRows>0)
							res.send({
								success: true,
								message: 'Country added unsuccessfully',
								message_arabic:"تمت إضافة الدولة بنجاح",
								data: []
							});
						else
							res.send({
								success: false,
								message: 'Country added unsuccessfully',
								message_arabic:"تمت إضافة البلد دون جدوى",
								data: []
							});
					} else {
						res.send({
							success: false,
							message: 'Country already exists',
							message_arabic:"البلد موجود بالفعل",
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

	},
	Edit: async (req, res) => {
		const validationRule = {
			'country_id': 'required'
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
					let query = "SELECT `country_id`,`country_name`,`country_name_arabic` FROM `country` WHERE country_id = ? AND status=?";
					let data = [req.body.country_id, ACTIVE_STATUS];
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
						message: 'Something Went Wrong',
						message_arabic:"هناك خطأ ما",
						data: error.message
					});
				}
			}
		});
	},
	Update: async (req, res) => {
		const validationRule = {
			'country_id': 'required',
			'country_name': 'required',
			'country_name_arabic': 'required'
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
					let check = await model.CheckUniqueTwoFields(`country_name`,`country_name_arabic`, `country`, req.body.country_name.trim(),req.body.country_name_arabic.trim(), res, `country_id`, req.body.country_id);
					if (check) {
						var country_data = {};
						country_data.country_name = req.body.country_name;
						country_data.country_name_arabic = req.body.country_name_arabic;
						country_data.mdf_by = req.logged_in_id;
						country_data.mdf_dt = todays_dt;
						country_data.status = ACTIVE_STATUS;
						// if (req.files && req.files.category_img && req.files.category_img != '') {
						// 	var element = req.files.category_img;
						// 	var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						// 	element.mv('./public/uploads/category/' + image_name);
						// 	category_data.category_img = image_name;
						// }

						let query = "UPDATE `country` SET ? WHERE country_id=? ";
						let data = [country_data, req.body.country_id];
						let result = await model.QueryPostData(query, data, res);
						if (result) {
							res.send({
								success: true,
								message: 'Country updated successfully',
								message_arabic:"تم تحديث البلد بنجاح",
								data: []
							});
						} else {
							res.send({
								success: false,
								message: 'Country updated unsuccessfully',
								message_arabic:"تم تحديث البلد دون جدوى",
								data: []
							});
						}
					}
					else {
						res.send({
							success: false,
							message: 'Country already exists',
							message_arabic:"البلد موجود بالفعل",
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

	},


	Delete: async (req, res) => {
		const validationRule = {
			'country_id': 'required'
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
					let where_con = 'country_id=? and status=?';
					let where_data = [req.body.country_id, ACTIVE_STATUS]
					let check = await model.CheckForDelete('products', where_con, where_data);
					let check1 = await model.CheckForDelete('city', where_con, where_data);
					if (check && check1) {
						let query = "UPDATE `country` SET `status` =?,`mdf_by`=?,`mdf_dt`=? WHERE `country_id` = ?";
						let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.country_id];

						let result = await model.QueryPostData(query, data, res);
						if (result) {

							return res.send({
								success: true,
								message: 'Country deleted successfully',
								message_arabic:"تم حذف البلد بنجاح",
								data: []
							});
						} else {
							return res.send({
								success: false,
								message: 'Country deleted Unsuccessfully',
								message_arabic:"تم حذف البلد دون نجاح",
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