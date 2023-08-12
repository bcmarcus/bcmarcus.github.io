const express = require('express');
const router = express.Router();
const { generateAiVoiceMessage } = require ("../../utils/elevenLabs");
const transcribeAudio = require ("../../googleCloud/utils/transcribeAudio");
const askGPT = require("../../GPT/askGPT");
const twilio = require('twilio');
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
  twiml.play({}, AIvoiceMessageUrl);
  twiml.record({ 
    action: `${global.domain}/callLoop`,
    maxLength: 20,
    timeout: 2,
    playBeep: false
  });

  const twilioClient = global.twilioClient;
  await twilioClient.calls(req.body.CallSid).update({
    twiml: twiml.toString(),
  });
}


// // This is the main loop
// router.post('/', async (req, res) => {
//   const recordingUrl = req.body.RecordingUrl;
  
//   await logDebug(`Recording available at ${recordingUrl}`);

//   // Start the transcription process asynchronously
//   const transcriptionPromise = transcribeAudio(recordingUrl);

//   // This is the query while waiting for the transcription to process
//   const audioFilePath = "audio.mp3";
//   // const AIvoiceMessageUrl = await generateAiVoiceMessage('Working on that.', audioFilePath);

//   const workingOnThat = `${global.storageDomain}/getAudio/default/thinking1.mp3`
//   const tryAgainLater = `${global.storageDomain}/getAudio/default/tryAgainLater.mp3`
//   const twiml = new VoiceResponse();
//   twiml.pause({ length: 2 });
//   twiml.play({}, workingOnThat);
//   twiml.pause({ length: 15 });
//   twiml.play({}, tryAgainLater);
//   twiml.hangup();
//   res.writeHead(200, { 'Content-Type': 'text/xml' });
//   res.end(twiml.toString());

//   // Finish processing the transcription
//   const transcription = await transcriptionPromise;
//   await logDebug(transcription);

//   // If it is empty, then do one retry, and then hangup
//   if (transcription === '') {
//     await logDebug("empty string");
//     await noResponseHangup(req);
//   }

//   // If it is not empty, then continue
//   else {


//     const response = await askGPT(transcription);
//     await logDebug(`response: ${response}`);

//     const AIvoiceMessageUrl = await generateAiVoiceMessage(response, audioFilePath);
//     await logDebug (AIvoiceMessageUrl);

//     await callAndResponseOverride(AIvoiceMessageUrl, req, res);
//   }
// });




// This is the main loop
router.post('/', async (req, res) => {
  var recordingUrl;
  const twilioClient = global.twilioClient;
  const callSid = req.body.CallSid;
  var recordingSid;
  try {

    // end current recording
    const recordings = await twilioClient.recordings.list({callSid: callSid});
    const activeRecording = recordings.find(recording => recording.status === 'processing');
    const finishedRecording = await twilioClient.calls(req.body.CallSid).recordings(activeRecording.sid).update({status: 'stopped'});
    console.log(finishedRecording);
    const twilioSID = global.twilioSID;
    recordingUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSID}/Recordings/${finishedRecording.sid}.mp3`;
    recordingSid = finishedRecording.sid;

    // start another recording
    const newRecording = await twilioClient.calls(req.body.CallSid).recordings.create();
    console.log(newRecording.sid);
    // res.send(`Recording restarted. The URL of the next recording is: ${recordingUrl}`);
  } catch(err) {
    logWarning(err.message);
    res.status(500).send('An error occurred while restarting the recording');
    return;
  }
  
  await logDebug(`Recording available at ${recordingUrl}`);

  recordingUrl = "https://api.twilio.com/2010-04-01/Accounts/ACb652ace97e573ffa5da02c3186358743/Recordings/RE155f082e56a24d8e5eedf590681fe641.mp3"
  // Start the transcription process asynchronously
  const transcriptionPromise = transcribeAudio(callSid, recordingSid, recordingUrl);

  // This is the query while waiting for the transcription to process
  const audioFilePath = "audio.mp3";
  // const AIvoiceMessageUrl = await generateAiVoiceMessage('Working on that.', audioFilePath);

  const workingOnThat = `${global.storageDomain}/getAudio/default/thinking1.mp3`
  const tryAgainLater = `${global.storageDomain}/getAudio/default/tryAgainLater.mp3`
  const twiml = new VoiceResponse();
  twiml.pause({ length: 2 });
  twiml.play({}, workingOnThat);
  twiml.pause({ length: 15 });
  twiml.play({}, tryAgainLater);
  twiml.hangup();
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());

  // Finish processing the transcription
  var transcription;
  try {
    transcription = await transcriptionPromise;
  } catch (error) {
    console.log (error.message);
    return;
  }
  await logDebug(transcription);

  // If it is empty, then do one retry, and then hangup
  if (transcription === '') {
    await logDebug("empty string");
    await noResponseHangup(req);
  }

  // If it is not empty, then continue
  else {
    const response = await askGPT(transcription);
    await logDebug(`response: ${response}`);

    const AIvoiceMessageUrl = await generateAiVoiceMessage(response, audioFilePath);
    await logDebug (AIvoiceMessageUrl);

    await callAndResponseOverride(AIvoiceMessageUrl, req, res);
  }
});

module.exports = router;