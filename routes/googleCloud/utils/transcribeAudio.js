const axios = require('axios');
const speech = require('@google-cloud/speech');

async function transcribeAudio(callSid, recordingSid, recordingUrl) {
  // Download the audio file from the recording URL
  let attempts = 1;
  var base64Audio;

  const twilioClient = global.twilioClient;

  while(attempts > 0) {
    try {
      // const finishedRecording = await twilioClient.calls(callSid).recordings(recordingSid).update({status: 'stopped'});
      
      const recording = await twilioClient.calls(callSid).recordings(recordingSid).fetch();

      // console.log (recording.uri.replace('.json', '.mp3'));
      // const response = await axios.get("https://api.twilio.com" + recording.uri.replace('.json', '.mp3'), { responseType: 'stream' });
  
      const response = await axios.get(recordingUrl, { responseType: 'stream' });

      const getStream = await import('get-stream');
      const audioBytes = await getStream.default.buffer(response.data);
      const base64Audio = audioBytes.toString('base64');
  
      // console.log('Base64 Audio:', base64Audio);
    } catch (error) {
      attempts--;
      await logWarning(error);
    }
  }
  if (response == undefined || response.data == undefined || base64Audio == undefined) {
    await logWarning ("Undefined response in transcribeAudio");
    return "";
  }
  // The audio data is encoded as an ArrayBuffer

  const speechClient = new speech.SpeechClient();

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 8000,
    languageCode: 'en-US',
  };

  const audio = {
    content: base64Audio,
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