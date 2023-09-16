// -- System Modules -- //
const fs = require ('fs');
const http = require ('http');
const path = require ('path');

// -- Firebase and Security -- //
const admin = require ('firebase-admin');
const config = require ('../config/config.js');

if (process.env.DEV) {
  // Get the file path from the environment variable
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  // Read the file and parse it into an object
  const serviceAccount = JSON.parse (fs.readFileSync (serviceAccountPath, 'utf8'));

  admin.initializeApp ({
    credential: admin.credential.cert (serviceAccount),
  });

  global.domain = config.dev.app.domain;
} else {
  global.domain = config.prod.app.domains[0];
  admin.initializeApp ();
}

// -- NPM Modules -- //
const express = require ('express');

// -- Custom Modules -- //
const answerCallLoop = require ('../routes/twilio/answerCallLoop');
const { createTwilioClient } = require ('../routes/twilio/twilioUtils');
const date = require ('../routes/utils/date');
const getSecret = require ('../routes/security/secrets.js');
const googleCloudRouter = require ('../routes/googleCloud/googleCloudRouter');
const { loadLLMFunctions, loadLLMFunctionsDetails } = require ('../routes/LLM/functions/helpers/metadataHelpers');
const { logDebug, logWarning } = require ('../routes/utils/logging');
const SpeechToText = require ('../routes/audio/SpeechToText');
const twilioRouter = require ('../routes/twilio/twilioRouter');

// -- Dev Modules -- //
let TwilioMediaStreamSaveAudioFile;
if (process.env.DEV) {
  TwilioMediaStreamSaveAudioFile = require ('../routes/audio/TwilioMediaStreamSaveAudioFile');
}

// -- Express app setup -- //
const app = express ();
app.use (express.json ()); // for parsing application/json
app.use (express.urlencoded ({ extended: true })); // for parsing application/x-www-form-urlencoded
const server = http.createServer (app);

const WebSocket = require ('ws');
const twilioWSS = new WebSocket.Server ({ server });

const port = process.env.PORT || 8080;

// -- Globals -- //
global.storageDomain = config.prod.app.domains[0];
global.logDebug = logDebug;
global.logWarning = logWarning;

// -- Twilio Websocket Server -- //
twilioWSS.on ('connection', (ws) => {
  let mediaStreamSaver;
  if (process.env.DEV) {
    mediaStreamSaver = new TwilioMediaStreamSaveAudioFile ({
      saveLocation: `${__dirname}/audio`,
      saveFilename: 'output',
      onSaved: () => console.log ('Saved audio file!'),
    });

    mediaStreamSaver.setWebsocket (ws);
  }

  const speechToText = new SpeechToText ();
  const mediaMap = new Map ();

  ws.on ('message', async (message) => {
    const msg = JSON.parse (message);
    switch (msg.event) {
      case 'connected':
        console.log (`A new call has connected.`);
        if (process.env.DEV) {
          mediaStreamSaver.twilioStreamStart ();
        }
        break;

      case 'start':
        logDebug (`Starting Media Stream ${msg.streamSid}`);
        startMessage = 'Hello, how can I be of assistance today?';
        await answerCallLoop (ws, speechToText, msg.start.callSid, msg.streamSid, startMessage);
        break;

      case 'media':
        const audioData = Buffer.from (msg.media.payload, 'base64');
        const sequenceNumber = msg.sequenceNumber;
        if (mediaMap.size > 1000) {
          const oldestKey = mediaMap.keys ().next ().value;
          mediaMap.delete (oldestKey);
        }
        if (mediaMap.has (sequenceNumber)) {
          logDebug (`Discarding repeated message. SeqNum: ${sequenceNumber}, Data: ${mediaMap.get (sequenceNumber).slice (0, 32)}`);
        } else {
          mediaMap.set (sequenceNumber, msg.media.payload);
          await speechToText.handleAudioData (audioData);
        }
        break;

      case 'stop':
        logDebug (`Stopping Media Stream ${msg.streamSid}`);
        await speechToText.off ();
        ws.emit ('stop');
        if (process.env.DEV) {
          mediaStreamSaver.twilioStreamStop ();
        }
        break;
    }
  });
});

Promise.all ([getSecret ('bing'), getSecret ('twilio'), getSecret ('twilio', 'sid'), getSecret ('openAI'), getSecret ('elevenLabs'), loadLLMFunctions ('../routes/LLM/LLMFunctions/default')])
    .then (async ([bingAuth, twilioAuth, twilioSID, openAIAuth, elevenLabsAuth, LLMFunctions]) => {
      global.bingAuth = bingAuth;
      global.twilioAuth = twilioAuth;
      global.twilioSID = twilioSID;
      global.openAIAuth = openAIAuth;
      global.elevenLabsAuth = elevenLabsAuth;
      global.LLMFunctions = LLMFunctions;
      global.LLMFunctionDetails = await loadLLMFunctionsDetails (global.LLMFunctions);
      const twilioClient = createTwilioClient ();
      global.twilioClient = twilioClient;

      // -- EXPRESS -- //
      app.use (express.json ()); // for parsing application/json
      app.use (express.urlencoded ({ extended: true })); // for parsing application/x-www-form-urlencoded

      // add "/route" as first param if needed
      app.post ('/makeCallStream', (req, res) => {
        const twiml = new VoiceResponse ();
        const connect = twiml.connect ();
        connect.stream ({ url: `wss://${req.headers.host}/` });
        console.log ('streaming');
        res.set ('Content-Type', 'text/xml');
        res.send (twiml.toString ());
      });

      await server.listen (port, async () => {
        console.log (`Server is running on port ${port}`);
      });

      console.log ('Create Call');

      twilioClient.calls
          .create ({
            url: `${global.domain}/makeCallStream`,
            to: '+14256145153', // the phone number you want to call
            from: '+15738792506', // your Twilio number
          })

          .then ((call) => console.log (call.sid))
          .catch ((err) => console.error (err));

    // -- EXPRESS -- //
    })
    .catch ((error) => {
      logWarning ('Error:', error.message).then (() => {
        console.log (error.message);
      });
      return;
    },
    );
