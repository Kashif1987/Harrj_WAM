const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('year');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;

const moment = require('moment');


module.exports = {
	List: async (req, res) => {
		try {
			let query = "SELECT y.year_id,y.year FROM year y WHERE y.status=?";
			let data = [ACTIVE_STATUS];
			let result = await model.QueryListData(query, data, res);
			console.log("hello" + result);
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

	Add: async (req, res) => {
		const validationRule = {
			'year': 'required'
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
					let check = await model.CheckUnique(`year`, `year`, req.body.year.trim(), res);
					if (check) {
						var year_data = {};
						year_data.year = req.body.year;
						year_data.add_by = req.logged_in_id;
						year_data.add_dt = todays_dt;
						year_data.status = ACTIVE_STATUS;
						// if (req.files && req.files.category_img && req.files.category_img != '') {
						// 	var element = req.files.category_img;
						// 	var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						// 	element.mv('./public/uploads/category/' + image_name);
						// 	category_data.category_img = image_name;
						// }
						// let query ="INSERT INTO `category`(`category_name`,`status`,`add_by`,`add_dt`) VALUES (?,?,?,?)";
						// let data=[req.body.category_name.trim(),ACTIVE_STATUS,req.logged_in_id,todays_dt];
						let query = "INSERT INTO `year` SET ?";
						let data = [year_data];
						let result = await model.QueryPostData(query, data, res);
						if (result && result.affectedRows>0)
							res.send({
								success: true,
								message: 'Year added successfully',
								message_arabic:"تمت إضافة العام بنجاح",
								data: []
							});
						else
							res.send({
								success: false,
								message: 'Year added unsuccessfully',
								message_arabic:"تمت إضافة العام دون جدوى",
								data: []
							});
					} else {
						res.send({
							success: false,
							message: 'Year already exists',
							message_arabic:"العام موجود بالفعل",
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
			'year_id': 'required'
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
					let query = "SELECT y.year_id ,y.year FROM year y left join products p on p.year_id=y.year_id WHERE y.year_id = ? AND y.status=?";
					let data = [req.body.year_id, ACTIVE_STATUS];
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
			'year_id': 'required',
			'year': 'required'
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
					let check = await model.CheckUnique(`year`, `year`, req.body.year.trim(), res, `year_id`, req.body.year_id);
					if (check) {
						var year_data = {};
						// if (req.body.country_id && req.body.country_id != '') {
						// 	year_data.country_id = req.body.country_id;
						// }
						year_data.year = req.body.year;
						year_data.mdf_by = req.logged_in_id;
						year_data.mdf_dt = todays_dt;
						year_data.status = ACTIVE_STATUS;
						// if (req.files && req.files.category_img && req.files.category_img != '') {
						// 	var element = req.files.category_img;
						// 	var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						// 	element.mv('./public/uploads/category/' + image_name);
						// 	category_data.category_img = image_name;
						// }

						let query = "UPDATE `year` SET ? WHERE year_id=? ";
						let data = [year_data, req.body.year_id];
						let result = await model.QueryPostData(query, data, res);
						if (result) {
							res.send({
								success: true,
								message: 'Year updated successfully',
								message_arabic:"تم تحديث العام بنجاح",
								data: []
							});
						} else {
							res.send({
								success: false,
								message: 'Year updated unsuccessfully',
								message_arabic:"تم تحديث السنة دون جدوى",
								data: []
							});
						}
					}
					else {
						res.send({
							success: false,
							message: 'Year already exists',
							message_arabic:"العام موجود بالفعل",
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
			'year_id': 'required'
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
					let where_con = 'year_id=? and status=?';
					let where_data = [req.body.year_id, ACTIVE_STATUS]
					let check = await model.CheckForDelete('products', where_con, where_data);
					if (check) {
						let query = "UPDATE `year` SET `status` =?,`mdf_by`=?,`mdf_dt`=? WHERE `year_id` = ?";
						let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.year_id];

						let result = await model.QueryPostData(query, data, res);
						if (result) {

							return res.send({
								success: true,
								message: 'Year deleted successfully',
								message_arabic:"تم حذف العام بنجاح",
								data: []
							});
						} else {
							return res.send({
								success: false,
								message: 'Year deleted unsuccessfully',
								message_arabic:"تم حذف العام دون جدوى",
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
	},
	Listbyvalue: async (req, res) => {
		try {
			let query = "SELECT y.year_id As 'value',y.year As 'label' FROM year y WHERE y.status=?";
			let data = [ACTIVE_STATUS];
			let result = await model.QueryListData(query, data, res);
			console.log("hello" + result);
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

	}
}