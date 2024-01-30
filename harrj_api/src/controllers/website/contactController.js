
const Logger = require('../../../src/helper/loggerService');
const logger = new Logger('WebContactus');
var model = require('./../../../src/models/model');
var md5 = require('md5');

const moment = require('moment');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;

var validator = require('./../../../src/helper/validate');
const { check, validationResult } = require('express-validator');

module.exports = {

  Contactus: async (req, res) => {
    const validationRule = {
      'name': 'required',
      'email_id': 'required',
      'mobile_no': 'required',
      'message': 'required'
    }
    validator(req.body, validationRule, {}, async (err, status) => {
      console.log(status);
      if (!status) {
        res.send({
          success: false,
          message: 'Validation failed',
          message_arabic:"تم حذف التعليق غير ناجح",
          data: err
        });
      }
      else {
        try {
          let now = moment();
          let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
          // let check1 = await model.CheckUnique(`email_id`, `user`, req.body.email_id.trim(), res);
          // let check2 = await model.CheckUnique(`mobile_no`, `user`, req.body.mobile_no.trim(), res);
         
            let client_data = {};

            client_data.name = req.body.name;
            client_data.email_id = req.body.email_id;
            client_data.mobile_no = req.body.mobile_no;
            client_data.mobile_no = req.body.message;
            client_data.add_dt = todays_dt;
            client_data.status = ACTIVE_STATUS;
            if(req.body.customer_id && typeof(req.body.customer_id)!=='undefined' && req.body.customer_id!='')
				    {
              client_data.add_by = req.body.customer_id;
            }

            let query = "INSERT INTO `contact` SET ? ";
            let data = [client_data];
            try {
              let result1 = await model.QueryPostDataNew(query, data, res);
              if (result1 && typeof result1 !== "undefined" && result1.affectedRows) {
                res.send({
                  success: true,
                  message: 'Contact form submitted successfully..!',
                  message_arabic:"تم إرسال نموذج الاتصال بنجاح",
                  data: []
                });
              }
              else {
                res.send({
                  success: false,
                  message: 'Contact form not submitted ..!',
                  message_arabic:"لم يتم تقديم نموذج الاتصال",
                  data: []
                });

              }
            }
            catch (error) {
              // console.log("Shree Err Msg....................");
              res.send({
                success: false,
                message: 'Something Went Wrong..!',
                message_arabic:"هناك خطأ ما",
                data: error
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

  
}