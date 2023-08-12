const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const askGPT = require("../../GPT/askGPT");
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const defaultSystemIntel = require('../../GPT/defaultSystemIntel');

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

async function callAndResponseOverride (text, req) {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    input: 'speech',
    action: `${global.domain}/callLoopVeryFast`,
    speechModel: "experimental_conversations",
    speechTimeout: "auto"
  });

  //google cloud text to speech good sounding
  //en-US-Neural2-F
  //en-US-Neural2-G
  //en-US-Neural2-H

  //google cloud text to speech faster
  // any standard model

  gather.say ({voice: "Google.en-US-Neural2-H"}, text);
  gather.pause({ length: 15 });

  const twilioClient = global.twilioClient;
  await twilioClient.calls(req.body.CallSid).update({
    twiml: twiml.toString(),
  });
}


// This is the main loop that uses gather to get the data.
router.post('/', async (req, res) => {
  await logDebug ("Enter CallLoopVeryFast");
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




  // testing the databases
  const firestore = admin.firestore();
  // const realtimeDatabase = admin.database();  

  // Firestore
  // check to see if the value exists already
  const callDocRef = firestore.collection('calls').doc(req.body.CallSid);
  
  // Get the existing document
  const doc = await callDocRef.get();
  let messages = [];
  if (doc.exists) {
    messages = doc.data().messages;
    await logDebug(messages);
  } else {
    messages = [
      defaultSystemIntel
    ];
    await logDebug('Messages not found in firestore.');
  }

  const messageUser = {
    role: 'user',
    content: transcription
  };

  messages.push(messageUser);


  // delete
  // await firestore.collection('calls').doc(req.body.CallSid).delete();

  // Realtime Database
  // const snapshot = await realtimeDatabase.ref('calls/' + req.body.CallSid).once('value');
  // if (snapshot.exists()) {
  //   const customVariableRealtimeDB = snapshot.val().customVariable;
  //   // Use customVariableRealtimeDB in your application logic here
  // } else {
  //   console.log('No such node in Realtime Database!');
  // }

  // await realtimeDatabase.ref('calls/' + req.body.CallSid).set({ customVariable });

  //delete
  // await realtimeDatabase.ref('calls/' + req.body.CallSid).remove();



  await logDebug (messages);

  await logDebug ("Before GPT");


  // to be even faster, look into streaming the output text.
  const responsePromise = askGPT(messages);
  
  const twiml = new VoiceResponse();
  twiml.pause({ length: 15 });
  twiml.hangup();
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());

  // Finish processing the transcription
  const response = await responsePromise;
  await logDebug ("After GPT");




  
  const messageSystem = {
    role: 'assistant',
    content: response
  };
  
  // Push new messages to the messages array
  messages.push(messageSystem);
  
  // Update the document
  await logDebug ("Before Firestore Set");
  await callDocRef.set({ messages });
  await logDebug ("After Firestore Set");

  await logDebug(messages);

  await callAndResponseOverride(response, req);

  await logDebug ("Exit CallLoopVeryFast");
});




module.exports = router;