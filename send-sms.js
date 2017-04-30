// Twilio Credentials and resturant number

require('dotenv').load();
const accountSid = process.env.PROJECT_ACCOUNT_SID;
const authToken = process.env.PROJECT_AUTH_TOKEN;
const resturantNumber = process.env.RESTURANT_NUMBER;
console.log(accountSid, authToken);

// //require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);



// to use this function require('./send-sms').sendSMS;
// it takes one argument which is the body of the SMS
function sendSMS(smsbody) {
  client.messages.create({
    to: resturantNumber,
    from: '+17786519742',
    body: smsbody,
  }, (err, message) => {
    console.log(message.sid);
  });
}

// to use this function require('./send-sms').callResturant;
function callResturant() {
  client.calls.create({
    method: 'POST',
    url: 'http://7e26570e.ngrok.io/orders/callcontent',
    to: resturantNumber,
    from: '+17786519742',
  }, (err, call) => {
    process.stdout.write(call.sid);
  });
}
module.exports = { sendSMS, callResturant };
