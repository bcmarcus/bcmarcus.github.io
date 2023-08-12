const twilio = require('twilio');

function createTwilioClient() {
  const twilioAuth = global.twilioAuth;
  const twilioSID = global.twilioSID;

  const client = twilio(twilioSID, twilioAuth);
  return client;
}

module.exports = createTwilioClient;