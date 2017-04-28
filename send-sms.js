// Twilio Credentials and resturant number

require('dotenv').load();
var accountSid = process.env.PROJECT_ACCOUNT_SID;
var authToken = process.env.PROJECT_AUTH_TOKEN;
var resturantNumber = process.env.RESTURANT_NUMBER;
console.log(accountSid, authToken);

// //require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);



//to use this function require("./send-sms").sendSMS;
//it takes one argument which is the body of the SMS
function sendSMS(smsbody){
  client.messages.create({
    to: resturantNumber,
    from: "+17786519742",
    body: smsbody
  }, function(err, message) {
    console.log(message.sid);
  });
}

//to use this function require("./send-sms").callResturant;
function callResturant() {
  client.calls.create({
    method: 'POST',
    url: "http://eb964e1c.ngrok.io/orders/callcontent",
    to: resturantNumber,
    from: "+17786519742"
  }, function(err, call) {
    process.stdout.write(call.sid);
  });
}
module.exports = {sendSMS, callResturant};