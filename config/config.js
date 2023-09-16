exports.dev =
{
  app: {
    port: 8080,
    domain: 'https://a052-24-180-53-236.ngrok.io',
  },
};

exports.prod =
{
  app: {
    port: 3000,
    name: 'Website Name',
    domains: [ // add as many as you want
      'https://call-to-action-2afc3.web.app',
      'https://call-to-action-2afc3.firebaseapp.com',
    ],
  },
  googleSecrets: { // all necessary
    projectID: 643217092679,
    projectName: 'call-to-action-2afc3',
    bing: {
      auth: 'Bing',
    },
    openAI: {
      auth: 'OpenAI',
    },
    twilio: {
      sid: 'Twilio-SID',
      auth: 'Twilio-Auth',
    },
    elevenLabs: {
      auth: 'ElevenLabs',
      api: 'https://api.elevenlabs.io/v1',
    },
    test: {
      auth: 'test',
    },
  },
  firebase: {

  },
};
