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
      "https://example.com",
      "https://example.store"
    ]  
  },
  googleSecrets: { // all necessary
    openAI: {
      projectID: 123456789,
      secretName: "OpenAI",
    },
  },
};
