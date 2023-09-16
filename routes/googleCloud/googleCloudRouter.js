// googleCloudRouter.js
const express = require ('express');
const router = express.Router ();
const getAudio = require ('./routes/getAudio');
// const authorizeTwilio = require('../security/twilioAuth');

router.use ('/getAudio', getAudio);

module.exports = router;
