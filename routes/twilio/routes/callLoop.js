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
  twiml.record({ 
    action: `${global.domain}/callLoop`,
    maxLength: 20,
    timeout: 2,
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
  await logWarning(`Recording available at ${recordingUrl}`);

  // Start the transcription process asynchronously
  const transcriptionPromise = transcribeAudio(recordingUrl);

  // This is the query while waiting for the transcription to process
  const audioFilePath = "audio/audio.mp3";
  // const AIvoiceMessageUrl = await generateAiVoiceMessage('Working on that.', audioFilePath);

  const workingOnThat = `${global.domain}/getAudio/default/thinking1.mp3`
  const tryAgainLater = `${global.domain}/getAudio/default/tryAgainLater.mp3`
  const twiml = new VoiceResponse();
  twiml.pause({ length: 2 });
  twiml.play({}, workingOnThat);
  twiml.pause({ length: 15 });
  twiml.play({}, tryAgainLater);
  twiml.hangup();
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());

  // Finish processing the transcription
  const transcription = await transcriptionPromise;
  await logWarning(transcription);

  // If it is empty, then do one retry, and then hangup
  if (transcription === '') {
    await logWarning("empty string");
    await noResponseHangup(req);
  }

  // If it is not empty, then continue
  else {


    const response = await askGPT(transcription);
    await logWarning(`response: ${response}`);

    const AIvoiceMessageUrl = await generateAiVoiceMessage(response, audioFilePath);
    await logWarning (AIvoiceMessageUrl);

    await callAndResponseOverride(AIvoiceMessageUrl, req, res);
  }
});

module.exports = router;