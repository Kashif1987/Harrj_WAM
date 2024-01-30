const sql = require('../../config/conn');
const Logger = require('../../helper/loggerService');
const logger = new Logger('comment');
var model = require('../../models/model');
var validator = require('../../helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;

const moment = require('moment');
const { Console } = require('winston/lib/winston/transports');
module.exports = {
	// List: async (req, res) => {
	// 	try {
	// 		//Filter by number of records
			
	// 		let query = "SELECT c.comment_id,c.user_id,u.name,u.email_id,u.mobile_no,c.product_id,(SELECT a.bid_id from bids a where a.status=1 and a.bidder_id=c.user_id AND a.product_id=c.product_id ORDER BY a.bid_id DESC LIMIT 1) as bid_id,(SELECT Max(a.bid_amount) from bids a where a.status=1 and a.bidder_id=c.user_id AND a.product_id=c.product_id ) as bid_amount,c.comment, c.status,c.add_by,c.mdf_by, DATE_FORMAT(c.add_dt,'%d-%m-%Y') as add_dt, c.mdf_dt FROM comment c LEFT JOIN user u ON u.id=c.user_id WHERE c.status=?";
	// 		let data = [ACTIVE_STATUS];			
	// 		// if (req.query.page_record && req.query.page_record > 0 ) {
	// 		// 	console.log("abcd");
	// 		// 	query += ' LIMIT ?';
	// 		// 	data.push(eval(req.query.page_record));
	// 		// }
	// 		//Filter by product IDs
	// 		if (req.query.product_id && req.query.product_id != '') {
	// 			let proid_arr= req.query.product_id.split(',');
	// 			query += " and c.product_id in (?)";
	// 			data.push(proid_arr);
	// 		}
			
	// 		if (req.query.sort_by && req.query.sort_by != '') {
	// 			if (req.query.sort_by == 'low_to_high') {
	// 				query += " ORDER BY b.bid_amount DESC";
	// 			}
	// 			else if (req.query.sort_by == 'high_to_low') {
	// 				query += " ORDER BY b.bid_amount";
	// 			}
	// 			if (req.query.page_records && req.query.page_records > 0) {
	// 				query += ' LIMIT ?';
	// 				data.push(eval(req.query.page_records));
	// 			}

	// 		}
	// 		else {
	// 			if (req.query.page_records && req.query.page_records > 0) {
	// 				query += ' ORDER BY c.comment_id DESC LIMIT ?';
	// 				data.push(eval(req.query.page_records));
	// 			}
	// 			else {
	// 				query += ' ORDER BY c.comment_id DESC';
	// 			}
	// 		}
	// 		let result = await model.QueryListData(query, data, res);	
			
	// 		if (result) {
	// 			// console.log(sql.updates)
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
	List: async (req, res) => {
		try {
			//Filter by number of records
			
			let query = "SELECT c.comment_id,c.user_id,u.name,u.email_id,u.mobile_no,c.product_id,c.comment,c.bid_id, c.status,c.add_by,c.mdf_by, DATE_FORMAT(c.add_dt,'%d-%m-%Y') as add_dt, c.mdf_dt FROM comment c LEFT JOIN user u ON u.id=c.user_id WHERE c.status=?";
			let data = [ACTIVE_STATUS];			
			// if (req.query.page_record && req.query.page_record > 0 ) {
			// 	console.log("abcd");
			// 	query += ' LIMIT ?';
			// 	data.push(eval(req.query.page_record));
			// }
			//Filter by product IDs
			if (req.query.product_id && req.query.product_id != '') {
				let proid_arr= req.query.product_id.split(',');
				query += " and c.product_id in (?)";
				data.push(proid_arr);
			}
			
			if (req.query.sort_by && req.query.sort_by != '') {
				if (req.query.sort_by == 'low_to_high') {
					query += " ORDER BY b.bid_amount DESC";
				}
				else if (req.query.sort_by == 'high_to_low') {
					query += " ORDER BY b.bid_amount";
				}
				if (req.query.page_records && req.query.page_records > 0) {
					query += ' LIMIT ?';
					data.push(eval(req.query.page_records));
				}

			}
			else {
				if (req.query.page_records && req.query.page_records > 0) {
					query += ' ORDER BY c.comment_id DESC LIMIT ?';
					data.push(eval(req.query.page_records));
				}
				else {
					query += ' ORDER BY c.comment_id DESC';
				}
			}
			let result = await model.QueryListData(query, data, res);	
			for (let index = 0; index < result.length; index++) {
				var querybid="select bid_id ,bid_amount from bids where status=? and bid_id=?"
				var biddata=[ACTIVE_STATUS, result[index].bid_id]
				var bidresult=await model.QueryListData(querybid, biddata, res)
				result[index].bid_id=bidresult[0].bid_id
				result[index].bid_amount=bidresult[0].bid_amount
				
			}
			
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
					message_arabic:"ناجح",
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
			'user_id': 'required',
			'product_id': 'required',
			'comment': 'required',
			"bid_id":"required",
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
								
					// if (check) {
						var comment_data = {};
						comment_data.user_id = req.body.user_id;
						comment_data.product_id = req.body.product_id;
						comment_data.comment = req.body.comment;
						comment_data.add_by = req.logged_in_id;
						comment_data.add_dt = todays_dt;
						comment_data.status = ACTIVE_STATUS;
						if(req.logged_in_id && req.logged_in_id!='' && req.logged_in_id!='undefined'){
							comment_data.add_by=req.logged_in_id;
						}
						else{
							comment_data.add_by = req.body.user_id;
						}
						if(req.body.bid_id && req.body.bid_id!='' && req.body.bid_id!='undefined'){
							comment_data.bid_id=req.body.bid_id;
						}
						else{
							try {
								// let query1 = "SELECT CASE WHEN bid_id IS NULL THEN NULL ELSE bid_id END AS bid_id from bids where product_id= ? and bidder_id = ?";
								let query1 = "SELECT EXISTS(SELECT bid_id from bids where product_id= ? and bidder_id = ? and status=?)";
								
								let data1 = [comment_data.product_id,comment_data.user_id,ACTIVE_STATUS];
								let result1 = await model.QueryPostData(query1, data1, res);
								// if (result1[0]['bid_id'] && result1[0]['bid_id']!='' && result1[0]['bid_id']!='undefined')
								// if (result1[0].bid_id && result1[0].bid_id!='' && result1[0].bid_id!='undefined')
								
								if (result1 && result1!='' && result1!='undefined')
								{
									comment_data.bid_id = result1[0]['bid_id'];
									
								}
								else
								{
									comment_data.bid_id = NULL;
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
						// let query ="INSERT INTO `category`(`category_name`,`status`,`add_by`,`add_dt`) VALUES (?,?,?,?)";
						// let data=[req.body.category_name.trim(),ACTIVE_STATUS,req.logged_in_id,todays_dt];
						let query = "INSERT INTO `comment` SET ?";
						let data = [comment_data];
						let result = await model.QueryPostData(query, data, res);
						if (result)
							res.send({
								success: true,
								message: 'comment Added successfully..!',
								message_arabic:"تمت إضافة التعليق بنجاح",
								data: []
							});
						else
							res.send({
								success: false,
								message: 'comment Added Unsuccessfull..!',
								message_arabic:"تمت إضافة التعليق غير ناجح",
								data: []
							});
					// } else {
					// 	res.send({
					// 		success: false,
					// 		message: 'Category name in eng and arabic must be unique',
					// 		data: []
					// 	});
					// }
				} catch (error) {
					console.log(error);
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
			'comment_id': 'required'
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
					let query = "SELECT * FROM `comment` WHERE comment_id = ? AND status=?";
					let data = [req.body.comment_id, ACTIVE_STATUS];
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
			'comment_id': 'required'
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
					
					
					var comment_data = {};
					if(req.body.user_id && req.body.user_id!='' && req.body.user_id!='undefined'){
						comment_data.user_id=req.body.user_id;
					}
					if(req.body.product_id && req.body.product_id!='' && req.body.product_id!='undefined'){
						comment_data.product_id=req.body.product_id;
					}
					if(req.body.comment && req.body.comment!='' && req.body.comment!='undefined'){
						comment_data.comment=req.body.comment;
					}
					if(req.body.bid_id && req.body.bid_id!='' && req.body.bid_id!='undefined'){
						comment_data.bid_id=req.body.bid_id;
					}
					comment_data.mdf_dt = todays_dt;

					if(req.logged_in_id && req.logged_in_id!='' && req.logged_in_id!='undefined'){
						comment_data.mdf_by=req.logged_in_id;
					}
					else{
						comment_data.mdf_by = req.body.user_id;
					}
					
						let query = "UPDATE `comment` SET ? WHERE comment_id=? ";
						let data = [comment_data, req.body.comment_id];
						let result = await model.QueryPostData(query, data, res);
						if (result) {
							res.send({
								success: true,
								message: 'comment updated successfully..!',
								message_arabic:"تم تحديث التعليق بنجاح",
								data: []
							});
						} else {
							res.send({
								success: false,
								message: 'comment updated Unsuccessfull..!',
								message_arabic:"تم تحديث التعليق غير ناجح",
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
			'comment_id': 'required'
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
					let where_con = 'comment_id=? and status=?';
					let where_data = [req.body.comment, ACTIVE_STATUS]
					
						let query = "UPDATE `comment` SET `status` =?,`mdf_by`=?,`mdf_dt`=? WHERE `comment_id` = ?";
						let data = [IN_ACTIVE_STATUS, req.logged_in_id, todays_dt, req.body.comment_id];

						let result = await model.QueryPostData(query, data, res);
						if (result) {

							return res.send({
								success: true,
								message: 'comment Deleted successfully..!',
								message_arabic:"تم حذف التعليق بنجاح",
								data: []
							});
						} else {
							return res.send({
								success: false,
								message: 'comment Deleted Unsuccessfull..!',
								message_arabic:"تم حذف التعليق غير ناجحs",
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