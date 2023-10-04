// answerCall.js
const express = require ('express');
const router = express.Router ();

/**
  * Handles the POST request to the '/' route.
  * Connects the call to a stream and sends a TwiML response.
  * @route POST /
  * @param {Request} req - Express.js request.
  * @param {Response} res - Express.js response.
  */
router.post ('/', (req, res) => {
  res.set ('Content-Type', 'text/xml');
  res.send (twiml.toString ());
  // after this, the flow transitions to the websocket server. See above
});


module.exports = {
  router,
};
