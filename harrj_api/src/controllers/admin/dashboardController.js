const sql = require('./../../../src/config/conn');
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('category');
var model = require('./../../../src/models/model');
var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;


const moment = require('moment');
var dt_tim = moment.utc().format();
var todays_dt = moment.utc(dt_tim).local().add(5, 'hours').add(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");



module.exports = {
	Dashboardcount: async (req, res) => {
		try {

			let result = {};
			let query = "SELECT COUNT(category_id) as category_count FROM category WHERE status=? ";
			let data = [ACTIVE_STATUS];
			let cat_res = await model.QueryListData(query, data, res);

			query = "SELECT COUNT(sub_category_id) as sub_category_count FROM sub_category WHERE status=? ";
			data = [ACTIVE_STATUS];
			let sub_cat_res = await model.QueryListData(query, data, res);

			query = "SELECT COUNT(client_id) as client_count FROM client WHERE status=?";
			data = [ACTIVE_STATUS];
			let client_res = await model.QueryListData(query, data, res);

			query = "SELECT COUNT(user_id) as user_count FROM user WHERE status=?";
			data = [ACTIVE_STATUS];
			let user_res = await model.QueryListData(query, data, res);

			query = "SELECT COUNT(product_id) as product_count FROM products WHERE status=?";
			data = [ACTIVE_STATUS];
			let product_res = await model.QueryListData(query, data, res);

			query = "SELECT COUNT(product_id) as online_auction_count FROM products WHERE status=? and auction_type=?";
			data = [ACTIVE_STATUS, 'online'];
			let online_auction_res = await model.QueryListData(query, data, res);

			query = "SELECT COUNT(product_id) as offline_auction_count FROM products WHERE status=? and auction_type=?";
			data = [ACTIVE_STATUS, 'offline'];
			let offline_auction_res = await model.QueryListData(query, data, res);


			result['category_count'] = 0;
			result['sub_category_count'] = 0;
			result['client_count'] = 0;
			result['user_count'] = 0;
			result['product_count'] = 0;
			result['online_auction_count'] = 0;
			result['offline_auction_count'] = 0;


			if (cat_res && cat_res.length > 0) {
				result['category_count'] = cat_res[0]['category_count'];
			}
			if (sub_cat_res && sub_cat_res.length > 0) {
				result['sub_category_count'] = sub_cat_res[0]['sub_category_count'];
			}
			if (client_res && client_res.length > 0) {
				result['client_count'] = client_res[0]['client_count'];
			}
			if (user_res && user_res.length > 0) {
				result['user_count'] = user_res[0]['user_count'];
			}
			if (product_res && product_res.length > 0) {
				result['product_count'] = product_res[0]['product_count'];
			}
			if (online_auction_res && online_auction_res.length > 0) {
				result['online_auction_count'] = online_auction_res[0]['online_auction_count'];
			}
			if (offline_auction_res && offline_auction_res.length > 0) {
				result['offline_auction_count'] = offline_auction_res[0]['offline_auction_count'];
			}
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
					message_arabic:'فشل',
					data: []
				});
		} catch (error) {
			// console.log(e.message);
			res.send({
				success: false,
				message: 'Something Went Wrong...',
				message_arabic:'هناك خطأ ما',
				data: error.message
			});
		}
	},

}