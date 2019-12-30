require("dotenv").config()
var cron = require('node-cron');
let tools = require("./tools.js")



tools.getBalance()
    .then(function(resp){
        console.log("resp: ",resp)
    })

// let debug = function(){
//     let time = new Date()
//     console.log("current time: ",time)
//     console.log("current time: ",time.toLocaleString())
// }
// setInterval(debug,1000)
//
// // weekday run at noon
// cron.schedule('0 12 * * 1-5', () => {
//     run_audit()
//     console.log("Winning! ****************** ")
//     console.log('running at a time every day');
// });
//
// //cron weekday at 5 pm mountain time
// cron.schedule('0 16 * * 1-5', () => {
//     run_audit()
//     console.log("Winning! ****************** ")
//     console.log('running at a time every day');
// });