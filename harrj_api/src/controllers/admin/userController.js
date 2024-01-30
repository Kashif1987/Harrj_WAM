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
			let query = "SELECT * FROM user WHERE status=? ";
			let data = [ACTIVE_STATUS];

			if (req.query.role && req.query.role!='' && req.query.role=='admin') {
				query += " and role=?";
				data.push(req.query.role);
			}
			else {
				query += " and role='customer'";
			}
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

	}
}