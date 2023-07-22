const axios = require('axios');
const speech = require('@google-cloud/speech');

async function transcribeAudio(recordingUrl) {
  // Download the audio file from the recording URL
  var response;
  let attempts = 2;
  
  while(attempts > 0) {
    try {
      response = await axios.get(recordingUrl, {
        responseType: 'arraybuffer'
      });

      // If the request is successful, break out of the loop
      break;
    } catch (error) {
      console.error(error.response.data);

      attempts--;

      // If this was the last attempt, throw the error
      if (attempts === 0) {
        throw error;
      }
    }
  }
  if (response == undefined && response.data == undefined) {
    await logWarning ("Undefined response in transcribeAudio");
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