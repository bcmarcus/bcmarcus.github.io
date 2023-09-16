// twilioRouter.js
const express = require ('express');
const router = express.Router ();
const authorizeUser = require ('../security/userAuth');
const authorizeTwilio = require ('../security/twilioAuth');
const { router: answerCallRouter } = require ('./call/answerCall');

router.use ('/answerCall', authorizeTwilio, authorizeUser, answerCallRouter);

module.exports = router;
