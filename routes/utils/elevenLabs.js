const getSecret = require('../security/secrets');
const path = require('path');
const config = require("../../config/config.js");
const axios = require('axios');
const fs = require('fs');
const os = require('os');

// Import Firebase modules
const admin = require('firebase-admin');
const bucket = admin.storage().bucket('gs://call-to-action-2afc3.appspot.com/');

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
  
  await logWarning("Making the audio file at: ", audioFilePath);

  try {
    let result = await textToSpeech(apiKey, voiceID, audioFilePath, text, 0.2, 0.7);
    await logWarning(`Successfully created audio file at: ${audioFilePath} and the result was ${result.status}`);
  } catch (error) {
    console.error(`Failed to create audio file at: ${audioFilePath}`, error.message);
  }

  // Upload the file to Firebase Storage
  await bucket.upload(audioFilePath, {
    destination: `${filePath}`,
  }).catch(e => console.error(e));;

  // Delete the local file after it's uploaded
  const AIvoiceMessagePath = `${global.domain}/getAudio/${filePath}`
  return AIvoiceMessagePath;
}

async function textToSpeech (apiKey, voiceID, fileName, textInput, stability, similarityBoost, modelId) {
	try {

		if (!apiKey || !voiceID || !fileName || !textInput) {
			await logWarning('ERR: Missing parameter');
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
		await logWarning(error.message);
	}
};

module.exports = {
  generateAiVoiceMessage,
  textToSpeech 
};