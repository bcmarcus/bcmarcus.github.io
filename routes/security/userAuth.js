const VoiceResponse = require('twilio').twiml.VoiceResponse;

function authorizeUser(req, res, next) {
  const incomingNumber = req.body.From.trim();
  const authorizedNumbers = ["+14256145153"];

  if (!authorizedNumbers.includes(incomingNumber)) {
    const twiml = new VoiceResponse();
    twiml.say("Unauthorized Number Detected. Goodbye.");
    twiml.hangup(); // End the call
    res.set('Content-Type', 'text/xml');
    res.send(twiml.toString());
  } else {
    next(); // only call next if the number is authorized
  }
}

module.exports = authorizeUser; // export this middleware function
