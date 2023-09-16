const twilio = require ('twilio');
const { logDev } = require ('../utils/logging.js');

/**
  * Function to authorize requests coming from Twilio.
  * This function receives the Express.js request, response, and next middleware function.
  * It checks if all necessary parameters are present in the request.
  * If the parameters are valid, it validates the request using Twilio validation.
  * If the request is valid, it passes control to the next middleware,
  * otherwise it sends a 401 Unauthorized response.
  * Logging happens in case of invalid parameters or requests.
  * @async
  * @function authorizeTwilio
  * @param {Object} req - Express.js request object.
  * @param {Object} res - Express.js response object.
  * @param {Function} next - Express.js next middleware function.
  * @throws {Error} If any required parameter are missing, or the request is invalid.
  */
async function authorizeTwilio (req, res, next) {
  const twilioAuth = process.env.twilioAuth;

  const twilioSignature = req.headers['x-twilio-signature'];
  const url = global.domain + req.originalUrl;

  if (!req.body || !twilioAuth || !twilioSignature || !url) {
    logDev ('Unauthorized twilio, invalid parameters.');
    res.status (401).send ('Unauthorized twilio, invalid parameters.');
    return;
  }

  const isValidRequest = twilio.validateRequest (twilioAuth, twilioSignature, url, req.body);

  if (!isValidRequest) {
    logDev ('Unauthorized twilio, invalid request.');
    res.status (401).send ('Unauthorized twilio, invalid request.');
    return;
  }

  next ();
}

module.exports = authorizeTwilio;
