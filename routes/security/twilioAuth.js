const getSecret = require('../security/secrets');
const twilio = require('twilio');

async function authorizeTwilio (req, res, next) {
  const twilioAuth = await getSecret('twilio');

  const twilioSignature = req.headers['x-twilio-signature'];
  const url = 'https://' + req.hostname + req.originalUrl;

  if (!req.body || !twilioAuth || !twilioSignature || !url){
    res.status(401).send('Unauthorized');
    return;
  }

  const isValidRequest = twilio.validateRequest(twilioAuth, twilioSignature, url, req.body);

  if (!isValidRequest) {
    res.status(401).send('Unauthorized');
    return;
  }

  next();
}

module.exports = authorizeTwilio;