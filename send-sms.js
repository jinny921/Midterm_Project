// Twilio Credentials and resturant number

require('dotenv').load();
const accountSid = process.env.PROJECT_ACCOUNT_SID;
const authToken = process.env.PROJECT_AUTH_TOKEN;
const resturantNumber = process.env.RESTURANT_NUMBER;
const webNumber = process.env.TW_NUMBER;

const url = process.env.URL;
console.log(accountSid, authToken);

// //require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);



// to use this function require('./send-sms').sendSMS;
// it takes one argument which is the body of the SMS
function sendSMS(smsbody) {
  client.messages.create({
    to: resturantNumber,
    from: webNumber,
    body: smsbody,
  }, (err, message) => {
    console.log(message.sid);
  });
}

//to use this function require("./send-sms").callResturant;
function callResturant(name, phoneNum) {
  client.calls.create({
    method: 'POST',
    url: `${url}/orders/callcontent/${name}/${phoneNum}`,
    to: resturantNumber,
    from: webNumber,
  }, (err, call) => {
    process.stdout.write(call.sid);
  });
}
module.exports = { sendSMS, callResturant };