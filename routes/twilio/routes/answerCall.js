//answerCall.js
const express = require('express');
const router = express.Router();
const { generateAiVoiceMessage } = require ("../../utils/elevenLabs")
const VoiceResponse = require('twilio').twiml.VoiceResponse;

function callAndResponse (AIvoiceMessageUrl, res) {
  const twiml = new VoiceResponse();
  twiml.play({}, AIvoiceMessageUrl);
  twiml.pause({ length: 1 });
  twiml.record({ 
    action: `${global.domain}/callLoop`,
    maxLength: 20,
    timeout: 1,
    playBeep: false
  });

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

router.post('/', async (req, res) => {
  // const introText = "Hello, how can I be of assistance?";
  const filePath = "default/hello.mp3";
  const AIvoiceMessageUrl = `${global.domain}/getAudio/${filePath}`
  // const AIvoiceMessageUrl = await generateAiVoiceMessage(introText, filePath);
  console.log (AIvoiceMessageUrl);
  callAndResponse (AIvoiceMessageUrl, res);
});

module.exports = router;