const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('banner');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;
const bannerUploadLink = process.env.HOST + process.env.PORT + '/uploads/banner/';

const moment = require('moment');

module.exports = {
	List: async (req, res) => {
		try {
			let query = "SELECT banner_id,page_name,Concat(?, CASE WHEN banner_img  != '' THEN  Concat(banner_img) end) as banner_img FROM banner WHERE status=?";
			let data = [bannerUploadLink, ACTIVE_STATUS];

			if (req.query.last_id && req.query.last_id > 0) {
				query += " and banner_id<?";
				data.push(eval(req.query.last_id));
			}
			if (req.query.page_name && req.query.page_name !='') {
				query += " and page_name like ?";
				data.push("%"+req.query.page_name+"%");
			}
			if (req.query.page_records && req.query.page_records > 0) {
				query += ' ORDER BY banner_id DESC LIMIT ?';
				data.push(eval(req.query.page_records));
			}
			else {
				query += ' ORDER BY banner_id DESC';
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
			'page_name': 'required'
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
						var banner_data = {};
						banner_data.page_name = req.body.page_name;
						banner_data.add_by = req.logged_in_id;
						banner_data.add_dt = todays_dt;
						banner_data.status = ACTIVE_STATUS;
						
						if (req.files && req.files.banner_img && req.files.banner_img != '') {
							var element = req.files.banner_img;
							var image_name = now.format("YYYYMMDDHHmmss") + element.name;
							element.mv('./public/uploads/banner/' + image_name);
							banner_data.banner_img = image_name;


							let query = "INSERT INTO `banner`SET ? ";
							let data = [banner_data];
							let result1 = await model.QueryPostData(query, data, res);
							
							if (result1 && typeof result1 !== "undefined" && result1.affectedRows > 0) {
								res.send({
									success: true,
									message: 'Banner added successfully',
									message_arabic:"تمت إضافة البانر بنجاح",
									data: []
								});
							}
							else {
								res.send({
									success: false,
									message: 'Banner added unsuccessfully',
									message_arabic:"تمت إضافة البانر دون نجاح",
									data: []
								});

							}
						}
						else {
							res.send({
								success: false,
								message: 'Banner image is required',
								message_arabic:"صورة البانر مطلوبة",
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
			'banner_id': 'required'
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
					let query = "SELECT banner_id,page_name, Concat(?, CASE WHEN banner_img  != '' THEN  Concat(banner_img) end) as banner_img from banner WHERE banner_id = ? AND status=?";
					let data = [bannerUploadLink, req.body.banner_id, ACTIVE_STATUS];
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
			'banner_id': 'required',

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
					var banner_data = {};
					if(req.body.page_name && req.body.page_name!='' && req.body.page_name!='undefined'){
						banner_data.page_name = req.body.page_name;
					}
					banner_data.mdf_by = req.logged_in_id;
					banner_data.mdf_dt = todays_dt;
					if (req.files && req.files.banner_img && req.files.banner_img != '') {
						var element = req.files.banner_img;
						var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						element.mv('./public/uploads/banner/' + image_name);
						banner_data.banner_img = image_name;

						let query = "UPDATE `banner` SET ? WHERE banner_id=? AND status=?";
						let data = [banner_data, req.body.banner_id, ACTIVE_STATUS];
						let result = await model.QueryPostData(query, data, res);
						if (result) {
							res.send({
								success: true,
								message: 'Banner updated successfully',
								message_arabic:"تم تحديث البانر بنجاح",
								data: []
							});
						} else {
							res.send({
								success: false,
								message: 'Banner updated unsuccessfully',
								message_arabic:"تم تحديث البانر دون جدوى",
								data: []
							});
						}
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
			'banner_id': 'required'
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
					let query = "UPDATE `banner` SET `status` =?, `mdf_by`=?,`mdf_dt`=? WHERE `banner_id` = ?";
					let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.banner_id];

					let result = await model.QueryPostData(query, data, res);
					if (result) {

						return res.send({
							success: true,
							message: 'Banner deleted successfully',
							message_arabic:"تم حذف البانر بنجاح",
							data: []
						});
					} else {
						return res.send({
							success: false,
							message: 'Banner deleted unsuccessfully',
							message_arabic:"تم حذف البانر دون نجاح",
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