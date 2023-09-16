const { logDev } = require ('../utils/logging');

const VoiceResponse = require ('twilio').twiml.VoiceResponse;

/**
  * Middleware function to authorize a user based on their phone number.
  * If the incoming number is not authorized, a voice response is sent and the call is ended.
  * If the number is authorized, the next middleware function is called.
  * @function authorizeUser
  * @param {Object} req - The request object.
  * @param {Object} res - The response object.
  * @param {function} next - The next middleware function.
  */
function authorizeUser (req, res, next) {
  const incomingNumber = req.body.From.trim ();
  const authorizedNumbers = ['+14256145153'];

  // console.log (res);
  const isIdentityKnown = shaken (req);
  logDev (`isIdentityKnown=${isIdentityKnown}`);
  // if (!isIdentityKnown) {
  //   res.status(401).send('Number could not be confirmed secure, invalid request.');
  //   return;
  // }

  if (!authorizedNumbers.includes (incomingNumber)) {
    const twiml = new VoiceResponse ();
    twiml.say ('Unauthorized Number Detected. Goodbye.');
    twiml.hangup (); // End the call
    res.set ('Content-Type', 'text/xml');
    res.send (twiml.toString ());
    return;
  }

  next (); // only call next if the number is authorized
}

/**
  * Function to check the StirVerstat parameter from the request.
  * Logs the StirVerstat value and returns a boolean based on its value.
  * @function shaken
  * @param {Object} req - The request object.
  * @return {boolean} - Returns true if StirVerstat is 'A', false otherwise.
  */
function shaken (req) {
  // Retrieve the StirVerstat parameter from the request
  const stirVerstat = req.body.StirVerstat;

  console.log (`StirVerstat: ${stirVerstat}`);

  // Check if the StirVerstat parameter is present
  if (!stirVerstat) {
    console.log ('Caller identity could not be determined.');
    return false;
  }

  // Check the attestation level
  switch (stirVerstat) {
    case 'A':
      console.log ('Caller is known and has the right to use the phone number as the caller ID.');
      break;
    case 'B':
      console.log ('The customer is known, it is unknown if they have the right to use the caller ID being used.');
      break;
    case 'C':
      console.log ('It doesn\'t meet the requirements of A or B including international calls.');
      break;
    default:
      console.log ('Invalid StirVerstat parameter.');
      return false;
  }

  // If the caller's identity is known for certain, proceed to the next middleware
  return stirVerstat === 'A';
}

module.exports = authorizeUser; // export this middleware function
