//twilioRouter.js
const express = require('express');
const router = express.Router();
const authorizeUser = require('../security/userAuth');
const authorizeTwilio = require('../security/twilioAuth');
const answerCall = require('./routes/answerCall');
const callLoopAccurate = require('../dep/twilio/callLoopAccurate');
const callLoopFast = require('./routes/callLoopFast');
const callLoopVeryFast = require('../dep/twilio/callLoopVeryFast');

router.use('/answerCall', authorizeTwilio, authorizeUser, answerCall);
router.use('/callLoopAccurate', authorizeTwilio, authorizeUser, callLoopAccurate);
router.use('/callLoopFast', authorizeTwilio, authorizeUser, callLoopFast);
router.use('/callLoopVeryFast', authorizeTwilio, authorizeUser, callLoopVeryFast);

module.exports = router;