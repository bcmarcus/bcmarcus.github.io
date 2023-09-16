const admin = require('firebase-admin');
const fs = require('fs');
const port = process.env.PORT || 8080;
const config = require("../../config/config.js");


if (process.env.DEV) {
  // Get the file path from the environment variable
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  // Read the file and parse it into an object
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  global.domain = config.dev.app.domain;
} else {
  global.domain = config.prod.app.domains[0];
  admin.initializeApp();
}

// -- GLOBALS -- //
const googleCloudRouter = require('../../routes/googleCloud/googleCloudRouter');
const twilioRouter = require('../../routes/twilio/twilioRouter');
const date = require('../../routes/utils/date');
const createTwilioClient = require('../../routes/twilio/twilioUtils');
const { logDebug, logWarning } = require('../../routes/utils/logging');
const getSecret = require('../../routes/security/secrets.js');

global.storageDomain = config.prod.app.domains[0];
global.logDebug = logDebug;
global.logWarning = logWarning;

// This is probably bad form for secrets, but alas
// -- SECRETS -- //
Promise.all([getSecret('twilio'), getSecret('twilio', 'sid'), getSecret("openAI"), getSecret('elevenLabs')])
  .then(([twilioAuth, twilioSID, openAIAuth, elevenLabsAuth]) => {
    global.twilioAuth = twilioAuth;
    global.twilioSID = twilioSID;
    global.openAIAuth = openAIAuth;
    global.elevenLabsAuth = elevenLabsAuth;
    
    const twilioClient = createTwilioClient()
    global.twilioClient = twilioClient;

    // -- EXPRESS -- //
    const express = require('express');

    const app = express();
    app.use(express.json()); // for parsing application/json
    app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    // add "/route" as first param if needed
    app.use(googleCloudRouter);
    app.use(twilioRouter);
    app.use(date);

    app.listen(port, async () => {
      await logDebug(`Server is running on port ${port}`);
    });
    // -- EXPRESS -- //
  })
  .catch(error => {
    logWarning('Error:', error.message).then(() => {console.log(error.message)});
    return;
  });

// -- SECRETS -- //

// -- GLOBALS -- //