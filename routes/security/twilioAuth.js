const twilio = require('twilio');
const config = require("../../config/config.js");

async function authorizeTwilio (req, res, next) {
  const twilioAuth = global.twilioAuth;

  const twilioSignature = req.headers['x-twilio-signature'];
  const url = global.domain + req.originalUrl;

  if (!req.body || !twilioAuth || !twilioSignature || !url){
    res.status(401).send('Unauthorized twilio, invalid parameters.');
    return;
  }

  const isValidRequest = twilio.validateRequest(twilioAuth, twilioSignature, url, req.body);
  
  if (!isValidRequest) {
    res.status(401).send('Unauthorized twilio, invalid request.');
    return;
  }

  next();
}

module.exports = authorizeTwilio;