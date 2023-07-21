const axios = require('axios');
const speech = require('@google-cloud/speech');

async function transcribeAudio(recordingUrl) {
  // Download the audio file from the recording URL
  var response;
  try {
    response = await axios.get(recordingUrl, {
        responseType: 'arraybuffer'
    });
  } catch (error) {
      console.error(error.response.data);
  }

  if (response.data == undefined) {
    return "";
  }
  // The audio data is encoded as an ArrayBuffer
  const audioBytes = response.data.toString('base64');

  const speechClient = new speech.SpeechClient();

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 8000,
    languageCode: 'en-US',
  };

  const audio = {
    content: audioBytes,
  };

  const request = {
    config: config,
    audio: audio,
  };

  // Detects speech in the audio file
  const [transcriptionData] = await speechClient.recognize(request);
  const transcription = transcriptionData.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');

  return transcription;
}

module.exports = transcribeAudio;