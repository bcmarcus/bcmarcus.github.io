// Import Firebase modules
const admin = require('firebase-admin');
admin.initializeApp();
const functions = require('firebase-functions');

// Express and other previous modules
const path = require('path');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const config = require("../../config/config.js");
const axios = require('axios');

const os = require('os');
const fs = require('fs');

process.env.GOOGLE_APPLICATION_CREDENTIALS = "../service_keys/call-to-action-2afc3-82ae4cc2b811.json";

const secrets = new SecretManagerServiceClient();
const domain = config.prod.app.domains[0];
const bucket = admin.storage().bucket('gs://call-to-action-2afc3.appspot.com/');

async function getSecret(secretName, type="auth") {
  const secretVersionName = `projects/${config.prod.googleSecrets.projectID}/secrets/${config.prod.googleSecrets[secretName][type]}/versions/latest`;
  const [version] = await secrets.accessSecretVersion({ name: secretVersionName });
  return version.payload.data.toString("utf8");
}

async function generateAiVoiceMessage(text, filePath) {
  const apiKey = await getSecret('elevenLabs');
  const voiceID = '21m00Tcm4TlvDq8ikWAM';

  const tempDir = path.join(os.tmpdir(), path.dirname(filePath));
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const audioFilePath = path.join(os.tmpdir(), filePath);  

  if (fs.existsSync(audioFilePath)) {
    fs.unlinkSync(audioFilePath);
  }
  
  console.log("Making the audio file at: ", audioFilePath);


  // there is some weird race condition here

  try {
    let result = await textToSpeech(apiKey, voiceID, audioFilePath, text, 0.2, 0.7);
    console.log(`Successfully created audio file at: ${audioFilePath} and the result was ${result.status}`);
  } catch (error) {
    console.error(`Failed to create audio file at: ${audioFilePath}`, error);
  }

  // Upload the file to Firebase Storage
  await bucket.upload(audioFilePath, {
    destination: `${filePath}`,
  }).catch(e => console.error(e));;

  // Delete the local file after it's uploaded
  const AIvoiceMessagePath = `${domain}/getAudio/${filePath}`
  return AIvoiceMessagePath;
}

async function textToSpeech (apiKey, voiceID, fileName, textInput, stability, similarityBoost, modelId) {
	try {

		if (!apiKey || !voiceID || !fileName || !textInput) {
			console.log('ERR: Missing parameter');
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
        console.error(error.message);
        reject(error);
      });
    });


	} catch (error) {
		console.log(error.message);
	}
};

// async function getFile(filePath) {
//   if (filePath.startsWith('getAudio/')) {
//     filePath = filePath.substring('getAudio/'.length);
//   }

//   console.log("Getting audio at: ", filePath);

//   return bucket.file(filePath);
// }

// ** FUNCTIONS ** //
// ** ENDPOINTS ** //

async function reset() {
  const helloText = "Hello, how can I be of assistance?";
  const helloFilePath = "default/hello.mp3";
  const helloURL = await generateAiVoiceMessage(helloText, helloFilePath);
  console.log("Hello message set at url:", helloURL, "\n");

  const thinking1Text = "Working on that.";
  const thinking1FilePath = "default/thinking1.mp3";
  const thinking1URL = await generateAiVoiceMessage(thinking1Text, thinking1FilePath);
  console.log("Thinking1 message set at url:", thinking1URL, "\n");

  const thinking2Text = "Thinking...";
  const thinking2FilePath = "default/thinking2.mp3";
  const thinking2URL = await generateAiVoiceMessage(thinking2Text, thinking2FilePath);
  console.log("Thinking2 message set at url:", thinking2URL, "\n");

  const goodbyeText = "Goodbye!";
  const goodbyeFilePath = "default/goodbye.mp3";
  const goodbyeURL = await generateAiVoiceMessage(goodbyeText, goodbyeFilePath);
  console.log("Goodbye message set at url:", goodbyeURL, "\n");

  const tryAgainLaterText = "I'm sorry, let me get back to you on that.";
  const tryAgainLaterFilePath = "default/tryAgainLater.mp3";
  const tryAgainLaterURL = await generateAiVoiceMessage(tryAgainLaterText, tryAgainLaterFilePath);
  console.log("Try again later message set at url:", tryAgainLaterURL, "\n");
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


reset();


// there is some weird race condition at voice.textToSpeech, and I am unsure why that is the case.