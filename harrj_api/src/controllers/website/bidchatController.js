const sql = require('../../config/conn');
const Logger = require('../../helper/loggerService');
const logger = new Logger('bid_chat');
var model = require('../../models/model');
var validator = require('../../helper/validate');
const { check, validationResult, body } = require('express-validator');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;
const BIDDER_ROLE = process.env.BIDDER_ROLE;

const moment = require('moment');

module.exports={
Add : async(req ,res)=>{
    const validationRule={
        zoomchat:'required'
    }
    validator(req.body,validationRule,{},async (error,status)=>{
        if(!status){
            res.send({
                success:false,
                message:"validation error",
                message_arabic:"خطئ في التحقق",
                error:error
            })
        }
        else{
            try {
                let arry=req.body.zoomchat.data;
                for (let index = 0; index < arry.length; index++) {
                const chatdata={}
                chatdata.meeting_id=req.body.zoomchat.meeting_id
                 chatdata.user_mobile_no= arry[index].senderUser.userName;
                 chatdata.chat_text= arry[index].content;
                 chatdata.message_date_time= moment(arry[index].timestamp).format('YYYY-MM-DD HH:mm:ss');
                 chatdata.status=ACTIVE_STATUS
                 console.log('chatdata',chatdata);
                //  console.log(arry[index].senderUser.userName,'mobile_no');
                //  console.log(moment(arry[index].timestamp).format('MM-DD-YYYY'),'timestamp');
                let query="insert into bid_chat set ?"
                let data=[chatdata]
                let result = await model.QueryPostData(query,data,res)
                if(result){
                    res.send({
                        success:true,
                        message:'chat saved successfully.....',
                        message_arabic:"تم حفظ الدردشة بنجاح",
                        data:result
                    })

                }
                else{
                    res.send({
                        success:false,
                        message:"can't save chat successfully.....",
                        message_arabic:"لا يمكن حفظ الدردشة بنجاح",
                        error:result
                    })
                }
                
                }
            } catch (error) {
                res.send({
                    success:false,
                    message:'something went wrong..',
                    message_arabic:"هناك خطأ ما",
                    error:error
                })
                
            }
            
        }
    })
}
}