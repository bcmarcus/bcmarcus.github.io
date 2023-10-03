// answerCall.js
const WebSocket = require ('ws');
const { logDev } = require ('../../utils/logging');
const SpeechToText = require ('../../audio/SpeechToText');
const { Call } = require ('../../communications/call/Call');
const { realTimeLoop } = require ('../../respond/realTimeResponse');

let TwilioMediaStreamSaveAudioFile;
if (process.env.DEV) {
  TwilioMediaStreamSaveAudioFile = require ('../../audio/TwilioMediaStreamSaveAudioFile');
}

const callWSS = new WebSocket.Server ({ noServer: true });

/**
  * Twilio Websocket Server.
  * Handles the connection of a new call and manages the media stream.
  * @event connection
  * @param {WebSocket} twilioWS - The WebSocket connection.
  */
callWSS.on ('connection', (twilioWS) => {
  let mediaStreamSaver;
  if (process.env.DEV) {
    mediaStreamSaver = new TwilioMediaStreamSaveAudioFile ({
      saveLocation: `${__dirname}/audio`,
      saveFilename: 'output',
      onSaved: () => console.log ('Saved audio file!'),
    });

    mediaStreamSaver.setWebsocket (twilioWS);
  }

  let call;
  const speechToText = new SpeechToText ();
  const mediaMap = new Map ();


  // let user =
  // ** add user information here, if any exists ** //
  const voiceID = '21m00Tcm4TlvDq8ikWAM';
  const streamingLatency = 4;
  const modelId = 'eleven_monolingual_v1';
  const voiceSettings = {
    'stability': 0.2,
    'similarity_boost': 0.7,
  };

  twilioWS.on ('message', async (message) => {
    const msg = JSON.parse (message);
    switch (msg.event) {
      case 'connected':
        console.log (`A new call has connected.`);
        if (process.env.DEV) {
          mediaStreamSaver.twilioStreamStart ();
        }
        break;

      case 'start':
        logDev (`Starting Media Stream ${msg.streamSid}`);
        call = await Call.create (process.env.elevenLabsAuth, twilioWS, msg.start.callSid, msg.streamSid, voiceID, voiceSettings, modelId, streamingLatency);

        await realTimeLoop (user, call, speechToText);
        break;

      case 'media':
        const audioData = Buffer.from (msg.media.payload, 'base64');
        const sequenceNumber = msg.sequenceNumber;
        if (mediaMap.size > 1000) {
          const oldestKey = mediaMap.keys ().next ().value;
          mediaMap.delete (oldestKey);
        }
        if (mediaMap.has (sequenceNumber)) {
          logDev (`Discarding repeated message. SeqNum: ${sequenceNumber}, Data: ${mediaMap.get (sequenceNumber).slice (0, 32)}`);
        } else {
          mediaMap.set (sequenceNumber, msg.media.payload);
          await speechToText.handleAudioData (audioData);
        }
        break;

      case 'stop':
        logDev (`Stopping Media Stream ${msg.streamSid}`);
        await speechToText.off ();
        twilioWS.emit ('stop');
        if (process.env.DEV) {
          mediaStreamSaver.twilioStreamStop ();
        }
        break;
    }
  });
});

/**
  * Handles the upgrade of the WebSocket connection.
  * @function handleUpgrade
  * @param {Request} request - The HTTP request.
  * @param {WebSocket} twilioWS - The WebSocket connection.
  * @param {Buffer} head - The first packet of the upgraded stream.
  */
function handleAnswerCallUpgrade (request, twilioWS, head) {
  callWSS.handleUpgrade (request, twilioWS, head, function done (twilioWS) {
    callWSS.emit ('connection', twilioWS, request);
  });
}

module.exports = {
  handleAnswerCallUpgrade,
};
