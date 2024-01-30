const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('brand');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;
const cmn_help = require('./../../../src/helper/comman_helper');
// const brandUploadLink = process.env.HOST + process.env.PORT + '/uploads/brand/';
// const subbrandUploadLink = process.env.HOST + process.env.PORT + '/uploads/sub_brand/';
const brandUploadLink = process.env.HOST + process.env.PORT + '/uploads/brand/';



const moment = require('moment');



module.exports = {
	List: async (req, res) => {
		try {
			let query = "SELECT b.category_id,c.category_name,c.category_name_arabic,b.sub_category_id,s.sub_category_name,s.sub_category_name_arabic,b.brand_id,b.brand_name,b.brand_name_arabic,Concat(?, CASE WHEN b.brand_img  != '' THEN  Concat(b.brand_img) end) as brand_img FROM brand b left join category c on c.category_id=b.category_id left join sub_category s on s.sub_category_id=b.sub_category_id  WHERE b.status=?";
			let data = [brandUploadLink, ACTIVE_STATUS];
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
					message_arabic:'فشل',
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

	AddManyBrandList: async (req, res) => {
		const validationRule = {
			'category_id': 'required',
			'sub_category_id': 'required',
			'brand_name': 'required'
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
					
						var brand_data = {};
						//mandatory fields
						// brand_data.category_id = cmn_help.strtoarry(req.body.category_id);
						// brand_data.sub_category_id = cmn_help.strtoarry(req.body.sub_category_id);
						brand_data.category_id = req.body.category_id;
						brand_data.sub_category_id = req.body.sub_category_id;
						brand_data.brand_name = cmn_help.strtoarry(req.body.brand_name);
						//non mandatory fields
						if(req.body.brand_name_arabic && req.body.brand_name_arabic!='' && req.body.brand_name_arabic!='undefined'){
							brand_data.brand_name_arabic = cmn_help.strtoarry(req.body.brand_name_arabic);
						}
						if(req.files && req.files.brand_img && brand_data.brand_img!='' && req.files.brand_img!='undefined'){
							brand_data.brand_img = cmn_help.strtoarry(req.files.brand_img);
						}
						// if (req.body.sub_category_year_applies && req.body.sub_category_year_applies != '') {
						// 	sub_category_data.sub_category_year_applies = cmn_help.strtoarry(req.body.sub_category_year_applies);
						// }
											
						//many
						var dublicate=[];
						var dublicate_arabic=[];
						var result=[];

						const resp= await Promise.all(brand_data.brand_name.map(async (sub_cat,index) => {		
							// let check = await model.CheckUniqueWithTwoRef(`brand_name`, `brand`, brand_data.brand_name[index], res, '', '', `sub_category_id`, req.body.sub_category_id,`category_id`, req.body.category_id);
							// console.log("hello");
							// console.log(check);
							let check ='';
							if(req.body.brand_name_arabic && brand_data.brand_name_arabic[index] && brand_data.brand_name_arabic[index]!='' && brand_data.brand_name_arabic[index]!='undefined'){
								// check = await model.CheckUniqueTwoFields(`brand_name`,`brand_name_arabic`, `brand`, brand_data.brand_name[index].trim(),brand_data.brand_name_arabic[index].trim(), res);
								//check = await model.CheckUniqueWithTwoRefWithTwoFields(`brand_name`,`brand_name_arabic`, `brand`, req.body.brand_name[index].trim(), req.body.brand_name_arabic[index].trim(), res, '', '', `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
								check = await model.CheckUniqueWithTwoRefWithTwoFields(`brand_name`,`brand_name_arabic`, `brand`, brand_data.brand_name[index].trim(), brand_data.brand_name_arabic[index].trim(), res, '', '', `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
							}
							else{
								// check = await model.CheckUnique(`brand_name`, `brand`, brand_data.brand_name[index].trim(), res);
								//check = await model.CheckUniqueWithTwoRef(`brand_name`, `brand`, req.body.brand_name[index].trim(), res, '', '', `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
								check = await model.CheckUniqueWithTwoRef(`brand_name`, `brand`, req.body.brand_name, res, `brand_id`, req.body.brand_id, `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
							}	
							if(check)
							{
								// console.log("hello2");
									let brand_total_data = {};
									//mandatory fields
									brand_total_data.brand_name = brand_data.brand_name[index];
									// brand_total_data.category_id = brand_data.category_id[index];
									// brand_total_data.sub_category_id = brand_data.sub_category_id[index];
									brand_total_data.category_id = brand_data.category_id;
									brand_total_data.sub_category_id = brand_data.sub_category_id;
									
									brand_total_data.add_by =req.logged_in_id;
									brand_total_data.add_dt = todays_dt;
									brand_total_data.status = ACTIVE_STATUS;
									//non mandatory fields
									// console.log(brand_data.brand_name);
									// console.log(brand_data.category_id);
									// console.log(brand_data.sub_category_id);
									// console.log(brand_data.add_by);
									// console.log(brand_data.status);

									// if (brand_data.sub_category_year_applies && sub_category_data.sub_category_year_applies[index] && sub_category_data.sub_category_year_applies[index] !== '' && sub_category_data.sub_category_year_applies[index] !== 'undefined') {
									// 	brand_data.sub_category_year_applies= sub_category_data.sub_category_year_applies[index];
									// }

									if(brand_data.brand_img && brand_data.brand_img!='' && brand_data.brand_img!='undefined'){
						
										if (brand_data.brand_img && brand_data.brand_img[index] && brand_data.brand_img[index] != '') {
											var element = brand_data.brand_img[index];
											var image_name = now.format("YYYYMMDDHHmmss") + element.name;
											element.mv('./public/uploads/brand/' + image_name);
											brand_total_data.brand_img = image_name;
										}
									}	
									if (req.body.brand_name_arabic && brand_data.brand_name_arabic && brand_data.brand_name_arabic[index] && brand_data.brand_name_arabic[index] !== '' && brand_data.brand_name_arabic[index] !== 'undefined') {
										brand_total_data.brand_name_arabic = brand_data.brand_name_arabic[index];
									}
									let query = "INSERT INTO `brand` SET ?";
									let data = [brand_total_data];
									console.log(query);
									result = await model.QueryPostData(query, data, res);
									
							}
							else
							{
								dublicate.push(brand_data.brand_name[index]);
								if (req.body.brand_name_arabic && brand_data.brand_name_arabic[index] && brand_data.brand_name_arabic[index] !== '' && brand_data.brand_name_arabic[index] !== 'undefined') {
									dublicate_arabic.push(brand_data.brand_name_arabic[index]);
								}
							}
						}))
					if (resp && dublicate.length!=brand_data.brand_name.length)
					{
						// console.log("hello1"+dublicate.length);
						// console.log("hello2"+brand_data.brand_name.length);
						// console.log("hello3"+dublicate_arabic.length);
						// console.log("hello4"+brand_data.brand_name_arabic.length);
						var msg='brand query ran successfully..!'
						var msgarb="تم تشغيل الاستعلام عن العلامة التجارية بنجاح"
						if(dublicate.length && dublicate_arabic.length)
						{
							msg+=' and brand name in english :'+dublicate+' and brand names in arabic:'+dublicate_arabic+' already exist , hence not added';
							msgarb+=' واسم العلامة التجارية باللغة الإنجليزية:'+dublicate+' والأسماء التجارية باللغة العربية:'+dublicate_arabic+' موجودة بالفعل ، ومن ثم لم تتم إضافتها'
						}
						else if(req.body.brand_name_arabic && dublicate_arabic.length){
							msg+=' and brand names in arabic:'+dublicate_arabic+' already exist , hence not added';
							msgarb+=' والأسماء التجارية باللغة العربية:'+dublicate_arabic+ ' موجودة بالفعل ، ومن ثم لم تتم إضافتها'
						}
						else if(dublicate.length){
							msg+=' and brand name in english :'+dublicate+' already exist , hence not added';
							msgarb+=' واسم العلامة التجارية باللغة الإنجليزية:'+dublicate+' موجودة بالفعل ، ومن ثم لم تتم إضافتها '
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
					else if(dublicate.length==brand_data.brand_name.length ){
						res.send({
							success: false,
							message: 'All brand names already exist !',
							message_arabic:"جميع الأسماء التجارية موجودة بالفعل",
							data: []
						});
					}
					else
						res.send({
							success: false,
							message: 'Something wrong, brand not added successfully..!',
							message_arabic:"شيء خاطئ ، لم تتم إضافة العلامة التجارية بنجاح",
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
						message_arabic:"هناك خطأ ما",
						data: error.message
					});
				}
			}
		});

	},

	SubCatBrandList: async (req, res) => {
		const validationRule = {
			'sub_category_id': 'required'
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
			
						let query = "SELECT brand_id, brand_name, brand_name_arabic FROM `brand` where sub_category_id=? AND status=?";
						let data = [req.body.sub_category_id, ACTIVE_STATUS];
						let result = await model.QueryListData(query, data, res);
				
			if (result) {
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
		}	}
		});

	},

	

	BrandModelList: async (req, res) => {
		const validationRule = {
			'brand_id': 'required'
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
			
						let query = "SELECT model_id, model_name, model_name_arabic FROM `model` where brand_id=? AND status=?";
						let data = [req.body.brand_id, ACTIVE_STATUS];
						let result = await model.QueryListData(query, data, res);
				
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
		}	}
		});

	},

	
	Add: async (req, res) => {
		const validationRule = {
			'category_id': 'required',
			'sub_category_id': 'required',
			'brand_name' : 'required'
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
					// let check = await model.CheckUnique(`brand_name`, `brand`, req.body.brand_name.trim(), res);
					// let check = await model.CheckUniqueWithRef(`brand_name`, `brand`, req.body.brand_name.trim(), res, '', '', `category_id`, req.body.category_id);
					// let check = await model.CheckUniqueWithTwoRef(`brand_name`, `brand`, req.body.brand_name.trim(), res, '', '', `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
					// let check_arabic = await model.CheckUniqueWithTwoRef(`brand_name_arabic`, `brand`, req.body.brand_name_arabic.trim(), res, '', '', `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
					let check='';
					if(req.body.brand_name_arabic && req.body.brand_name_arabic!='' && req.body.brand_name_arabic!='undefined'){
							check = await model.CheckUniqueTwoFields(`brand_name`,`brand_name_arabic`, `brand`, req.body.brand_name.trim(),req.body.brand_name_arabic.trim(), res);
							//check = await model.CheckUniqueWithTwoRefWithTwoFields(`brand_name`,`brand_name_arabic`, `brand`, req.body.brand_name.trim(), req.body.brand_name_arabic.trim(), res, '', '', `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
							//check = await model.CheckUniqueWithTwoRefWithTwoFields(`brand_name`,`brand_name_arabic`, `brand`, req.body.brand_name.trim(), req.body.brand_name_arabic.trim(), res, ``, '', `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
						} 
					else{
						check = await model.CheckUniqueTwoFields(`brand_name`, `brand`, req.body.brand_name.trim(), res);
						//check = await model.CheckUniqueWithTwoRef(`brand_name`, `brand`, req.body.brand_name.trim(), res, '', '', `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
						//check = await model.CheckUniqueWithTwoRef(`brand_name`, `brand`, req.body.brand_name.trim(), res, `brand_id`, req.body.brand_id, `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
					}
					if (check) {
						var brand_data = {};
						brand_data.category_id = req.body.category_id;
						brand_data.sub_category_id = req.body.sub_category_id;
						brand_data.brand_name = req.body.brand_name;
						brand_data.add_by = req.logged_in_id;
						brand_data.add_dt = todays_dt;
						brand_data.status = ACTIVE_STATUS;
						if (req.files && req.files.brand_img && req.files.brand_img != '') {
							var element = req.files.brand_img;
							var image_name = now.format("YYYYMMDDHHmmss") + element.name;
							element.mv('./public/uploads/brand/' + image_name);
							brand_data.brand_img = image_name;
						}
						//checking is user has given arabic name , if yes , we are adding him
						if(req.body.brand_name_arabic && req.body.brand_name_arabic!='' && req.body.brand_name_arabic!='undefined'){
							brand_data.brand_name_arabic = req.body.brand_name_arabic;
						}
						// let query ="INSERT INTO `brand`(`brand_name`,`status`,`add_by`,`add_dt`) VALUES (?,?,?,?)";
						// let data=[req.body.brand_name.trim(),ACTIVE_STATUS,req.logged_in_id,todays_dt];
						let query = "INSERT INTO `brand` SET ?";
						let data = [brand_data];
						let result = await model.QueryPostData(query, data, res);
						if (result)
							res.send({
								success: true,
								message: 'Brand added successfully',
								message_arabic:"تمت إضافة العلامة التجارية بنجاح",
								data: []
							});
						else
							res.send({
								success: false,
								message: 'Brand added unsuccessfully',
								message_arabic:"تمت إضافة العلامة التجارية دون جدوى",
								data: []
							});
					} else {
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
	Edit: async (req, res) => {
		const validationRule = {
			'brand_id': 'required'
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
					// let query = "SELECT `b.category_id`,`c.category_name`,`b.brand_id`,`b.brand_name`,Concat(?, CASE WHEN b.brand_img  != '' THEN  Concat(b.brand_img) end) as brand_img   FROM `brand` b left join `category` c on c.category_id=b.category_id  WHERE b.brand_id = ? AND b.status=?";
					let query = "SELECT b.category_id,c.category_name,c.category_name_arabic, b.sub_category_id,s.sub_category_name,s.sub_category_name_arabic,b.brand_id,b.brand_name,b.brand_name_arabic,Concat(?, CASE WHEN b.brand_img  != '' THEN  Concat(b.brand_img) end) as brand_img FROM brand b left join `category` c on c.category_id=b.category_id left join sub_category s on s.sub_category_id=b.sub_category_id   WHERE b.brand_id = ? AND b.status=?";
					             
					let data = [brandUploadLink, req.body.brand_id, ACTIVE_STATUS];
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
			'brand_id': 'required',
			'brand_name': 'required'
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
					// let check = await model.CheckUnique(`brand_name`, `brand`, req.body.brand_name.trim(), res, `brand_id`, req.body.brand_id);
					let check ='';
							if(req.body.brand_name_arabic && req.body.brand_name_arabic!='' && req.body.brand_name_arabic!='undefined'){
								// check = await model.CheckUniqueTwoFields(`brand_name`,`brand_name_arabic`, `brand`, req.body.brand_name.trim(),req.body.brand_name_arabic.trim(), res, `brand_id`, req.body.brand_id);
								check = await model.CheckUniqueWithTwoRefWithTwoFields(`brand_name`,`brand_name_arabic`, `brand`, req.body.brand_name.trim(), req.body.brand_name_arabic.trim(), res, `brand_id`, req.body.brand_id, `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
								
							
							}
							else{
								// check = await model.CheckUnique(`brand_name`, `brand`, req.body.brand_name.trim(), res, `brand_id`, req.body.brand_id);
								check = await model.CheckUniqueWithTwoRef(`brand_name`, `brand`, req.body.brand_name.trim(), res, `brand_id`, req.body.brand_id, `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
									
							}	
					if (check) {
						var brand_data = {};
						brand_data.brand_name = req.body.brand_name;
						brand_data.mdf_by = req.logged_in_id;
						brand_data.mdf_dt = todays_dt;
						brand_data.status = ACTIVE_STATUS;
						if (req.files && req.files.brand_img && req.files.brand_img != '') {
							var element = req.files.brand_img;
							var image_name = now.format("YYYYMMDDHHmmss") + element.name;
							element.mv('./public/uploads/brand/' + image_name);
							brand_data.brand_img = image_name;
						}
						if (req.body.category_id && req.body.category_id !== '' && req.body.category_id !== 'undefined') {
							brand_data.category_id = req.body.category_id;
						}
						if (req.body.sub_category_id && req.body.sub_category_id !== '' && req.body.sub_category_id !== 'undefined') {
							brand_data.sub_category_id = req.body.sub_category_id;
						}
						if (req.body.brand_name_arabic && req.body.brand_name_arabic !== '' && req.body.brand_name_arabic !== 'undefined') {
							brand_data.brand_name_arabic = req.body.brand_name_arabic;
						}
						let query = "UPDATE `brand` SET ? WHERE brand_id=? ";
						let data = [brand_data, req.body.brand_id];
						let result = await model.QueryPostData(query, data, res);
						if (result) {
							res.send({
								success: true,
								message: 'Brand updated successfully',
								message_arabic:"تم تحديث العلامة التجارية بنجاح",
								data: []
							});
						} else {
							res.send({
								success: false,
								message: 'Brand updated unsuccessfully',
								message_arabic:"تم تحديث العلامة التجارية دون جدوى",
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


	Delete: async (req, res) => {
		const validationRule = {
			'brand_id': 'required'
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
					let where_con = 'brand_id=? and status=?';
					let where_data = [req.body.brand_id, ACTIVE_STATUS]
					let check = await model.CheckForDelete('products', where_con, where_data);
					let check1 = await model.CheckForDelete('model', where_con, where_data);
					if (check && check1) {
						let query = "UPDATE `brand` SET `status` =?,`mdf_by`=?,`mdf_dt`=? WHERE `brand_id` = ?";
						let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.brand_id];

						let result = await model.QueryPostData(query, data, res);
						if (result) {

							return res.send({
								success: true,
								message: 'Brand deleted successfully',
								message_arabic:"تم حذف العلامة التجارية بنجاح",
								data: []
							});
						} else {
							return res.send({
								success: false,
								message: 'Brand deleted unsuccessfully',
								message_arabic:"تم حذف العلامة التجارية دون جدوى",
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