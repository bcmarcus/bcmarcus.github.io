exports.dev =
{
  app: {
    port: 3000,
    domain: "localhost",
  },
};

exports.prod =
{
  app: {
    port: 3000,
    name: "Website Name",
    domains: [ // add as many as you want
      "https://d89b-152-44-212-248.ngrok.io",
      "https://call-to-action-2afc3.web.app",
      "https://call-to-action-2afc3.firebaseapp.com"
    ]  
  },
  googleSecrets: { // all necessary
    projectID: 643217092679,
    projectName: "call-to-action-2afc3",
    openAI: {
      auth: "OpenAI",
    },
    twilio: {
      sid: "Twilio-SID",
      auth: "Twilio-Auth"
    },
    elevenLabs: {
      auth: "ElevenLabs",
      api: 'https://api.elevenlabs.io/v1'
    }
  },
};
