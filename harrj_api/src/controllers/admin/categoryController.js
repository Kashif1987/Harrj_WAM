const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('category');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;
const categoryUploadLink = process.env.HOST + process.env.PORT + '/uploads/category/';
const subcategoryUploadLink = process.env.HOST + process.env.PORT + '/uploads/sub_category/';
const brandUploadLink = process.env.HOST + process.env.PORT + '/uploads/brand/';


const moment = require('moment');



module.exports = {
	List: async (req, res) => {
		try {
			let query = "SELECT category_id,category_name,category_name_arabic,Concat(?, CASE WHEN category_img  != '' THEN  Concat(category_img) end) as category_img FROM category WHERE status=?";
			let data = [categoryUploadLink, ACTIVE_STATUS];
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
				message: 'Something Went Wrong',
				message_arabic:"هناك خطأ ما",
				data: error.message
			});
		}

	},

	// CatSubCatList: async (req, res) => {
	// 	try {
	// 		let query = "SELECT category_id,category_name,Concat(?, CASE WHEN category_img  != '' THEN  Concat(category_img) end) as category_img FROM category WHERE status=?";
	// 		let data = [categoryUploadLink, ACTIVE_STATUS];
	// 		let result = await model.QueryListData(query, data, res);
	// 		if (result) {
	// 			// console.log(sql.updates)
	// 			if (result.length) {
	// 				result.forEach(async (element, index) => {
	// 					query = "SELECT sub_category_id,sub_category_name,Concat(?, CASE WHEN sub_category_img  != '' THEN  Concat(sub_category_img) end) as sub_category_img FROM `sub_category` where category_id=? AND status=?";
	// 					data = [subcategoryUploadLink, element.category_id, ACTIVE_STATUS];
	// 					result[index]['sub_category_data'] = await model.QueryListData(query, data, res);
	// 				})
	// 			}
	// 			res.send({
	// 				success: true,
	// 				message: 'Successfull',
	// 				data: result
	// 			});
	// 		} else
	// 			res.send({
	// 				success: false,
	// 				message: 'Failed',
	// 				data: []
	// 			});
	// 	} catch (error) {
	// 		// console.log(e.message);
	// 		res.send({
	// 			success: false,
	// 			message: 'Something Went Wrong...',
	// 			data: error.message
	// 		});
	// 	}

	// },

	CatSubCatList:async (req, res) => {
		const validationRule = {
			'category_id': 'required'
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
					let query = "SELECT sub_category_id,sub_category_name,sub_category_name_arabic,Concat(?, CASE WHEN sub_category_img  != '' THEN  Concat(sub_category_img) end) as sub_category_img FROM sub_category WHERE category_id=? AND status=?";
					let data = [subcategoryUploadLink,req.body.category_id, ACTIVE_STATUS];
					let result = await model.QueryListData(query, data, res);
					if (result)
						res.send({
							success: true,
							message: 'Successfull',
							message_arabic:"النجاح",
							data: result
						});
					else
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
			}
		});
	}, 
	
	CatBrandList:async (req, res) => {
		const validationRule = {
			'category_id': 'required'
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
					let query = "SELECT brand_id,brand_name,brand_name_arabic,Concat(?, CASE WHEN brand_img  != '' THEN  Concat(brand_img) end) as brand_img FROM `brand` where category_id in(?) AND status=?";
					let data = [brandUploadLink,req.body.category_id, ACTIVE_STATUS];
					let result = await model.QueryListData(query, data, res);
					if (result)
						res.send({
							success: true,
							message: 'Successfull',
							message_arabic:"النجاح",
							data: result
						});
					else
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
			}
		});
	}, 
										
	Add: async (req, res) => {
		const validationRule = {
			'category_name': 'required'
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
					let check ='';
					// let check = await model.CheckUnique(`category_name`, `category`, req.body.category_name.trim(), res);
					if(req.body.category_name_arabic && req.body.category_name_arabic!='' && req.body.category_name_arabic!='undefined'){
						check = await model.CheckUniqueTwoFields(`category_name`,`category_name_arabic`, `category`, req.body.category_name.trim(),req.body.category_name_arabic.trim(), res);
						console.log("baby1"+check);
					}
					else{
							check = await model.CheckUnique(`category_name`, `category`, req.body.category_name.trim(), res);
							console.log("baby2"+check);
					}				
					if (check) {
						var category_data = {};
						category_data.category_name = req.body.category_name;
						category_data.add_by = req.logged_in_id;
						category_data.add_dt = todays_dt;
						category_data.status = ACTIVE_STATUS;
						if (req.files && req.files.category_img && req.files.category_img != '') {
							var element = req.files.category_img;
							var image_name = now.format("YYYYMMDDHHmmss") + element.name;
							element.mv('./public/uploads/category/' + image_name);
							category_data.category_img = image_name;
						}
						if(req.body.category_name_arabic && req.body.category_name_arabic!='' && req.body.category_name_arabic!='undefined'){
							category_data.category_name_arabic = req.body.category_name_arabic;
						}
						
						// let query ="INSERT INTO `category`(`category_name`,`status`,`add_by`,`add_dt`) VALUES (?,?,?,?)";
						// let data=[req.body.category_name.trim(),ACTIVE_STATUS,req.logged_in_id,todays_dt];
						let query = "INSERT INTO `category` SET ?";
						let data = [category_data];
						let result = await model.QueryPostData(query, data, res);
						if (result)
							res.send({
								success: true,
								message: 'Category added successfully',
								message_arabic:"تمت إضافة الفئة بنجاح",
								data: []
							});
						else
							res.send({
								success: false,
								message: 'Category added unsuccessfully',
								message_arabic:"تمت إضافة الفئة دون نجاح",
								data: []
							});
					} else {
						res.send({
							success: false,
							message: 'Category already exists',
							message_arabic:"الفئة موجودة بالفعل",
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
			'category_id': 'required'
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
					let query = "SELECT `category_id`,`category_name`,`category_name_arabic`,Concat(?, CASE WHEN category_img  != '' THEN  Concat(category_img) end) as category_img   FROM `category` WHERE category_id = ? AND status=?";
					let data = [categoryUploadLink, req.body.category_id, ACTIVE_STATUS];
					let result = await model.QueryListData(query, data, res);
					if (result)
						res.send({
							success: true,
							message: 'Success',
							message_arabic:"النجاح",
							data: result
						});
					else
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
			}
		});
	},
	Update: async (req, res) => {
		const validationRule = {
			'category_id': 'required',
			'category_name': 'required'
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
					let check='';
					if(req.body.category_name_arabic && req.body.category_name_arabic!='' && req.body.category_name_arabic!='undefined'){
							check = await model.CheckUniqueTwoFields(`category_name`,`category_name_arabic`, `category`, req.body.category_name.trim(),req.body.category_name_arabic.trim(), res, `category_id`, req.body.category_id);
							
						}
					else{
						check = await model.CheckUnique(`category_name`, `category`, req.body.category_name.trim(), res, `category_id`, req.body.category_id);
						
					}
					
					if (check) {
						var category_data = {};
						category_data.category_name = req.body.category_name;
						category_data.mdf_by = req.logged_in_id;
						category_data.mdf_dt = todays_dt;
						category_data.status = ACTIVE_STATUS;
						if (req.files && req.files.category_img && req.files.category_img != '') {
							var element = req.files.category_img;
							var image_name = now.format("YYYYMMDDHHmmss") + element.name;
							element.mv('./public/uploads/category/' + image_name);
							category_data.category_img = image_name;
						}
						if(req.body.category_name_arabic && req.body.category_name_arabic!='' && req.body.category_name_arabic!='undefined'){
							category_data.category_name_arabic = req.body.category_name_arabic;
						}
						let query = "UPDATE `category` SET ? WHERE category_id=? ";
						let data = [category_data, req.body.category_id];
						let result = await model.QueryPostData(query, data, res);
						if (result) {
							res.send({
								success: true,
								message: 'Category updated successfully',
								message_arabic:"تم تحديث الفئة بنجاح",
								data: []
							});
						} else {
							res.send({
								success: false,
								message: 'Category updated unsuccessfully',
								message_arabic:"تم تحديث الفئة دون جدوى",
								data: []
							});
						}
					}
					else {
						res.send({
							success: false,
							message: 'Category already exists',
							message_arabic:"الفئة موجودة بالفعل",
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
			'category_id': 'required'
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
					let where_con = 'category_id=? and status=?';
					let where_data = [req.body.category_id, ACTIVE_STATUS]
					let check = await model.CheckForDelete('products', where_con, where_data);
					let check1 =await model.CheckForDelete('sub_category', where_con, where_data);
					if (check && check1) {
						let query = "UPDATE `category` SET `status` =?,`mdf_by`=?,`mdf_dt`=? WHERE `category_id` = ?";
						let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.category_id];

						let result = await model.QueryPostData(query, data, res);
						if (result) {

							return res.send({
								success: true,
								message: 'Category deleted successfully',
								message_arabic:"تم حذف الفئة بنجاح",
								data: []
							});
						} else {
							return res.send({
								success: false,
								message: 'Category deleted unsuccessfully',
								message_arabic:"تم حذف الفئة دون نجاح",
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