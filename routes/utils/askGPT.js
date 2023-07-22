const getSecret = require('../security/secrets');
const { OpenAIApi, Configuration } = require('openai');

async function askGPT(data) {
  let apiKey;
  try {
    apiKey = await getSecret("openAI");
  } catch (err) {
    throw new Error("Failed to retrieve key from Secret Manager");
  }

  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  const model = "gpt-3.5-turbo-0613";

  const messages = [
    {
      "role": "system",
      "content": "You are a helpful assistant. Respond very concisely, in 5 sentences or less.",
    },
    {
      "role": "user",
      "content": data,
    },
  ];

  let response;
  try {
    response = await openai.createChatCompletion({
      model,
      messages,
      max_tokens: 200,
    });
  } catch (err) {
    await logWarning(err.message);
    throw new Error("Failed to call OpenAI API");
  }

  return response.data.choices[0].message.content;
}

module.exports = askGPT;