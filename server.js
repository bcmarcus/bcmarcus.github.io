// -- System Modules -- //
const fs = require ('fs');
const http = require ('http');

// -- Firebase and Security -- //
const admin = require ('firebase-admin');
const config = require ('./config/config.js');

if (process.env.DEV) {
  // Get the file path from the environment variable
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  // Read the file and parse it into an object
  const serviceAccount = JSON.parse (fs.readFileSync (serviceAccountPath, 'utf8'));

  admin.initializeApp ({
    credential: admin.credential.cert (serviceAccount),
  });

  global.domain = config.dev.app.domain;
} else {
  global.domain = config.prod.app.domains[0];
  admin.initializeApp ();
}

// -- NPM Modules -- //
const express = require ('express');

// -- Custom Modules -- //
const { createTwilioClient } = require ('./routes/twilio/twilioUtils');
const getSecret = require ('./routes/security/secrets.js');
const googleCloudRouter = require ('./routes/googleCloud/googleCloudRouter');
const { loadLLMFunctions, loadLLMFunctionsMetadata } = require ('./routes/LLM/helpers/load.js');
const { logDev, logWarning, logError } = require ('./routes/utils/logging');
const twilioRouter = require ('./routes/twilio/twilioRouter');
const { handleAnswerCallUpgrade } = require ('./routes/twilio/call/callWSS');

// -- Express app setup -- //
const app = express ();
app.use (express.json ()); // for parsing application/json
app.use (express.urlencoded ({ extended: true })); // for parsing application/x-www-form-urlencoded
const server = http.createServer (app);

const port = process.env.PORT || 8080;

// -- Globals -- //
global.storageDomain = config.prod.app.domains[0];

/**
  * Initializes the server and sets up environment variables, global variables, and server routes.
  * In development mode, it fetches secrets for various services and checks if they are properly initialized.
  * It also loads default LLM functions and their metadata, creates a Twilio client, and checks if these globals are properly initialized.
  * If any environment or global variables are not properly initialized, it logs a warning.
  * It sets up express to parse JSON and URL-encoded bodies, and sets up routes for Google Cloud and Twilio.
  * It also sets up a WebSocket upgrade handler for handling calls.
  * Finally, it starts the server and logs the port it's running on.
  * @async
  * @function init
  * @throws {Error} If an error occurs while initializing the server.
  */
async function init () {
  if (process.env.DEV) {
    await Promise.all ([
      getSecret ('bing'),
      getSecret ('twilio'),
      getSecret ('twilio', 'sid'),
      getSecret ('openAI'),
      getSecret ('elevenLabs'),
    ]).then (([bingAuth, twilioAuth, twilioSID, openAIAuth, elevenLabsAuth]) => {
      process.env.bingAuth = bingAuth;
      process.env.twilioAuth = twilioAuth;
      process.env.twilioSID = twilioSID;
      process.env.openAIAuth = openAIAuth;
      process.env.elevenLabsAuth = elevenLabsAuth;

      const envKeys = [
        'bingAuth',
        'twilioAuth',
        'twilioSID',
        'openAIAuth',
        'elevenLabsAuth',
      ];

      const falsyEnvKeys = envKeys.filter ((key) => !process.env[key]);

      if (falsyEnvKeys.length > 0) {
        logWarning (`Env variables not properly initialized: ${falsyEnvKeys}`).then ();
        return;
      }
    });
  }


  await Promise.all (
      [
        loadLLMFunctions ('./routes/LLM//default'),
      ])
      .then (async (
          [
            defaultLLMFunctions,
          ]) => {
        global.defaultLLMFunctions = defaultLLMFunctions;
        global.defaultLLMFunctionMetadata = await loadLLMFunctionsMetadata (global.defaultLLMFunctions);
        const twilioClient = createTwilioClient ();
        global.twilioClient = twilioClient;

        const globalKeys = [
          'defaultLLMFunctions',
          'defaultLLMFunctionMetadata',
          'twilioClient',
        ];

        const falsyGlobalKeys = globalKeys.filter ((key) => !global[key]);
        if (falsyGlobalKeys.length > 0) {
          logWarning (`Env variables not properly initialized: ${falsyGlobalKeys}`);
          return;
        }
      })
      .catch ((error) => {
        logError (`Server js error`, error).then ();
        return;
      });

  // -- EXPRESS -- //
  app.use (express.json ()); // for parsing application/json
  app.use (express.urlencoded ({ extended: true })); // for parsing application/x-www-form-urlencoded

  // add "/route" as first param if needed
  app.use (googleCloudRouter);
  app.use (twilioRouter);

  server.on ('upgrade', (request, twilioWS, head) => {
    if (request.url === '/call') {
      handleAnswerCallUpgrade (request, twilioWS, head);
    } else {
      logWarning (`Request URL not found: ${request.url}`);
      twilioWS.destroy ();
    }
  });

  server.listen (port, async () => {
    logDev (`Server is running on port ${port}`);
  });
}

init ();
