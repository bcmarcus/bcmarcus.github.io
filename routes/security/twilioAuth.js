const getSecret = require('../security/secrets');
const twilio = require('twilio');
const config = require("../../config/config.js");

async function authorizeTwilio (req, res, next) {
  const twilioAuth = await getSecret('twilio');

  const twilioSignature = req.headers['x-twilio-signature'];
  const url = config.prod.app.domains[0] + req.originalUrl;

  await logWarning(twilioAuth, twilioSignature, url, req.body);

  if (!req.body || !twilioAuth || !twilioSignature || !url){
    res.status(401).send('Unauthorized twilio, invalid parameters.');
    return;
  }

  const isValidRequest = twilio.validateRequest(twilioAuth, twilioSignature, url, req.body);
  
  await logWarning(isValidRequest);

  if (!isValidRequest) {
    res.status(401).send('Unauthorized twilio, invalid request.');
    return;
  }

  next();
}

module.exports = authorizeTwilio;