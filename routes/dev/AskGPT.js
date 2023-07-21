const config = require("../../config/config.js");
const functions = require("firebase-functions");
const {SecretManagerServiceClient} = require("@google-cloud/secret-manager");
const { Configuration, OpenAIApi } = require("openai");

const secrets = new SecretManagerServiceClient();

async function getSecret() {
  const secretVersionName = `projects/${config.prod.googleSecrets.projectID}/secrets/${config.prod.googleSecrets.openAI.auth}/versions/latest`;
  const [version] = await secrets.accessSecretVersion({name: secretVersionName});
  return version.payload.data.toString("utf8");
}

exports.AskGPT = functions.https.onCall(async (data, context) => {
  if (!config.prod.app.domains.includes(context.rawRequest.header("Origin"))) {
    throw new functions.https.HttpsError("permission-denied", "Unauthorized access");
  }

  let apiKey;
  try {
    apiKey = await getSecret();
  } catch (err) {
    functions.logger.error('Error retrieving key: ', err);
    throw new functions.https.HttpsError("internal", "Communication with LLM is broken, please try again later.");
  }

  const configuration = new Configuration({apiKey});
  const openai = new OpenAIApi(configuration);

  // Check user authentication and choose the model
  const model = context.auth ? "gpt-4" : "gpt-3.5-turbo";

  const messages = [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": data.prompt
    }
  ];

  let response;
  try {
    response = await openai.createChatCompletion({
      model,
      messages,
      max_tokens: 1000,
    });
  } catch (err) {
    functions.logger.error('OpenAI API call failed: ', err);
    throw new functions.https.HttpsError("internal", "Communication with LLM is broken, please try again later.");
  }

  functions.logger.log("Open AI Call using", model, ": ", response);
  return response.data.choices[0].message.content;
});
