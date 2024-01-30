const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('city');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;

const moment = require('moment');


module.exports = {
	List: async (req, res) => {
		try {
			let query = "SELECT a.country_id,b.country_name,b.country_name_arabic,a.city_id,a.city_name,a.city_name_arabic FROM city a left join country b on b.country_id=a.country_id WHERE a.status=?";
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
					message_arabic:"باءت بالفشل",
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

	Add: async (req, res) => {
		const validationRule = {
			'country_id': 'required',
			'city_name': 'required',
			'city_name_arabic': 'required'
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
					let check = await model.CheckUniqueTwoFields(`city_name`,`city_name_arabic`, `city`, req.body.city_name.trim(),req.body.city_name_arabic.trim(), res);
					if (check) {
						var city_data = {};
						city_data.country_id = req.body.country_id;
						city_data.city_name = req.body.city_name;
						city_data.city_name_arabic = req.body.city_name_arabic;
						city_data.add_by = req.logged_in_id;
						city_data.add_dt = todays_dt;
						city_data.status = ACTIVE_STATUS;
						// if (req.files && req.files.category_img && req.files.category_img != '') {
						// 	var element = req.files.category_img;
						// 	var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						// 	element.mv('./public/uploads/category/' + image_name);
						// 	category_data.category_img = image_name;
						// }
						// let query ="INSERT INTO `category`(`category_name`,`status`,`add_by`,`add_dt`) VALUES (?,?,?,?)";
						// let data=[req.body.category_name.trim(),ACTIVE_STATUS,req.logged_in_id,todays_dt];
						let query = "INSERT INTO `city` SET ?";
						let data = [city_data];
						let result = await model.QueryPostData(query, data, res);
						if (result && result.affectedRows>0)
							res.send({
								success: true,
								message: 'City added successfully',
								message_arabic:"تمت إضافة المدينة بنجاح",
								data: []
							});
						else
							res.send({
								success: false,
								message: 'City added unsuccessfully',
								message_arabic:"تمت إضافة المدينة دون جدوى",
								data: []
							});
					} else {
						res.send({
							success: false,
							message: 'City already exists',
							message_arabic:"المدينة موجودة بالفعل",
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
			'city_id': 'required'
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
					let query = "SELECT a.country_id,b.country_name,b.country_name_arabic,a.city_id,a.city_name,a.city_name_arabic FROM city a left join country b on b.country_id=a.country_id WHERE a.city_id = ? AND a.status=?";
					let data = [req.body.city_id, ACTIVE_STATUS];
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
			'city_id': 'required',
			'city_name': 'required',
			'city_name_arabic': 'required'
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
					let check = await model.CheckUniqueTwoFields(`city_name`,`city_name_arabic`, `city`, req.body.city_name.trim(),req.body.city_name_arabic.trim(), res, `city_id`, req.body.city_id);
					if (check) {
						var city_data = {};
						if (req.body.country_id && req.body.country_id != '') {
							city_data.country_id = req.body.country_id;
						}
						city_data.city_name = req.body.city_name;
						city_data.city_name_arabic = req.body.city_name_arabic;
						city_data.mdf_by = req.logged_in_id;
						city_data.mdf_dt = todays_dt;
						city_data.status = ACTIVE_STATUS;
						// if (req.files && req.files.category_img && req.files.category_img != '') {
						// 	var element = req.files.category_img;
						// 	var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						// 	element.mv('./public/uploads/category/' + image_name);
						// 	category_data.category_img = image_name;
						// }

						let query = "UPDATE `city` SET ? WHERE city_id=? ";
						let data = [city_data, req.body.city_id];
						let result = await model.QueryPostData(query, data, res);
						if (result) {
							res.send({
								success: true,
								message: 'City updated successfully',
								message_arabic:"تم تحديث المدينة بنجاح",
								data: []
							});
						} else {
							res.send({
								success: false,
								message: 'City updated unsuccessfully',
								message_arabic:"تم تحديث المدينة دون جدوى",
								data: []
							});
						}
					}
					else {
						res.send({
							success: false,
							message: 'City already exists',
							message_arabic:"المدينة موجودة بالفعل.02111110.",
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
			'city_id': 'required'
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
					let where_con = 'city_id=? and status=?';
					let where_data = [req.body.city_id, ACTIVE_STATUS]
					let check = await model.CheckForDelete('products', where_con, where_data);
					if (check) {
						let query = "UPDATE `city` SET `status` =?,`mdf_by`=?,`mdf_dt`=? WHERE `city_id` = ?";
						let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.city_id];

						let result = await model.QueryPostData(query, data, res);
						if (result) {

							return res.send({
								success: true,
								message: 'City deleted successfully',
								message_arabic:"تم حذف المدينة بنجاح",
								data: []
							});
						} else {
							return res.send({
								success: false,
								message: 'City deleted unsuccessfully',
								message_arabic:"تم حذف المدينة دون نجاح",
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