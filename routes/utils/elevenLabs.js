const config = require("../../config/config.js");
const axios = require('axios');

// Import Firebase modules
const admin = require('firebase-admin');
const bucket = admin.storage().bucket('gs://call-to-action-2afc3.appspot.com/');

async function generateAiVoiceMessage(text, filePath) {
  const apiKey = global.elevenLabsAuth;
  const voiceID = '21m00Tcm4TlvDq8ikWAM';
  
  await logDebug("Making the audio file at: ", filePath);

  try {
    let audioData = await textToSpeech(apiKey, voiceID, text, 0.2, 0.7);
    await uploadToFirebase(audioData, filePath);
    await logDebug(`Successfully created audio file at: ${filePath}`);
  } catch (error) {
    await logWarning(`Failed to create audio file at: ${filePath}`, error.message);
  }

  const AIvoiceMessagePath = `${global.storageDomain}/getAudio/${filePath}`
  return AIvoiceMessagePath;
}

async function textToSpeech (apiKey, voiceID, textInput, stability, similarityBoost, modelId) {
	try {

		if (!apiKey || !voiceID || !textInput) {
			await logWarning('ERR: Missing parameter');
		}

		const voiceURL = `${config.prod.googleSecrets.elevenLabs.api}/text-to-speech/${voiceID}`;
		const stabilityValue = stability ? stability : 0;
		const similarityBoostValue = similarityBoost ? similarityBoost : 0;

    const options = {
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
		};

		const response = await axios.request(options);
    return response.data;

	} catch (error) {
		await logWarning(error.message);
	}
};

async function uploadToFirebase (audioData, filePath) {
  const file = bucket.file(filePath);
  
  // Convert Buffer to Readable Stream
  const readableStream = require('stream').Readable.from(audioData);

  return new Promise((resolve, reject) => {
    readableStream
    .pipe(file.createWriteStream({
      metadata: {
        contentType: 'audio/mpeg'
      }
    }))
    .on('error', async (error) => {
      await logWarning('ERROR:', error);
      reject(error);
    })
    .on('finish', async () => {
      await logDebug (`Audio content written to file: ${filePath}`);
      resolve();
    });
  });
};

module.exports = {
  generateAiVoiceMessage,
  textToSpeech 
};