
const fs = require ('fs');
const { ElevenLabs } = require ('../../routes/audio/elevenLabs');

const getSecret = require('../../routes/security/secrets.js');

const admin = require('firebase-admin');
const config = require("../../config/config.js");

const serviceAccountPath = "../../config/service_keys/call-to-action-2afc3-82ae4cc2b811.json";
process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;
// Read the file and parse it into an object
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential:  credential.cert(serviceAccount)
});

global.domain = config.dev.app.domain;

getSecret('elevenLabs').then(async (value) => {
  global.elevenLabsAuth = value;
  var elevenLabsWS = await ElevenLabs.create(global.elevenLabsAuth);
  if (!elevenLabsWS) {
    console.log ("ded");
  } else {
    elevenLabsWS.sendData("Hello World");
    await elevenLabsWS.reset();
    elevenLabsWS.sendData("second message!");
    await elevenLabsWS.reset();
    elevenLabsWS.sendData("Answer: Yes, broccoli is considered to be good for you. It is a nutritious vegetable that is low in calories and high in vitamins and minerals.");
    elevenLabsWS.closeConnection();
  }
});