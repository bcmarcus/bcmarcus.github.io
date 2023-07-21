//googleCloudRouter.js
const express = require('express');
const router = express.Router();
const getAudio = require('./routes/getAudio');

router.use('/getAudio', getAudio);

module.exports = router;
