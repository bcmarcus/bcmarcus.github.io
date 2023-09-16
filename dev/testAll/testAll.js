const elevenLabsStreamToTwilio = require("./elevenLabs");
const { askGPTStream, makeTranscript } = require("./GPT");
const createTwilioClient = require("./twilio");
const getSecret = require('../../routes/security/secrets.js');
const { logDebug, logWarning } = require('../../routes/utils/logging');
const admin = require('firebase-admin');
const fs = require('fs');
const SpeechToText = require ("./SpeechToText");
const TwilioMediaStreamSaveAudioFile = require('./TwilioMediaStreamSaveAudioFile');

const winkNLP = require('wink-nlp');
const its = require('wink-nlp/src/its.js');
const model = require('wink-eng-lite-web-model');
const nlp = winkNLP(model);

const express = require('express');
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const server = require('http').createServer(app);

const twilio = require("twilio");
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const { defaultSystemIntelSecretary, defaultSystemHasInfo, defaultSystemIntelFunctions } = require('../../routes/LLM/defaultSystemIntel');

const WebSocket = require('ws');
const twilioWSS = new WebSocket.Server({ server });

const port = process.env.PORT || 8080;
const config = require("../../config/config.js");

// Get the file path from the environment variable
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Read the file and parse it into an object
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

global.domain = config.dev.app.domain;

async function respond (ws, twilioStreamSid, GPTStream) {
  // fullText is used to store the text for the next GPT query
  var fullText = '';

  // text is used to store the current sentence
  var text = '';

  // this is the sentence array broken up by NLP. 
  var sentences;
  for await (const part of GPTStream) {
    // logDebug("GPTMessage");

    // prepare the data 
    let chunk = part.choices[0]?.delta?.content || '';
    text += part.choices[0]?.delta?.content || '';
    fullText += chunk;

    const doc = nlp.readDoc(text);
    sentences = doc.sentences().out();
    // -- TODO: make it so that eleven labs processes 1, then 2, then 3... sentences at a time for better consistency in the voice (also change fencepost)
    // sentence end detected
    if (sentences.length > 1) {
      sentences[0] = sentences[0].replace ("Answer: ", '');
      sentences[0] = sentences[0].replace ("Question: ", '');
      await elevenLabsStreamToTwilio (ws, twilioStreamSid, sentences[0]);
      text = text.replace(sentences[0], '').trim();
    }

    // logging
    // console.log (sentences);
  }

  // the final sentence
  if (sentences [0]) {
    sentences[0] = sentences[0].replace ("Answer: ", '');
    sentences[0] = sentences[0].replace ("Question: ", '');
    await elevenLabsStreamToTwilio (ws, twilioStreamSid, sentences[0]);
  }

  return {
    role: 'assistant',
    content: fullText
  };
}

async function hangup (callSid) {
  const filePath = "default/goodbye.mp3";
  const AIvoiceMessageUrl = `${global.storageDomain}/getAudio/${filePath}`
  const twiml = new VoiceResponse();
  twiml.play({}, AIvoiceMessageUrl);
  twiml.hangup();

  const twilioClient = global.twilioClient;
  await twilioClient.calls(callSid).update({
    twiml: twiml.toString(),
  });
}

async function chat (ws, speechToText, callSid, twilioStreamSid, startMessage) {
  var messages = [
    defaultSystemIntelSecretary, 
    {
      role: 'assistant',
      content: startMessage
    }
  ];

  logDebug("Chat: Before ElevenLabsStreamToTwilio");
  // calls the elevenLabs stream with the startMessage
  await elevenLabsStreamToTwilio (ws, twilioStreamSid, startMessage);

  logDebug("Chat: After ElevenLabsStreamToTwilio");

  while(true) {
    // -- waits for response with twilio and speechToText
    logDebug("Chat: Before SpeechToText");

    await speechToText.start();
    for await (const part of speechToText.generateSequence());

    logDebug("Chat: After SpeechToText");
    logDebug("Chat: Before GetTranscript");

    var finalTranscription;
    try {
      finalTranscription = await speechToText.getTranscript();
    } catch (err) {
      logWarning(`TTS error: ${err}`);
      await hangup(callSid);
    }

    logDebug("Chat: After GetTranscript");

    messages.push (
      {
        role: 'user',
        content: finalTranscription
      }
    );
    // -- creates GPT stream

    logDebug("Chat: Before askGPTStream");
    let GPTStream = await askGPTStream (messages);
    logDebug("Chat: After askGPTStream");

    // -- loops through every sentence returned by GPT (detects when it is finished by seeing when GPT returns the stop command)

    logDebug("Chat: Before respond");
    let GPTResponse = await respond (ws, twilioStreamSid, GPTStream)
    logDebug("Chat: After askGPTStream");
    messages.push(GPTResponse);
    let transcript = await makeTranscript(messages);
    console.log ("Transcript:", transcript)
  }
};

// When a message is received from the client
twilioWSS.on('connection', ws => {
  const mediaStreamSaver = new TwilioMediaStreamSaveAudioFile({
    saveLocation: __dirname,
    saveFilename: 'twilioStreamOutput',
    onSaved: () => console.log('Saved audio file!'),
  });
  
  mediaStreamSaver.setWebsocket(ws);
  const speechToText = new SpeechToText();

  ws.on('message', async (message) => {
    let msg = JSON.parse(message);
    switch (msg.event) {
      case 'connected':
        console.log(`A new call has connected.`);
        mediaStreamSaver.twilioStreamStart();
        break;

      case 'start':
        logDebug(`Starting Media Stream ${msg.streamSid}`);
        startMessage = "Hello, how can I be of assistance today?";
        await chat (ws, speechToText, msg.start.callSid, msg.streamSid, startMessage);
        break;

      case 'media':
        const audioData = Buffer.from(msg.media.payload, 'base64');
        await speechToText.handleAudioData(audioData);
        break;

      case 'stop':
        logDebug(`Stopping Media Stream ${msg.streamSid}`);
        await speechToText.off();
        mediaStreamSaver.twilioStreamStop();
        ws.emit('stop');
        break;
    }
  });
});

Promise.all([getSecret('twilio'), getSecret('twilio', 'sid'), getSecret("openAI"), getSecret('elevenLabs')])
  .then(([twilioAuth, twilioSID, openAIAuth, elevenLabsAuth]) => {
    global.twilioAuth = twilioAuth;
    global.twilioSID = twilioSID;
    global.openAIAuth = openAIAuth;
    global.elevenLabsAuth = elevenLabsAuth;
    
    const twilioClient = createTwilioClient()
    global.twilioClient = twilioClient;

    // -- EXPRESS -- //
    app.post('/', (req, res) => {
      const twiml = new VoiceResponse();
      const connect = twiml.connect();
      connect.stream({url: `wss://${req.headers.host}/`});
      res.set('Content-Type', 'text/xml');
      res.send(twiml.toString());
      // after this, the flow transitions to the websocket server. See above
    });

    server.listen(port, async () => {
      await logDebug(`Server is running on port ${port}`);
    });

    // -- EXPRESS -- //
  })
  .catch(error => {
    logWarning('Error:', error.message).then(() => {console.log(error.message)});
    return;
  }
);