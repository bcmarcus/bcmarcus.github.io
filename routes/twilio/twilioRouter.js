//twilioRouter.js
const express = require('express');
const router = express.Router();
const authorizeUser = require('../security/userAuth');
const authorizeTwilio = require('../security/twilioAuth');
const answerCall = require('./routes/answerCall');
const callLoop = require('./routes/callLoop');

router.use('/answerCall', authorizeTwilio, authorizeUser, answerCall);
router.use('/callLoop', authorizeTwilio, authorizeUser, callLoop);

module.exports = router;