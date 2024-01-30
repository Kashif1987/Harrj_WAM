const cron=require("node-cron")
const modle=require("../../models/model")
const ACTIVE_STATUS=process.env.ACTIVE_STATUS
const moment = require('moment');
const firebase=require('../../helper/firebaseapp')
module.exports={
    Cron:async(req,res)=>{
        cron.schedule("0 */1 * * * *",async()=>{
            // const moment = require('moment');
            console.log("hello");
            console.log(moment().utc());
            let start_time=moment().utc().format("hh:mm")
            console.log(start_time);
            let product_list= await modle.QueryListData("SELECT * FROM `products` WHERE  start_time=? and status=? AND meeting_status=? AND DAY(start_date_time)=? AND MONTH(start_date_time)=? and YEAR(start_date_time)=?",[moment().utc().add("30","minutes").format("hh:mm"),ACTIVE_STATUS,0,moment().format("DD"),moment().format("MM"),moment().format("YYYY")],res)
            console.log(product_list);
            for (let idx = 0; idx < product_list.length; idx++) {
                const element = product_list[idx];
                let user= await modle.QueryListData("SELECT firebase_token FROM `user` WHERE status=? AND id=? and firebase_token is NOT null",[ACTIVE_STATUS,element.add_by],res)
               let temp=[]
               if (user.length>0) {
                temp.push(user[0].firebase_token)
               }
                let message = {
                    "notification": {
                        //   title: 'New Notification about lead',
                        //   body: 'Lead has been generated against '+req.body.src+"",
                    },
                    "data": {
                        "title": "You have a Schedule Auction in 30 minutes ",
                        "title_arabic": "لديك جدول المزاد في 30 دقيقة",
                        "body": "JOIN NOW",
                        "body_arabic": "نضم الان",
                        "product_name": element.title.toString(),
                        "product_id": element.product_id.toString() ,
                        "add_by": element.add_by.toString()
                    },
                    "tokens": temp,
                    "priority": "high",
                    "content_available": true,
                    "apns": {
                        "payload": {
                          "aps": {
                            "contentAvailable": true,
                            "badge" : 0
                          },
                        },
                      },

                }

                let send = await firebase.messaging().sendMulticast(message)
                console.log(send);



            }
                
            
        })
    }
}