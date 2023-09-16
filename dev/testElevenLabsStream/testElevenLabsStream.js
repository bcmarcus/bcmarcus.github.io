// Import required modules
const axios = require('axios');
const WebSocket = require('ws');
const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const getSecret = require('../../routes/security/secrets.js');
const { logDebug } = require('../../routes/utils/logging.js');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

process.env.GOOGLE_APPLICATION_CREDENTIALS = "../../config/service_keys/call-to-action-2afc3-82ae4cc2b811.json";

const voiceID = '21m00Tcm4TlvDq8ikWAM';
const streamingLatency = 4;
const message = "Hello, how can I be of assistance?";
const modelId = "eleven_monolingual_v1";
const voiceSettings =  {
  "stability": 0.2,
  "similarity_boost": 0.7,
};

function isBase64(str) {
  const base64Regex = /^([A-Za-z0-9+/]{4})*(([A-Za-z0-9+/]{2}==)|([A-Za-z0-9+/]{3}=))?$/;
  return base64Regex.test(str);
}

wss.on('connection', ws => {
  ws.on('message', async message => {
    const msg = JSON.parse(message);

    switch (msg.event) {
      case 'connected':
        console.log(`A new call has connected.`);
        break;
      case 'start':
        twilioStreamSid = msg.streamSid; // Capture the StreamSid
        console.log(`Starting Media Stream ${twilioStreamSid}`);
        await makeElevenLabsRequest(ws, msg.streamSid);
        break;
      case 'stop':
        console.log(`Stopping Media Stream`);
        break;
    }
  });
});

async function makeElevenLabsRequest(ws, twilioStreamSid) {
  const xiApiKey = await getSecret('elevenLabs');

  console.log(process.env.DEBUG);
  logDebug("Start Eleven Labs");
  const params = {
    optimize_streaming_latency: streamingLatency,
  };
  const data = {
    text: "This is a long test string to see if there is something slower with long strings. If there is not an issue with it, then I will not need to change anything. Otherwise, I will need to change the streaming latency.",
    model_id: modelId,
    voice_settings: voiceSettings
  };

  try {
    response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}/stream`,
      params: params,
      data: data,
      headers: {
        "xi-api-key": xiApiKey
      },
      responseType: 'stream'
    })

    logDebug("End Eleven Labs");

    logDebug("Start Eleven Labs 2");
    response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}/stream`,
      params: params,
      data: data,
      headers: {
        "xi-api-key": xiApiKey
      },
      responseType: 'stream'
    })
    logDebug("End Eleven Labs2");

    // console.log('Content-Type:', response.data);
    // console.log('Content-Type:', response.headers['content-type']);
    // console.log('Audio stream received from ElevenLabs.');

    //mpeg at 44100

    // Convert the MPEG audio data to PCM
    const command = ffmpeg(response.data)
      .format('wav')
      .audioCodec('pcm_mulaw')
      .audioChannels(1)
      .audioFrequency(8000)
      // .outputOptions('-acodec', 'pcm_mulaw') // Change 'pcm_u8' to 'mulaw'
      .on('error', function(err, stdout, stderr) {
        console.error('Error processing audio data with ffmpeg:', err);
        console.error('ffmpeg stdout:', stdout);
        console.error('ffmpeg stderr:', stderr);
      });
  

    const ffstream = command.pipe();
  
    ffstream.on('data', function(pcmData) {
      const base64AudioData = Buffer.from(pcmData).toString('base64');

      const twilioMessage = {
        event: "media",
        streamSid: twilioStreamSid,  // Replace with your actual Stream SID
        media: {
          payload: base64AudioData
        }
      };
    
      // Convert the JSON object to a string
      // console.log(twilioMessage);

      const twilioMessageString = JSON.stringify(twilioMessage);
      ws.send(twilioMessageString);
    });

    } catch( error ) {
    console.error('Error getting audio stream from ElevenLabs:', error);
  };
}

app.post('/', (req, res) => {
  res.set('Content-Type', 'text/xml');
  res.send(`
    <Response>
      <Connect>
        <Stream url="wss://${req.headers.host}/"/>
      </Connect>
    </Response>
  `);
});

server.listen(8080);

console.log("Server listening on 8080!");
