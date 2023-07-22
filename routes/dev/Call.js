const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const { OpenAIApi, Configuration } = require('openai');
const config = require("../../config/config.js");
const axios = require('axios');
const speech = require('@google-cloud/speech');
const twilio = require('twilio');
const fs = require('fs');

process.env.GOOGLE_APPLICATION_CREDENTIALS = "../service_keys/call-to-action-2afc3-82ae4cc2b811.json";

const secrets = new SecretManagerServiceClient();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/audio', express.static('audio'));

// ** FUNCTIONS ** //

async function getSecret(secretName, type="auth") {
  const secretVersionName = `projects/${config.prod.googleSecrets.projectID}/secrets/${config.prod.googleSecrets[secretName][type]}/versions/latest`;
  const [version] = await secrets.accessSecretVersion({ name: secretVersionName });
  return version.payload.data.toString("utf8");
}

function authorizeUser(incomingNumber, res) {
  const authorizedNumbers = ["+14256145153"];

  if (!authorizedNumbers.includes(incomingNumber)) {
    const twiml = new VoiceResponse();
    twiml.say("Unauthorized Number Detected. Goodbye.");
    twiml.hangup(); // End the call
    res.set('Content-Type', 'text/xml');
    res.send(twiml.toString());
    return false;
  }
  return true;
}

async function createTwilioClientAndUpdateCall() {
  const twilioAuth = await getSecret('twilio');
  const twilioSID = await getSecret('twilio', 'sid')

  const client = twilio(twilioSID, twilioAuth);
  return client;
}

function callAndResponse (AIvoiceMessageUrl, res) {
  const twiml = new VoiceResponse();
  twiml.play({}, AIvoiceMessageUrl);
  twiml.pause({ length: 1 });
  twiml.record({ 
    action: `${global.domain}/callLoop`,
    maxLength: 20,
    timeout: 1,
    playBeep: false
  });

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

async function callAndResponseOverride (AIvoiceMessageUrl, req) {
  const twiml = new VoiceResponse();
  twiml.play({}, AIvoiceMessageUrl);
  twiml.pause({ length: 1 });
  twiml.record({ 
    action: `${global.domain}/callLoop`,
    maxLength: 20,
    timeout: 1,
    playBeep: false
  });

  const client = await createTwilioClientAndUpdateCall();
  await client.calls(req.body.CallSid).update({
    twiml: twiml.toString(),
  });
}

async function textToSpeech (apiKey, voiceID, fileName, textInput, stability, similarityBoost, modelId) {
	try {
		if (!apiKey || !voiceID || !fileName || !textInput) {
			throw new Error('Missing parameter in textToSpeech function');
		}

		const voiceURL = `${config.prod.googleSecrets.elevenLabs.api}/text-to-speech/${voiceID}`;
		const stabilityValue = stability ? stability : 0;
		const similarityBoostValue = similarityBoost ? similarityBoost : 0;

		const response = await axios({
			method: 'POST',
			url: voiceURL,
			data: {
				text: textInput,
				voice_settings: {
					stability: stabilityValue,
					similarity_boost: similarityBoostValue
				},
				model_id: modelId ? modelId : undefined
			},
			headers: {
				'Accept': 'audio/mpeg',
				'xi-api-key': apiKey,
				'Content-Type': 'application/json',
			},
			responseType: 'stream'
		});

		const writeStream = response.data.pipe(fs.createWriteStream(fileName));

		return new Promise((resolve, reject) => {
			writeStream.on('close', () => {
				resolve({status: 'ok'});
			});

			writeStream.on('error', error => {
				throw new Error('Error writing to stream in textToSpeech function: ' + error);
			});
		});


  } catch (error) {
    console.log(`[textToSpeech] Error: ${error.message}`);
    throw error;
  }
};

async function AskGPT(data) {
  let apiKey;
  try {
    apiKey = await getSecret("openAI");
  } catch (err) {
    throw new Error("Failed to retrieve key from Secret Manager");
  }

  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  const model = "gpt-3.5-turbo-0613";

  const messages = [
    {
      "role": "system",
      "content": "You are a helpful assistant. Respond very concisely, in 5 sentences or less.",
    },
    {
      "role": "user",
      "content": data,
    },
  ];

  let response;
  try {
    response = await openai.createChatCompletion({
      model,
      messages,
      max_tokens: 200,
    });
  } catch (err) {
    console.log(err.message);
    throw new Error("Failed to call OpenAI API");
  }

  return response.data.choices[0].message.content;
}

async function generateAiVoiceMessage(text) {
  const apiKey = await getSecret('elevenLabs');
  const voiceID = '21m00Tcm4TlvDq8ikWAM';
  const audioFileName = 'audio.mp3';
  const audioFileFolder = 'audio';
  const audioFilePath = path.join(__dirname, audioFileFolder, audioFileName);

  await textToSpeech(apiKey, voiceID, audioFilePath, text, 0.2, 0.7);

  const AIvoiceMessageUrl = `${global.domain}/${path.relative(__dirname, audioFilePath)}`

  // Assuming audioData is a URL to an audio file
  return AIvoiceMessageUrl;
}

async function transcribeAudio(recordingUrl) {
  // Download the audio file from the recording URL
  const response = await axios.get(recordingUrl, {
    responseType: 'arraybuffer'
  });

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

app.post('getAudio', async (req, res) => {
  if (!validateTwilio(req, res)) {
    res.status(401).send('Unauthorized');
    return;
  }

  let filePath = req.params[0];

  if (filePath === undefined) {
    functions.logger.error('Invalid storage file path: ', filePath);
    res.status(400).send('Invalid file path');
    return;
  }

  const file = await getFile(filePath);
  
  // Check if file exists
  file.exists().then(data => {
    const exists = data[0];
    if(!exists){
      functions.logger.error('File does not exist');
      res.status(404).send('Not Found');
      return;
    } 
    else {
      // Set the appropriate content type based on the file extension
      const contentType = getContentType(filePath);
      res.set('Content-Type', contentType);
      functions.logger.warn(contentType);

      // Stream the file content to the response
      file.createReadStream()
      .on('error', function(err) {
        functions.logger.error('Error reading file', err);
        res.status(500).send('Server Error');
      })
      .pipe(res);
    }
  })
  .catch(error => {
    functions.logger.error('Error checking if file exists', error);
    res.status(500).send('Server Error');
  });
});

// ** FUNCTIONS ** //
// ** ENDPOINTS ** //

// This endpoint puts them into the main loop
app.post('/call', async (req, res) => {
  const incomingNumber = req.body.From.trim();

  if (!authorizeUser(incomingNumber, res)) {
    return;
  }

  const introText = "Hello, how can I be of assistance?";
  const AIvoiceMessageUrl = await generateAiVoiceMessage(introText);

  callAndResponse (AIvoiceMessageUrl, res);
});

// This is the main loop
app.post('/transcribe', async (req, res) => {
  const recordingUrl = req.body.RecordingUrl;
  console.log(`Recording available at ${recordingUrl}`);

  // Start the transcription process asynchronously
  const transcriptionPromise = transcribeAudio(recordingUrl);

  // This is the query while waiting for the transcription to process
  const twiml = new VoiceResponse();
  const AIvoiceMessageUrl = await generateAiVoiceMessage('Working on that.');
  twiml.play({}, AIvoiceMessageUrl);
  twiml.pause({ length: 15 });
  twiml.say("I'm sorry, this seems to be taking too long. Please try again later.");
  twiml.hangup();
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());

  // Finish processing the transcription
  const transcription = await transcriptionPromise;
  console.log(transcription);

  // If it is empty, then do one retry, and then hangup
  if (transcription === '') {
    console.log("empty string");
  }

  // If it is not empty, then continue
  else {


    const response = await AskGPT(transcription);
    console.log(`response: ${response}`);

    const AIvoiceMessageUrl = await generateAiVoiceMessage(response);
    console.log (AIvoiceMessageUrl);

    await callAndResponseOverride(AIvoiceMessageUrl, req, res);
  }
});

// ** ENDPOINTS ** //
// ** EXPRESS INITIALIZE ** //

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ** EXPRESS INITIALIZE ** //
