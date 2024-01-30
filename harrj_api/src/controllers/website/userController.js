const sql = require('../../config/conn');
const Logger = require('../../helper/loggerService');
const logger = new Logger('user');
var model = require('../../models/model');
var validator = require('../../helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;
const bannerUploadLink = process.env.HOST + process.env.PORT + '/uploads/banner/';

const moment = require('moment');

module.exports = {
	List: async (req, res) => {
		try {
			let query = "SELECT * FROM user WHERE status=?";
			let data = [ACTIVE_STATUS];

			if (req.query.role && req.query.role!='' && req.query.role=='admin') {
				query += " and role=?";
				data.push(req.query.role);
			}
			else {
				query += " and role='customer'";
			}
			// if (req.query.last_id && req.query.last_id > 0) {
			// 	query += " and banner_id<?";
			// 	data.push(eval(req.query.last_id));
			// }
			// if (req.query.page_name && req.query.page_name !='') {
			// 	query += " and page_name like ?";
			// 	data.push("%"+req.query.page_name+"%");
			// }
			// if (req.query.page_records && req.query.page_records > 0) {
			// 	query += ' ORDER BY banner_id DESC LIMIT ?';
			// 	data.push(eval(req.query.page_records));
			// }
			// else {
			// 	query += ' ORDER BY banner_id DESC';
			// }
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
	Update:async(req,res)=>{
		const validationRule={
		  id:"required"
		}
		validator(req.body, validationRule,{}, async(errr,status)=>{
		  if (!status) {
			res.send({
			  success:false,
			  message:"validation error..",
			  message_arabic:"خطئ في التحقق",
			  data:errr
			})
		  }
		  else{
			try {
			  let handleupdate={}
			if (req.body.name && req.body.name!=="" && req.body.name!=="undefined") {
			  handleupdate.name=req.body.name
			}
			if (req.body.email_id && req.body.email_id!=="" && req.body.email_id!=="undefined") {
			  handleupdate.email_id=req.body.email_id
			}
			if (req.body.mobile_no && req.body.mobile_no!=="" && req.body.mobile_no!=="undefined") {
			  handleupdate.mobile_no=req.body.mobile_no
			}
			let query="update user set ? where id=? and status=?"
			let data=[handleupdate,req.body.id,ACTIVE_STATUS]
			let result= await model.QueryPostData(query, data, res)
			if (result.affectedRows>0) {
			  res.send({
				success:true,
				message:"User updated successfully",
				message_arabic:"تم تحديث المستخدم بنجاح",
				data:result
			  })
			}
			else{
			  res.send({
				success:false,
				message:"User not updated successfully",
				message_arabic:"لم يتم تحديث المستخدم بنجاح",
				data:result
			  })
			}
	
			} catch (error) {
			  res.send({
				success:false,
				message:"something went wrong..",
				message_arabic:"هناك خطأ ما",
				data:error.message
			  })
			}
		  }
		})
	  }
}