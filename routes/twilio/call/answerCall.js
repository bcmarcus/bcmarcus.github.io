// answerCall.js
const express = require ('express');
const router = express.Router ();
const VoiceResponse = require ('twilio').twiml.VoiceResponse;


/**
  * Handles the POST request to the '/' route.
  * Connects the call to a stream and sends a TwiML response.
  * @route POST /
  * @param {Request} req - Express.js request.
  * @param {Response} res - Express.js response.
  */
router.post ('/', (req, res) => {
  const twiml = new VoiceResponse ();
  const connect = twiml.connect ();
  connect.stream ({ url: `wss://${req.headers.host}/call` });
  res.set ('Content-Type', 'text/xml');
  res.send (twiml.toString ());
  // after this, the flow transitions to the websocket server. See above
});


module.exports = {
  router,
};
