//answerCall.js
const express = require('express');
const router = express.Router();
const VoiceResponse = require('twilio').twiml.VoiceResponse;

router.post('/', async (req, res) => {
  const twiml = new VoiceResponse();
  const filePath = "default/hello.mp3";
  const AIvoiceMessageUrl = `${global.storageDomain}/getAudio/${filePath}`
  // Use <Gather> verb to gather speech input
  const gather = twiml.gather({
    input: 'speech',
    action: '/callLoopVeryFast',
    speechModel: "experimental_conversations",
    speechTimeout: "auto"
  });

  gather.play (AIvoiceMessageUrl);
  gather.pause({ length: 15 });
  res.type('text/xml');
  res.send(twiml.toString());
});



module.exports = router;