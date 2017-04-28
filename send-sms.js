// Twilio Credentials
var accountSid = 'ACe9eca1e952d162dbb2da90738c4e2490';
var authToken = 'e9f218c1c679644751ebf96ad16caa04';
 
// //require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);
//  var mesg = "HEllp" ;
// client.messages.create({
//     to: "+17782324505",
//     from: "+17786519742",
//     body: mesg,
// }, function(err, message) {
//     console.log(message.sid);
// });

client.calls.create({
  method: 'GET',
  url: "http://397cb175.ngrok.io/order2.xml",
  to: "+17782324505",
  from: "+17786519742"
}, function(err, call) {
  process.stdout.write(call.sid);
  console.log("made the call here");
});