const axios = require('axios');
const WebSocket = require('ws');
const express = require('express');
const TwilioMediaStreamSaveAudioFile = require('./TwilioMediaStreamSaveAudioFile');
const VAD = require('node-vad'); // new package

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

const SHORT_TERM_WINDOW_SIZE = 50;
const LONG_TERM_AVERAGE_THRESHOLD = 1000;
const LONG_TERM_WINDOW_SIZE = 2;

let twilioStreamSid;

const mediaStreamSaver = new TwilioMediaStreamSaveAudioFile({
  saveLocation: __dirname,
  saveFilename: 'my-twilio-media-stream-output',
  onSaved: () => console.log('Saved audio file!'),
});

wss.on('connection', ws => {

  const vad = new VAD(VAD.Mode.VERY_AGGRESSIVE);
  let startVoiceTimestamp;
  let endVoiceTimestamp;
  let inVoice = false;
  let shortTermEnergySum = 0;
  let longTermEnergySum = 0;
  let shortTermCount = 0;
  let longTermCount = 0;
  
  mediaStreamSaver.setWebsocket(ws);

  ws.on('message', async message => {
    const msg = JSON.parse(message);
    switch (msg.event) {
      case 'connected':
        console.log(`A new call has connected.`);
        mediaStreamSaver.twilioStreamStart();
        break;

      case 'start':
        twilioStreamSid = msg.streamSid; // Capture the StreamSid
        console.log(`Starting Media Stream ${twilioStreamSid}`);
        break;

      case 'media':
        const audioData = Buffer.from(msg.media.payload, 'base64');
        vad.processAudio(audioData, 8000).then(res => {
          const energy = audioData.reduce((sum, sample) => sum + sample * sample, 0);
          shortTermEnergySum += energy;
          longTermEnergySum += energy;
          shortTermCount++;
          longTermCount++;
      
          if (shortTermCount >= SHORT_TERM_WINDOW_SIZE) {
              const shortTermAverage = shortTermEnergySum / shortTermCount;
              const longTermAverage = longTermEnergySum / longTermCount;
      
              if (shortTermAverage > LONG_TERM_AVERAGE_THRESHOLD * longTermAverage) {
                console.log("voice");
                  // Voice detected
              } else {
                console.log("silence");
                  // Silence detected
              }
      
              // Reset short-term energy sum and count
              shortTermEnergySum = 0;
              shortTermCount = 0;
          }
      
          if (longTermCount >= LONG_TERM_WINDOW_SIZE) {
              // Reset long-term energy sum and count
              longTermEnergySum = 0;
              longTermCount = 0;
          }
      }).catch(console.error);
      
        break;

      case 'stop':
        console.log(`Stopping Media Stream ${twilioStreamSid}`);
        mediaStreamSaver.twilioStreamStop();
        break;
    }
  });
});

async function callAndResponseOverride (text, req) {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    input: 'speech',
    action: `${global.domain}/callLoopVeryFast`,
    speechModel: "experimental_conversations",
    speechTimeout: "auto"
  });

  gather.say ({voice: "Google.en-US-Neural2-H"}, text);
  gather.pause({ length: 15 });

  const twilioClient = global.twilioClient;
  await twilioClient.calls(req.body.CallSid).update({
    twiml: twiml.toString(),
  });
}

app.get('/', (req, res) => res.send('Hello World'));

app.post('/', (req, res) => {
  res.set('Content-Type', 'text/xml');
  res.send(`
    <Response>
    <Start>
      <Stream url="wss://${req.headers.host}/"/>
    </Start>
    <Say>I will stream the next 5 seconds of audio through your websocket</Say>
    <Pause length="5" />
    </Response>
  `);
});

server.listen(8080);

console.log("Server listening on 8080!");
