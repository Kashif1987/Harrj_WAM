const firebase = require("firebase-admin")
const key=require('./harrj-6bc98-firebase-adminsdk-vq780-b51d710abd.json')
const Admin = firebase.initializeApp({ credential: firebase.credential.cert(key) },"harrjapp")
// console.log(Admin);

module.exports=Admin