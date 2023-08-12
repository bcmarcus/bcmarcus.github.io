const express = require('express');
const router = express.Router();
const { generateAiVoiceMessage } = require ("../../utils/elevenLabs");
const askGPT = require("../../GPT/askGPT");
const VoiceResponse = require('twilio').twiml.VoiceResponse;

async function noResponseHangup (req) {
  const filePath = "default/goodbye.mp3";
  const AIvoiceMessageUrl = `${global.storageDomain}/getAudio/${filePath}`
  const twiml = new VoiceResponse();
  twiml.play({}, AIvoiceMessageUrl);
  twiml.hangup();

  const twilioClient = global.twilioClient;
  await twilioClient.calls(req.body.CallSid).update({
    twiml: twiml.toString(),
  });
}

async function callAndResponseOverride (AIvoiceMessageUrl, req) {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    input: 'speech',
    action: `${global.domain}/callLoopFast`,
    speechModel: "experimental_conversations",
    speechTimeout: "auto"
  });

  gather.play (AIvoiceMessageUrl);
  gather.pause({ length: 15 });

  const twilioClient = global.twilioClient;
  await twilioClient.calls(req.body.CallSid).update({
    twiml: twiml.toString(),
  });
}


// This is the main loop that uses gather to get the data.
router.post('/', async (req, res) => {
  // This is the query while waiting for the transcription to process
  const transcription = req.body.SpeechResult;

  if (transcription === '') {
    const twiml = new VoiceResponse();
    twiml.pause({ length: 15 });
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
    await logDebug("empty string");
    await noResponseHangup(req);
    return;
  }
  
  
  const audioFilePath = "audio.mp3";

  const responsePromise = askGPT(transcription);

  // const AIvoiceMessageUrl = await generateAiVoiceMessage('Working on that.', audioFilePath);
  const workingOnThat = `${global.storageDomain}/getAudio/default/thinking1.mp3`
  const tryAgainLater = `${global.storageDomain}/getAudio/default/tryAgainLater.mp3`
  const twiml = new VoiceResponse();
  // twiml.pause({ length: 2 });
  twiml.play({}, workingOnThat);
  twiml.pause({ length: 15 });
  twiml.play({}, tryAgainLater);
  twiml.hangup();
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());

  // Finish processing the transcription
  const response = await responsePromise;
  await logDebug(transcription);

  // If it is empty, then do one retry, and then hangup
  if (transcription === '') {
    await logDebug("empty string");
    await noResponseHangup(req);
  }

  // If it is not empty, then continue
  else {
    const AIvoiceMessageUrl = await generateAiVoiceMessage(response, audioFilePath);
    await logDebug (AIvoiceMessageUrl);

    await callAndResponseOverride(AIvoiceMessageUrl, req, res);
  }
});




module.exports = router;