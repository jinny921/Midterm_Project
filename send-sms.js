// Twilio Credentials and resturant number
require('dotenv').load();
const accountSid = process.env.PROJECT_ACCOUNT_SID;
const authToken = process.env.PROJECT_AUTH_TOKEN;
const resturantNumber = process.env.RESTURANT_NUMBER;
const webNumber = process.env.TW_NUMBER;

const url = process.env.URL;
console.log(accountSid, authToken);

const client = require('twilio')(accountSid, authToken);

function sendSMS(smsbody) {
  client.messages.create({
    to: resturantNumber,
    from: webNumber,
    body: smsbody,
  }, (err, message) => {
    console.log(message.sid);
  });
}

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