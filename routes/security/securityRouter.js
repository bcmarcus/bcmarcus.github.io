// twilioRouter.js
const express = require ('express');
const router = express.Router ();
const { authorizeUserApplication } = require ('../security/userAuth');
const { router: answerCallRouter } = require ('./call/answerCall');

router.use ('/oauth', authorizeUserApplication, answerCallRouter);

module.exports = router;
