const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('sub_category');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const cmn_help = require('./../../../src/helper/comman_helper');
const { check, validationResult } = require('express-validator');

const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;
const subcategoryUploadLink = process.env.HOST + process.env.PORT + '/uploads/sub_category/';

const moment = require('moment');

module.exports = {
	List: async (req, res) => {
		try {
			let query = "SELECT sub_category.sub_category_id,sub_category.category_id,sub_category.sub_category_name,sub_category.sub_category_name_arabic,category.category_name,category.category_name_arabic,Concat(?, CASE WHEN sub_category.sub_category_img  != '' THEN  Concat(sub_category.sub_category_img) end) as sub_category_img, sub_category_year_applies FROM `sub_category` JOIN category ON category.category_id=sub_category.category_id WHERE  sub_category.status=?";
			let data = [subcategoryUploadLink, ACTIVE_STATUS];
			let result = await model.QueryListData(query, data, res);
			if (result)
				res.send({
					success: true,
					message: 'Successfull',
					message_arabic:"ناجح",
					data: result
				});
			else
				res.send({
					success: false,
					message: 'Failed',
					message_arabic:'فشل',
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

	listOncategory: async (req, res) => {
		const validationRule = {
			'category_id': 'required',

		}
		validator(req.query, validationRule, {}, async (err, status) => {
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
					let query = "SELECT sub_category_id,sub_category_name,sub_category_name_arabic, sub_category_year_applies FROM `sub_category` where category_id=? AND status=?";
					let data = [req.query.category_id, ACTIVE_STATUS];
					let result = await model.QueryListData(query, data, res);
					if (result)
						res.send({
							success: true,
							message: 'Successfull',
							message_arabic:"ناجح",
							data: result
						});
					else
						res.send({
							success: false,
							message: 'Failed',
							message_arabic:'فشل',
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


	Add: async (req, res) => {
		const validationRule = {
			'category_id': 'required',
			'sub_category_name': 'required'
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
					// let check = await model.CheckUniqueWithRef(`sub_category_name`, `sub_category`, req.body.sub_category_name.trim(), res, '', '', `category_id`, req.body.category_id);
					let check='';
					if(req.body.sub_category_name_arabic && req.body.sub_category_name_arabic!='' && req.body.sub_category_name_arabic!='undefined'){
							check = await model.CheckUniqueTwoFields(`sub_category_name`,`sub_category_name_arabic`, `sub_category`, req.body.sub_category_name.trim(),req.body.sub_category_name_arabic.trim(), res,'','',`category_id`,req.body.category_id);
							
						}
					else{
						check = await model.CheckUnique(`sub_category_name`, `sub_category`, req.body.sub_category_name.trim(), res,'','',`category_id`,req.body.category_id);
						
					}
					if (check) {
						var sub_category_data = {};
						sub_category_data.sub_category_name = req.body.sub_category_name;
						sub_category_data.category_id = req.body.category_id;
						sub_category_data.add_by = req.logged_in_id;
						sub_category_data.add_dt = todays_dt;
						sub_category_data.status = ACTIVE_STATUS;
						if (req.body.sub_category_year_applies && req.body.sub_category_year_applies != '') {
							sub_category_data.sub_category_year_applies = req.body.sub_category_year_applies;
						}
						if (req.files && req.files.sub_category_img && req.files.sub_category_img != '') {
							var element = req.files.sub_category_img;
console.log("image file")
console.log(element)
							var image_name = now.format("YYYYMMDDHHmmss") + element.name;
							element.mv('./public/uploads/sub_category/' + image_name);
							sub_category_data.sub_category_img = image_name;
						}
						if(req.body.sub_category_name_arabic && req.body.sub_category_name_arabic!='' && req.body.sub_category_name_arabic!='undefined'){
							sub_category_data.sub_category_name_arabic = req.body.sub_category_name_arabic;
						}
						let query = "INSERT INTO `sub_category` SET ?";
						let data = [sub_category_data];
						let result = await model.QueryPostData(query, data, res);
						console.log("hello3"+result);
						if (result.affectedRows > 0)
							res.send({
								success: true,
								message: 'Sub-category added successfully',
								message_arabic:'تمت إضافة فئة فرعية بنجاح',
								data: []
							});
						else
							res.send({
								success: false,
								message: 'Sub-category added unsuccessfully',
								message_arabic:'تمت إضافة فئة فرعية دون نجاح',
								data: []
							});
					}
					else {
						res.send({
							success: false,
							message: 'Sub-category already exists',
							message_arabic:'الفئة الفرعية موجودة بالفعل',
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

	},

	AddManyList: async (req, res) => {
		const validationRule = {
			'category_id': 'required',
			'sub_category_name': 'required'
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
						console.log("sub cat add many")
						console.log(req.body)
						console.log(req.files)
						var sub_category_data = {};
						// sub_category_data.category_id = cmn_help.strtoarry(req.body.category_id);
						sub_category_data.category_id = req.body.category_id;						
						sub_category_data.sub_category_name = cmn_help.strtoarry(req.body.sub_category_name);
						if(req.body.sub_category_name_arabic && req.body.sub_category_name_arabic!='' && req.body.sub_category_name_arabic!='undefined'){
							sub_category_data.sub_category_name_arabic = cmn_help.strtoarry(req.body.sub_category_name_arabic);
						}
						
						if(req.files.sub_category_img && req.files.sub_category_img!='' && req.files.sub_category_img!='undefined'){
							sub_category_data.sub_category_img = cmn_help.strtoarry(req.files.sub_category_img);
						}
						if (req.body.sub_category_year_applies && req.body.sub_category_year_applies != '') {
							// sub_category_data.sub_category_year_applies = cmn_help.strtoarry(req.body.sub_category_year_applies);
							let srt=req.body.sub_category_year_applies
							sub_category_data.sub_category_year_applies = srt.split(',').map(Number);
						}
											
						//many
						var dublicate=[];
						var dublicate_arabic=[];
						var result=[];

						const resp= await Promise.all(sub_category_data.sub_category_name.map(async (sub_cat,index) => {		
							// let check = await model.CheckUniqueWithRef(`sub_category_name`, `sub_category`, sub_category_data.sub_category_name[index], res, '', '', `category_id`, req.body.category_id);
							let check ='';
							if(req.body.sub_category_name_arabic && sub_category_data.sub_category_name_arabic[index] && sub_category_data.sub_category_name_arabic[index]!='' && sub_category_data.sub_category_name_arabic[index]!='undefined'){
								check = await model.CheckUniqueWithRefWithTwoFields(`sub_category_name`,`sub_category_name_arabic`, `sub_category`, sub_category_data.sub_category_name[index].trim(),sub_category_data.sub_category_name_arabic[index].trim(), res, '', '',  `category_id`, req.body.category_id,  `category_id`, req.body.category_id);
								
							}
							else{
								check = await model.CheckUnique(`sub_category_name`, `sub_category`, sub_category_data.sub_category_name[index].trim(), res, '', '', `category_id`, req.body.category_id);
									
							}	
							if(check)
							{


									let sub_cat_data = {};
									sub_cat_data.category_id = sub_category_data.category_id;
									sub_cat_data.sub_category_name = sub_category_data.sub_category_name[index];
									// sub_cat_data.category_id = req.body.category_id;
									sub_cat_data.add_by =req.logged_in_id;
									sub_cat_data.add_dt = todays_dt;
									sub_cat_data.status = ACTIVE_STATUS;
									if (sub_category_data.sub_category_year_applies && sub_category_data.sub_category_year_applies[index] && sub_category_data.sub_category_year_applies[index] !== '' && sub_category_data.sub_category_year_applies[index] !== 'undefined') {
										sub_cat_data.sub_category_year_applies= sub_category_data.sub_category_year_applies[index];
									}
									if (req.body.sub_category_name_arabic && sub_category_data.sub_category_name_arabic && sub_category_data.sub_category_name_arabic[index] && sub_category_data.sub_category_name_arabic[index] !== '' && sub_category_data.sub_category_name_arabic[index] !== 'undefined') {
										sub_cat_data.sub_category_name_arabic = sub_category_data.sub_category_name_arabic[index];
									}


									if(sub_category_data.sub_category_img && sub_category_data.sub_category_img!='' && sub_category_data.sub_category_img!='undefined'){
console.log("sub cat image")
						
										if (sub_category_data.sub_category_img && sub_category_data.sub_category_img[index] && sub_category_data.sub_category_img[index] != '') {
											var element = sub_category_data.sub_category_img[index];
console.log(element.name)
console.log(sub_cat_data)
											var image_name = now.format("YYYYMMDDHHmmss") + element.name;
											element.mv('./public/uploads/sub_category/' + image_name);
											sub_cat_data.sub_category_img = image_name;
										}
									}	
									let query = "INSERT INTO `sub_category` SET ?";
									let data = [sub_cat_data];

									result = await model.QueryPostData(query, data, res);
									
							}
							
							else
							{
								dublicate.push(sub_category_data.sub_category_name[index]);
								if (req.body.sub_category_name_arabic && sub_category_data.sub_category_name_arabic[index] && sub_category_data.sub_category_name_arabic[index] !== '' && sub_category_data.sub_category_name_arabic[index] !== 'undefined') {
									dublicate_arabic.push(sub_category_data.sub_category_name_arabic[index]);
								}
								
							}
						}))
					if (resp && dublicate.length!=sub_category_data.sub_category_name.length )
					{
						// console.log("hello1"+dublicate.length);
						// console.log("hello2"+sub_category_data.sub_category_name.length);
						// console.log("hello3"+dublicate_arabic.length);
						// console.log("hello4"+sub_category_data.sub_category_name_arabic.length);
						var msg='sub_category query ran successfully..!'
						var msgarb="تم تشغيل استعلام الفئة الفرعية بنجاح"
						if(dublicate.length && dublicate_arabic.length)
						{
							msg+=' and sub category name in english :'+dublicate+' and subcategory names in arabic:'+dublicate_arabic+' already exist , hence not added';
							msgarb+=' واسم الفئة الفرعية باللغة الإنجليزية:'+dublicate+' وأسماء الفئات الفرعية باللغة العربية:'+dublicate_arabic+' موجودة بالفعل ، ومن ثم لم تتم إضافتها'
						}
						else if(dublicate_arabic.length){
							msg+=' and subcategory names in arabic:'+dublicate_arabic+' already exist , hence not added';
							msgarb+=' وأسماء الفئات الفرعية باللغة العربية:'+dublicate_arabic+' موجودة بالفعل ، ومن ثم لم تتم إضافتها'
						}
						else if(dublicate.length){
							msg+=' and sub category name in english :'+dublicate+' already exist , hence not added';
							msgarb+=' واسم الفئة الفرعية باللغة الإنجليزية:'+dublicate+' موجودة بالفعل ، ومن ثم لم تتم إضافتها'
						}
						else{
							msg+='All fields were added successfully';
							msgarb+=' تم إضافة جميع الحقول بنجاح'
						}
						res.send({
							success: true,
							message: msg,
							message_arabic:msgarb,
							data: []
						});
					}
					else if(dublicate.length==sub_category_data.sub_category_name.length){
						res.send({
							success: false,
							message: 'Sub-category already exists',
							message_arabic:'الفئة الفرعية موجودة بالفعل',
							data: []
						});
					}
					else
						res.send({
							success: false,
							message: 'Sub-category added unsuccessfully',
							message_arabic:'تمت إضافة فئة فرعية دون نجاح',
							data: []
						});

					// else {
					// 	res.send({
					// 		success: false,
					// 		message: 'sub_category must be unique',
					// 		data: []
					// 	});
					// }
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

	Edit: async (req, res) => {
		const validationRule = {
			'sub_category_id': 'required'
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
					let query = "SELECT sub_category.sub_category_id,sub_category.category_id,sub_category.sub_category_name,sub_category.sub_category_name_arabic,category.category_name,category.category_name_arabic,Concat(?, CASE WHEN sub_category.sub_category_img  != '' THEN  Concat(sub_category.sub_category_img) end) as sub_category_img, sub_category_year_applies FROM `sub_category` JOIN category on category.category_id=sub_category.category_id WHERE sub_category.sub_category_id=?";
					let data = [subcategoryUploadLink, req.body.sub_category_id];
					if (req.body.sub_category_year_applies && req.body.sub_category_year_applies != '') {
						query += ' and sub_category.sub_category_year_applies=?';
						// data.push(req.body.sub_category_year_applies);
					}
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


	Update: async (req, res) => {
		const validationRule = {
			'category_id': 'required',
			'sub_category_id': 'required',
			'sub_category_name': 'required'			
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
					// let check = await model.CheckUniqueWithRef(`sub_category_name`, `sub_category`, req.body.sub_category_name.trim(), res, `sub_category_id`, req.body.sub_category_id, `category_id`, req.body.category_id);
					let check ='';
							if(req.body.sub_category_name_arabic && req.body.sub_category_name_arabic!='' && req.body.sub_category_name_arabic!='undefined'){
								check = await model.CheckUniqueWithRefWithTwoFields(`sub_category_name`,`sub_category_name_arabic`, `sub_category`, req.body.sub_category_name.trim(),req.body.sub_category_name_arabic.trim(), res, `sub_category_id`, req.body.sub_category_id, `category_id`, req.body.category_id ,`category_id`, req.body.category_id);
								
							}
							else{
								check = await model.CheckUnique(`sub_category_name`, `sub_category`, req.body.sub_category_name.trim(), res, `sub_category_id`, req.body.sub_category_id, `category_id`, req.body.category_id ,`category_id`, req.body.category_id);
									
							}	
					if (check) {
						var sub_category_data = {};
						sub_category_data.sub_category_name = req.body.sub_category_name;
						sub_category_data.category_id = req.body.category_id;
						sub_category_data.mdf_by = req.logged_in_id;
						sub_category_data.mdf_dt = todays_dt;
						sub_category_data.status = ACTIVE_STATUS;
						if (req.body.sub_category_year_applies && req.body.sub_category_year_applies != '') {
							sub_category_data.sub_category_year_applies = req.body.sub_category_year_applies;
						}
						if (req.files && req.files.sub_category_img && req.files.sub_category_img != '') {
							var element = req.files.sub_category_img;
							var image_name = now.format("YYYYMMDDHHmmss") + element.name;
							element.mv('./public/uploads/sub_category/' + image_name);
							sub_category_data.sub_category_img = image_name;
						}
						if(req.body.sub_category_name_arabic && req.body.sub_category_name_arabic!='' && req.body.sub_category_name_arabic!='undefined'){
							sub_category_data.sub_category_name_arabic = req.body.sub_category_name_arabic;
						}
						let query = "UPDATE `sub_category` SET ? WHERE sub_category_id=? AND status=?";
						let data = [sub_category_data, req.body.sub_category_id, ACTIVE_STATUS];
						let result = await model.QueryPostData(query, data, res);
						if (result.affectedRows > 0)
							res.send({
								success: true,
								message: 'Sub-category updated successfully',
								message_arabic:'تم تحديث الفئة الفرعية بنجاح',
								data: []
							});
						else
							res.send({
								success: false,
								message: 'Sub-category updated unsuccessfully',
								message_arabic:'تم تحديث الفئة الفرعية دون جدوى',
								data: []
							});
					}
					else {
						res.send({
							success: false,
							message: 'Sub-category already exists',
							message_arabic:'الفئة الفرعية موجودة بالفعل',
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
	},



	Delete: async (req, res) => {
		const validationRule = {
			'sub_category_id': 'required'
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

					let where_con = 'sub_category_id=? and status=?';
					let where_data = [req.body.sub_category_id, ACTIVE_STATUS]
					let check = await model.CheckForDelete('products', where_con, where_data);
					let check1 =await model.CheckForDelete('brand', where_con, where_data);

					if (check && check1) {
					let query = "UPDATE sub_category SET status=? WHERE sub_category_id=? ";
					let data = [IN_ACTIVE_STATUS, req.body.sub_category_id];

					let result = await model.QueryPostData(query, data, res);
					if (result.affectedRows > 0) {

						res.send({
							success: true,
							message: 'Sub-category deleted successfully',
							message_arabic:'تم حذف الفئة الفرعية بنجاح',
							data: []
						});
					}
					else {
						res.send({
							success: false,
							message: 'Sub-category deleted unsuccessfully',
							message_arabic:'تم حذف الفئة الفرعية دون نجاح',
							data: []
						});
					}
				}
				else
				{
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
						message_arabic:'هناك خطأ ما',
						data: error.message
					});
				}
			}
		});

	}
}