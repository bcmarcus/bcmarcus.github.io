// Import required modules
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { logDebug } = require('../../utils/logging.js');

const voiceID = '21m00Tcm4TlvDq8ikWAM';
const streamingLatency = 0;
const modelId = "eleven_monolingual_v1";
const voiceSettings =  {
  "stability": 0.2,
  "similarity_boost": 0.7,
};

async function elevenLabsStreamToTwilio(ws, twilioStreamSid, message) {
  logDebug("elevenStreamStart");
  let apiKey;
  try {
    apiKey = global.elevenLabsAuth;
  } catch (err) {
    throw new Error("Failed to retrieve OpenAI key from Secret Manager");
  }

  const params = {
    optimize_streaming_latency: streamingLatency,
  };
  const data = {
    text: message,
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
        "xi-api-key": apiKey
      },
      responseType: 'stream'
    })

    // Convert the MPEG/44100 audio data to PCM
    logDebug("ffmpeg start");
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
    logDebug("ffmpeg end");

    return new Promise((resolve, reject) => {
      ffstream.on('data', function(pcmData) {
        const base64AudioData = Buffer.from(pcmData).toString('base64');
  
        const twilioMessage = {
          event: "media",
          streamSid: twilioStreamSid,  // Replace with your actual Stream SID
          media: {
            payload: base64AudioData
          }
        };
        if (base64AudioData.startsWith("UklGRv////9XQVZFZm10IBIAAAAHAAEAQB8AAEAfAAABAAgAAABMSVNUGgAA")) {
          // logDebug ("ElevenLabs: Header found, ", base64AudioData);
        } else {
          const twilioMessageString = JSON.stringify(twilioMessage);
          ws.send(twilioMessageString);
        }
      });
  
      ffstream.on('end', () => {
        resolve();
      });
  
      ffstream.on('error', reject);
    });
  } catch( error ) {
    console.error('Error getting audio stream from ElevenLabs:', error);
  };
}

module.exports = elevenLabsStreamToTwilio;