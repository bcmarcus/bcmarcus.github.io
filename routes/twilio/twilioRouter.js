// twilioRouter.js
const express = require ('express');
const router = express.Router ();
const { authorizeUserCall } = require ('../security/userAuth');
const authorizeTwilio = require ('../security/twilioAuth');
const { router: answerCallRouter } = require ('./call/answerCall');

router.use ('/answerCall', authorizeTwilio, authorizeUserCall, answerCallRouter);

module.exports = router;
