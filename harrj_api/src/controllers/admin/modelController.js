const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('model');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;
const cmn_help = require('./../../../src/helper/comman_helper');
// const modelUploadLink = process.env.HOST + process.env.PORT + '/uploads/model/';
// const submodelUploadLink = process.env.HOST + process.env.PORT + '/uploads/sub_model/';


const moment = require('moment');



module.exports = {
	List: async (req, res) => {
		try {
			let query = "SELECT m.category_id,c.category_name,c.category_name_arabic,m.sub_category_id,s.sub_category_name,s.sub_category_name_arabic,m.brand_id,b.brand_name,b.brand_name_arabic,m.model_id,m.model_name,m.model_name_arabic,m.model_description,m.model_description_arabic FROM model m left join category c on c.category_id=m.category_id left join brand b on b.brand_id=m.brand_id left join sub_category s on s.sub_category_id=m.sub_category_id  WHERE m.status=?";
			let data = [ACTIVE_STATUS];
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

	// CatSubCatList: async (req, res) => {
	// 	try {
	// 		let query = "SELECT model_id,model_name,Concat(?, CASE WHEN model_img  != '' THEN  Concat(model_img) end) as model_img FROM model WHERE status=?";
	// 		let data = [modelUploadLink, ACTIVE_STATUS];
	// 		let result = await model.QueryListData(query, data, res);
	// 		if (result) {
	// 			// console.log(sql.updates)
	// 			if (result.length) {
	// 				result.forEach(async (element, index) => {
	// 					query = "SELECT sub_model_id,sub_model_name,Concat(?, CASE WHEN sub_model_img  != '' THEN  Concat(sub_model_img) end) as sub_model_img FROM `sub_model` where model_id=? AND status=?";
	// 					data = [submodelUploadLink, element.model_id, ACTIVE_STATUS];
	// 					result[index]['sub_model_data'] = await model.QueryListData(query, data, res);
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



	Add: async (req, res) => {
		const validationRule = {
			'category_id': 'required',
			'sub_category_id': 'required',
			'brand_id' : 'required',
			'model_name': 'required'
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
					// let check = await model.CheckUniqueWithThreeRef(`model_name`, `model`, req.body.model_name.trim(), res, '', '', `brand_id`, req.body.brand_id, `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
					// let check = await model.CheckUnique(`model_name`, `model`, req.body.model_name.trim(), res);
					let check='';
					if(req.body.model_name_arabic && req.body.model_name_arabic!='' && req.body.model_name_arabic!='undefined'){
							check = await model.CheckUniqueWithThreeRefWithTwoFields(`model_name`,`model_name_arabic`, `model`, req.body.model_name.trim(),req.body.model_name_arabic.trim(), res, '', '', `brand_id`, req.body.brand_id, `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
							
						}
					else{
						check = await model.CheckUniqueWithThreeRef(`model_name`, `model`, req.body.model_name.trim(), res, '', '', `brand_id`, req.body.brand_id, `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
					
					}
					if (check) {
						var model_data = {};
						model_data.category_id = req.body.category_id;
						model_data.sub_category_id = req.body.sub_category_id;
						model_data.brand_id = req.body.brand_id;
						model_data.model_name = req.body.model_name;
						model_data.model_name_arabic=req.body.model_name_arabic;
						model_data.model_description = req.body.model_description;
						model_data.add_by = req.logged_in_id;
						model_data.add_dt = todays_dt;
						model_data.status = ACTIVE_STATUS;
						// if (req.files && req.files.model_img && req.files.model_img != '') {
						// 	var element = req.files.model_img;
						// 	var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						// 	element.mv('./public/uploads/model/' + image_name);
						// 	model_data.model_img = image_name;
						// }
						// let query ="INSERT INTO `model`(`model_name`,`status`,`add_by`,`add_dt`) VALUES (?,?,?,?)";
						// let data=[req.body.model_name.trim(),ACTIVE_STATUS,req.logged_in_id,todays_dt];
						if(req.body.model_name_arabic && req.body.model_name_arabic!='' && req.body.model_name_arabic!='undefined'){
							model_data.model_name_arabic = req.body.model_name_arabic;
						}
						let query = "INSERT INTO `model` SET ?";
						let data = [model_data];
						let result = await model.QueryPostData(query, data, res);
						if (result)
							res.send({
								success: true,
								message: 'Model added successfully',
								message_arabic:'تمت إضافة النموذج بنجاح',
								data: []
							});
						else
							res.send({
								success: false,
								message: 'Model added unsuccessfully',
								message_arabic:'تمت إضافة النموذج دون نجاح',
								data: []
							});
					} else {
						res.send({
							success: false,
							message: 'Model already exists',
							message_arabic:'النموذج موجود بالفعل',
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

	//Model details (JSON FORMAT) not used in this 
	AddManyModelList_not_used: async (req, res) => {
		const validationRule = {
			'category_id': 'required',
			'sub_category_id': 'required',
			'brand_id': 'required',
			'model_name': 'required'
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
					
						var model_data = {};
						//mandatory fields
						// model_data.category_id = cmn_help.strtoarry(req.body.category_id);
						// model_data.sub_category_id = cmn_help.strtoarry(req.body.sub_category_id);

						model_data.category_id = req.body.category_id;
						model_data.sub_category_id = req.body.sub_category_id;
						model_data.brand_id = req.body.brand_id;
						model_data.model_name = cmn_help.strtoarry(req.body.model_name);
						

						//non mandatory fields
						console.log(model_data.model_name);
						if(model_data.model_img && model_data.model_img!='' && model_data.model_img!='undefined'){
							model_data.model_img = cmn_help.strtoarry(req.files.model_img);
						}
						if(req.body.model_name_arabic && req.body.model_name_arabic!='' && req.body.model_name_arabic!='undefined'){
							model_data.model_name_arabic = cmn_help.strtoarry(req.body.model_name_arabic);
							
						}
						if(req.body.model_description && req.body.model_description!='' && req.body.model_description!='undefined'){
							model_data.model_description = cmn_help.strtoarry(req.body.model_description);
							
						}
						// if (req.body.sub_category_year_applies && req.body.sub_category_year_applies != '') {
						// 	sub_category_data.sub_category_year_applies = cmn_help.strtoarry(req.body.sub_category_year_applies);
						// }
											
						//many
						var dublicate=[];
						var dublicate_arabic=[];
						var result=[];
						const resp= await Promise.allSettled(model_data.model_name.map(async (sub_cat,index) => {		
							
							// let check = await model.CheckUniqueWithThreeRef(`model_name`, `model`, model_data.model_name[index], res, '', '', `sub_category_id`, req.body.sub_category_id,`category_id`, req.body.category_id,`model_id`, req.body.model_id);
							
							let check ='';
							if(req.body.model_name_arabic && model_data.model_name_arabic && model_data.model_name_arabic[index] && model_data.model_name_arabic[index]!='' && model_data.model_name_arabic[index]!='undefined'){
								 check = await model.CheckUniqueWithThreeRefWithTwoFields(`model_name`,`model_name_arabic`, `model`, model_data.model_name[index],model_data.model_name_arabic[index], res, '', '', `sub_category_id`, req.body.sub_category_id,`category_id`, req.body.category_id,`model_id`, req.body.model_id);
								
							}
							else{
								check = await model.CheckUniqueWithThreeRef(`model_name`, `model`, model_data.model_name[index], res, '', '', `sub_category_id`, req.body.sub_category_id,`category_id`, req.body.category_id,`model_id`, req.body.model_id);
									
							}	
							if(check)
							{
									let model_total_data = {};
									//mandatory fields
									model_total_data.category_id = model_data.category_id;
									model_total_data.sub_category_id = model_data.sub_category_id;
									model_total_data.brand_id = model_data.brand_id;
									model_total_data.model_name = model_data.model_name[index];
									// model_total_data.category_id = model_data.category_id[index];
									// model_total_data.sub_category_id = model_data.sub_category_id[index];
									
									model_total_data.add_by =req.logged_in_id;
									model_total_data.add_dt = todays_dt;
									model_total_data.status = ACTIVE_STATUS;
									//non mandatory fields

									if(model_data.model_img && model_data.model_img!='' && model_data.model_img!='undefined'){
						
										if (model_data.model_img && model_data.model_img[index] && model_data.model_img[index] != '') {
											var element = model_data.model_img[index];
											var image_name = now.format("YYYYMMDDHHmmss") + element.name;
											element.mv('./public/uploads/model/' + image_name);
											model_total_data.model_img = image_name;
										}
									}	
									if (model_data.model_name_arabic && model_data.model_name_arabic[index] && model_data.model_name_arabic[index] !== '' && model_data.model_name_arabic[index] !== 'undefined') {
										model_total_data.model_name_arabic = model_data.model_name_arabic[index];
									}
									if (model_data.model_description && model_data.model_description[index] && model_data.model_description[index] !== '' && model_data.model_description[index] !== 'undefined') {
										model_total_data.model_description = model_data.model_description[index];
									}
									let query = "INSERT INTO `model` SET ?";
									let data = [model_total_data];
									console.log(query);
									result = await model.QueryPostData(query, data, res);
									
							}
							else
							{
								
								dublicate.push(model_data.model_name[index]);
								if (model_data.model_name_arabic[index] && model_data.model_name_arabic[index] !== '' && model_data.model_name_arabic[index] !== 'undefined') {
									dublicate_arabic.push(model_data.model_name_arabic[index]);
								}
							}
						}))
						// console.log("hello1"+dublicate.length);
						// console.log("hello2"+model_data.model_name.length);
						// console.log("hello3"+dublicate_arabic.length);
						// console.log("hello4"+model_data.model_name_arabic.length);
					if (resp && dublicate.length!=model_data.model_name.length)
					{
						
						var msg='model query ran successfully..!'
						var msgarb="تم تشغيل استعلام النموذج بنجاح"
						if(dublicate.length && dublicate_arabic.length)
						{
							msg+=' and model name in english :'+dublicate+' and model names in arabic:'+dublicate_arabic+' already exist , hence not added';
							msgarb+=' واسم النموذج باللغة الإنجليزية:'+dublicate+ ' وأسماء العارضات بالعربية:'+dublicate_arabic +' موجودة بالفعل ، ومن ثم لم تتم إضافتها'
						}
						else if(dublicate_arabic.length){
							msg+=' and model names in arabic:'+dublicate_arabic+' already exist , hence not added';
							msgarb+=' وأسماء العارضات بالعربية:' +dublicate_arabic+' موجودة بالفعل ، ومن ثم لم تتم إضافتها'
						}
						else if(dublicate.length){
							msg+=' and model name in english :'+dublicate+' already exist , hence not added';
							msgarb+=' واسم النموذج باللغة الإنجليزية:' +dublicate+ 'موجودة بالفعل ، ومن ثم لم تتم إضافتها'
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
					else if(dublicate.length==model_data.model_name.length){
						res.send({
							success: false,
							message: 'Model already exists',
							message_arabic:'النموذج موجود بالفعل',
							data: []
						});
					}
					else
						res.send({
							success: false,
							message: 'Model added unsuccessfully',
							message_arabic:'تمت إضافة النموذج دون نجاح',
							data: []
						});

				} catch (error) {
					console.log(error.message);
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

		//Model details (JSON FORMAT) used in this
	AddManyModelList: async (req, res) => {
		const validationRule = {
			'category_id': 'required',
			'sub_category_id': 'required',
			'brand_id': 'required',
			'model_details': 'required'
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
					
						var model_data = {};
						//mandatory fields
						// model_data.category_id = cmn_help.strtoarry(req.body.category_id);
						// model_data.sub_category_id = cmn_help.strtoarry(req.body.sub_category_id);

						
						var model_details_temp = JSON.parse(req.body.model_details);

						model_data.category_id = req.body.category_id;
						model_data.sub_category_id = req.body.sub_category_id;
						model_data.brand_id = req.body.brand_id;
						model_data.model_name = cmn_help.strtoarry(req.body.model_name);
						model_data.mod_det = JSON.parse(req.body.model_details);;

						
						//non mandatory fields
						/*console.log("hellobye" + model_data.mod_det);
						console.log(typeof model_data.mod_det);
						console.log(model_data.mod_det[0]);
						console.log(model_data.mod_det[0].model_arabicname);*/
						
						for (let i = 0; i < model_details_temp.length; i++) {
							var element = model_details_temp[i];
							console.log("-------------------------------------------")
							console.log("element: ");
							console.log(element);
							console.log(typeof element);

							console.log("model_arabicname: ");
							console.log(element.model_arabicname);
						}
						// //console.log("firsone:")
						//console.log(model_data.mod_det[0]);
						//console.log("firsone"+model_data.mod_det[0].model_arabicname);
						if(model_data.model_img && model_data.model_img!='' && model_data.model_img!='undefined'){
							model_data.model_img = cmn_help.strtoarry(req.files.model_img);
						}
						// if(req.body.model_name_arabic && req.body.model_name_arabic!='' && req.body.model_name_arabic!='undefined'){
						// 	model_data.model_name_arabic = cmn_help.strtoarry(req.body.model_name_arabic);
							
						// }
						// if(req.body.model_description && req.body.model_description!='' && req.body.model_description!='undefined'){
						// 	model_data.model_description = cmn_help.strtoarry(req.body.model_description);
							
						// }
						// if (req.body.sub_category_year_applies && req.body.sub_category_year_applies != '') {
						// 	sub_category_data.sub_category_year_applies = cmn_help.strtoarry(req.body.sub_category_year_applies);
						// }
											
						//many
						var dublicate=[];
						var dublicate_arabic=[];
						var result=[];
						// const resp= await Promise.allSettled(model_data.model_name.map(async (sub_cat,index) => {		
						const resp= await Promise.allSettled(model_data.mod_det.map(async (sub_cat,index) => {		
							// console.log("heading1"+model_data.mod_det[index].model_name);
							// console.log("heading2"+model_data.mod_det[index].model_arabic_name);
							// console.log("heading2"+model_data.mod_det[index].model_description);
							// console.log("heading2"+model_data.mod_det[index].model_description_arabic);
							// let check = await model.CheckUniqueWithThreeRef(`model_name`, `model`, model_data.model_name[index], res, '', '', `sub_category_id`, req.body.sub_category_id,`category_id`, req.body.category_id,`model_id`, req.body.model_id);
							//console.log("bye"+model_data.mod_det[index].model_name);
							let check ='';
							if(model_data.mod_det && model_data.mod_det[index].model_name && model_data.mod_det[index].model_name && model_data.mod_det[index].model_name!='' && model_data.mod_det[index].model_name!='undefined'){
								 check = await model.CheckUniqueWithThreeRefWithTwoFields(`model_name`,`model_name_arabic`, `model`, model_data.mod_det[index].model_name,model_data.mod_det[index].model_name_arabic, res, '', '', `sub_category_id`, req.body.sub_category_id,`category_id`, req.body.category_id,`brand_id`, req.body.brand_id);
								
							}
							else{
								check = await model.CheckUniqueWithThreeRef(`model_name`, `model`, model_data.mod_det[index].model_name, res, '', '', `sub_category_id`, req.body.sub_category_id,`category_id`, req.body.category_id,`brand_id`, req.body.brand_id);
									
							}	
							if(check)
							{
									let model_total_data = {};
									//mandatory fields
									model_total_data.category_id = model_data.category_id;
									model_total_data.sub_category_id = model_data.sub_category_id;
									model_total_data.brand_id = model_data.brand_id;
									model_total_data.model_name = model_data.mod_det[index].model_name;
									// model_total_data.category_id = model_data.category_id[index];
									// model_total_data.sub_category_id = model_data.sub_category_id[index];
									
									model_total_data.add_by =req.logged_in_id;
									model_total_data.add_dt = todays_dt;
									model_total_data.status = ACTIVE_STATUS;
									//non mandatory fields

									if(model_data.model_img && model_data.model_img!='' && model_data.model_img!='undefined'){
						
										if (model_data.model_img && model_data.model_img[index] && model_data.model_img[index] != '') {
											var element = model_data.model_img[index];
											var image_name = now.format("YYYYMMDDHHmmss") + element.name;
											element.mv('./public/uploads/model/' + image_name);
											model_total_data.model_img = image_name;
										}
									}	
									if (model_data.mod_det && model_data.mod_det[index].model_name_arabic && model_data.mod_det[index].model_name_arabic !== '' && model_data.mod_det[index].model_name_arabic !== 'undefined') {
										model_total_data.model_name_arabic = model_data.mod_det[index].model_name_arabic;
									}
									if (model_data.mod_det && model_data.mod_det[index].model_description && model_data.mod_det[index].model_description !== '' && model_data.mod_det[index].model_description !== 'undefined') {
										model_total_data.model_description = model_data.mod_det[index].model_description;
									}
									if (model_data.mod_det && model_data.mod_det[index].model_description_arabic && model_data.mod_det[index].model_description_arabic !== '' && model_data.mod_det[index].model_description_arabic !== 'undefined') {
										model_total_data.model_description_arabic = model_data.mod_det[index].model_description_arabic;
									}
									let query = "INSERT INTO `model` SET ?";
									console.log("yooo"+model_total_data);
									let data = [model_total_data];
									console.log(query);
									result = await model.QueryPostData(query, data, res);
									
							}
							else
							{
								
								dublicate.push(model_data.mod_det[index].model_name);
								if (model_data.mod_det[index].model_name_arabic && model_data.mod_det[index].model_name_arabic !== '' && model_data.mod_det[index].model_name_arabic !== 'undefined') {
									dublicate_arabic.push(model_data.mod_det[index].model_name_arabic);
								}
							}
						}))
						// console.log("hello1"+dublicate.length);
						// console.log("hello2"+model_data.model_name.length);
						// console.log("hello3"+dublicate_arabic.length);
						// console.log("hello4"+model_data.model_name_arabic.length);
					if (resp && dublicate.length!=model_data.model_name.length)
					{
						
						var msg='model query ran successfully..!'
						var msgarb="تم تشغيل استعلام النموذج بنجاح"
						if(dublicate.length && dublicate_arabic.length)
						{
							msg+=' and model name in english :'+dublicate+' and model names in arabic:'+dublicate_arabic+' already exist , hence not added';
							msgarb+=' واسم النموذج باللغة الإنجليزية:'+dublicate+' وأسماء العارضات بالعربية:'+dublicate_arabic+' already exist , hence not added'
						}
						else if(dublicate_arabic.length){
							msg+=' and model names in arabic:'+dublicate_arabic+' already exist , hence not added';
							msgarb+=' وأسماء العارضات بالعربية:'+dublicate_arabic+' موجودة بالفعل ، ومن ثم لم تتم إضافتها'
						}
						else if(dublicate.length){
							msg+=' and model name in english :'+dublicate+' already exist , hence not added';
							msgarb+=' واسم النموذج باللغة الإنجليزية:'+dublicate+' موجودة بالفعل ، ومن ثم لم تتم إضافتها'
						}
						else{
							msg+=' All fields were added successfully';
							msgarb+=' تم إضافة جميع الحقول بنجاح'
						}
						res.send({
							success: true,
							message: msg,
							message_arabic:msgarb,
							data: []
						});
					}
					else if(dublicate.length==model_data.model_name.length){
						res.send({
							success: false,
							message: 'Model already exists',
							message_arabic:'النموذج موجود بالفعل',
							data: []
						});
					}
					else
						res.send({
							success: false,
							message: 'Model added unsuccessfully',
							message_arabic:'تمت إضافة النموذج دون نجاح',
							data: []
						});

				} catch (error) {
					console.log(error.message);
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
			// 'category_id': 'required',
			// 'brand_id' : 'required',
			'model_id': 'required'
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
					let query = "SELECT m.category_id,c.category_name,c.category_name_arabic,m.sub_category_id,s.sub_category_name,s.sub_category_name_arabic,m.brand_id,b.brand_name,b.brand_name_arabic,m.model_id,m.model_name,m.model_name_arabic,m.model_description,m.model_description_arabic FROM model m left join category c on c.category_id=m.category_id left join brand b on b.brand_id=m.brand_id left join sub_category s on s.sub_category_id=m.sub_category_id WHERE model_id = ? AND m.status=?";
					let data = [req.body.model_id, ACTIVE_STATUS];
					let result = await model.QueryListData(query, data, res);
					if (result)
						res.send({
							success: true,
							message: '',
							data: result
						});
					else
						res.send({
							success: false,
							message: '',
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
			'model_id': 'required',
			'model_name': 'required'
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
					// let check = await model.CheckUnique(`model_name`, `model`, req.body.model_name.trim(), res, `model_id`, req.body.model_id);
					let check ='';
							if(req.body.model_name_arabic && req.body.model_name_arabic!='' && req.body.model_name_arabic!='undefined'){
								check = await model.CheckUniqueWithThreeRefWithTwoFields(`model_name`,`model_name_arabic`, `model`, req.body.model_name.trim(),req.body.model_name_arabic.trim(), res,`model_id`,req.body.model_id,`brand_id`, req.body.brand_id, `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);
							}
							else{
								check = await model.CheckUniqueWithThreeRef(`model_name`, `model`, req.body.model_name.trim(), res, `model_id`, req.body.model_id,`brand_id`, req.body.brand_id, `category_id`, req.body.category_id, `sub_category_id`, req.body.sub_category_id);	
							}	
					if (check) {
						var model_data = {};
						
						model_data.model_name = req.body.model_name;
						// model_data.category_id=req.body.category_id;
						// model_data.brand_id=req.body.brand_id
						 model_data.model_description = req.body.model_description;
						//model_data.mdf_by = req.logged_in_id;
						model_data.mdf_dt = todays_dt;
						model_data.status = ACTIVE_STATUS;
						// if (req.files && req.files.model_img && req.files.model_img != '') {
						// 	var element = req.files.model_img;
						// 	var image_name = now.format("YYYYMMDDHHmmss") + element.name;
						// 	element.mv('./public/uploads/model/' + image_name);
						// 	model_data.model_img = image_name;
						// }
						if (req.body.category_id && req.body.category_id !== '' && req.body.category_id !== 'undefined') {
							model_data.category_id = req.body.category_id;
						}
						if (req.body.sub_category_id && req.body.sub_category_id !== '' && req.body.sub_category_id !== 'undefined') {
							model_data.sub_category_id = req.body.sub_category_id;
						}
						if (req.body.brand_id && req.body.brand_id !== '' && req.body.brand_id !== 'undefined') {
							model_data.brand_id = req.body.brand_id;
						}
						if (req.body.model_name_arabic && req.body.model_name_arabic !== '' && req.body.model_name_arabic !== 'undefined') {
							model_data.model_name_arabic = req.body.model_name_arabic;
						}
						// if (req.body.model_description && req.body.model_description!== '' && req.body.model_description !== 'undefined') {
						// 	model_data.model_description = req.body.model_description;
						// }
						if (req.body.model_description_arabic && req.body.model_description_arabic!== '' && req.body.model_description_arabic !== 'undefined') {
							model_data.model_description_arabic = req.body.model_description_arabic;
						}

						let query = "UPDATE `model` SET ? WHERE model_id=? ";
						let data = [model_data, req.body.model_id];
						let result = await model.QueryPostData(query, data, res);
						if (result) {
							res.send({
								success: true,
								message: 'Model updated successfully',
								message_arabic:'تم تحديث النموذج بنجاح',
								data: []
							});
						} else {
							res.send({
								success: false,
								message: 'Model updated unsuccessfully',
								message_arabic:'تم تحديث النموذج دون نجاح',
								data: []
							});
						}
					}
					else {
						res.send({
							success: false,
							message: 'Model already exists',
							message_arabic:'النموذج موجود بالفعل',
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
			'model_id': 'required'
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
					let where_con = 'model_id=? and status=?';
					let where_data = [req.body.model_id, ACTIVE_STATUS]
					let check = await model.CheckForDelete('products', where_con, where_data);
					if (check) {
						let query = "UPDATE `model` SET `status` =?,`mdf_by`=?,`mdf_dt`=? WHERE `model_id` = ?";
						let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.model_id];

						let result = await model.QueryPostData(query, data, res);
						if (result) {

							return res.send({
								success: true,
								message: 'Model deleted successfully',
								message_arabic:'تم حذف النموذج بنجاح',
								data: []
							});
						} else {
							return res.send({
								success: false,
								message: 'Model deleted unsuccesfully',
								message_arabic:'تم حذف النموذج بشكل غير ناجح',
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