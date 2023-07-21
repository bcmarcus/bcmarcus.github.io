const express = require('express');
const router = express.Router();
const { generateAiVoiceMessage } = require ("../../utils/elevenLabs");
const transcribeAudio = require ("../../googleCloud/utils/transcribeAudio");
const askGPT = require("../../utils/askGPT");
const getSecret = require('../../security/secrets');
const twilio = require('twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

async function noResponseHangup (req) {
  const filePath = "default/goodbye.mp3";
  const AIvoiceMessageUrl = `${global.domain}/getAudio/${filePath}`
  const twiml = new VoiceResponse();
  twiml.play({}, AIvoiceMessageUrl);
  twiml.hangup();

  const client = await createTwilioClientAndUpdateCall();
  await client.calls(req.body.CallSid).update({
    twiml: twiml.toString(),
  });
}

async function createTwilioClientAndUpdateCall() {
  const twilioAuth = await getSecret('twilio');
  const twilioSID = await getSecret('twilio', 'sid')

  const client = twilio(twilioSID, twilioAuth);
  return client;
}

async function callAndResponseOverride (AIvoiceMessageUrl, req) {
  const twiml = new VoiceResponse();
  twiml.play({}, AIvoiceMessageUrl);
  twiml.pause({ length: 1 });
  twiml.record({ 
    action: `${domain}/callLoop`,
    maxLength: 20,
    timeout: 1,
    playBeep: false
  });

  const client = await createTwilioClientAndUpdateCall();
  await client.calls(req.body.CallSid).update({
    twiml: twiml.toString(),
  });
}

// This is the main loop
router.post('/', async (req, res) => {
  const recordingUrl = req.body.RecordingUrl;
  console.log(`Recording available at ${recordingUrl}`);

  // Start the transcription process asynchronously
  const transcriptionPromise = transcribeAudio(recordingUrl);

  // This is the query while waiting for the transcription to process
  const audioFilePath = "audio/audio.mp3";
  const twiml = new VoiceResponse();
  const AIvoiceMessageUrl = await generateAiVoiceMessage('Working on that.', audioFilePath);
  twiml.pause({ length: 2 });
  twiml.play({}, AIvoiceMessageUrl);
  twiml.pause({ length: 15 });
  twiml.say("I'm sorry, this seems to be taking too long. Please try again later.");
  twiml.hangup();
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());

  // Finish processing the transcription
  const transcription = await transcriptionPromise;
  console.log(transcription);

  // If it is empty, then do one retry, and then hangup
  if (transcription === '') {
    console.log("empty string");
    await noResponseHangup(req);
  }

  // If it is not empty, then continue
  else {


    const response = await askGPT(transcription);
    console.log(`response: ${response}`);

    const AIvoiceMessageUrl = await generateAiVoiceMessage(response, audioFilePath);
    console.log (AIvoiceMessageUrl);

    await callAndResponseOverride(AIvoiceMessageUrl, req, res);
  }
});

module.exports = router;