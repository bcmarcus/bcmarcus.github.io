const axios = require ('axios');
const speech = require ('@google-cloud/speech');

/**
    * This async function is responsible for the task of transcribing an audio file.
    * It does so by:
    * 1. Fetching the recorded call from Twilio.
    * 2. Downloading the corresponding audio file.
    * 3. Reading the audio file's data and converting it to a base64 string.
    * 4. Making a request to the Google Cloud Speech-to-Text API to transcribe the audio.
    *
    * @async
    * @function transcribeAudio
    * @param {string} callSid - The unique identifier of the call in Twilio.
    * @param {string} recordingSid - The unique identifier of the recording in Twilio.
    * @param {string} recordingUrl - The URL where the recording can be downloaded.
    * @return {string} - The transcription of the audio file. If an error occurs (such as failing to
    * fetch the call, download the audio file, or transcribe the audio), it will log a warning and return an empty string.
    * @throws {Error} If an error occurs anywhere in the process.
    */
async function transcribeAudio (callSid, recordingSid, recordingUrl) {
  // Download the audio file from the recording URL
  let attempts = 1;
  let base64Audio;

  const twilioClient = global.twilioClient;

  while (attempts > 0) {
    try {
      // const finishedRecording = await twilioClient.calls(callSid).recordings(recordingSid).update({status: 'stopped'});

      const recording = await twilioClient.calls (callSid).recordings (recordingSid).fetch ();

      // console.log (recording.uri.replace('.json', '.mp3'));
      // const response = await axios.get("https://api.twilio.com" + recording.uri.replace('.json', '.mp3'), { responseType: 'stream' });

      const response = await axios.get (recordingUrl, { responseType: 'stream' });

      const getStream = await import ('get-stream');
      const audioBytes = await getStream.default.buffer (response.data);
      const base64Audio = audioBytes.toString ('base64');

      // console.log('Base64 Audio:', base64Audio);
    } catch (error) {
      attempts--;
      await logWarning (error);
    }
  }
  if (response == undefined || response.data == undefined || base64Audio == undefined) {
    await logWarning ('Undefined response in transcribeAudio');
    return '';
  }
  // The audio data is encoded as an ArrayBuffer

  const speechClient = new speech.SpeechClient ();

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
  const [transcriptionData] = await speechClient.recognize (request);
  const transcription = transcriptionData.results
      .map ((result) => result.alternatives[0].transcript)
      .join ('\n');

  return transcription;
}

module.exports = transcribeAudio;
