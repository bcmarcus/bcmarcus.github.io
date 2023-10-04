const OpenAI = require ('openai');
const { logWarning } = require ('../../utils/logging');

const gptModel = 'gpt-3.5-turbo-16k';
// const gptModel = "gpt-4-0613";
// const gptModel = 'gpt-4-32k';

/**
  * Prepares the options for the GPT model.
  * @async
  * @function prepareGPT
  * @param {Array} messages - The messages to be processed.
  * @param {string} model - The model to be used.
  * @param {int} temperature - The functions to be called.
  * @throws {Error} If an error occurs while preparing the options.
  */
async function prepareGPT (messages, model, temperature) {
  if (!messages || !model || !temperature) {
    logWarning ('PrepareGPT: Invalid Parameters\n', messages, model);
    return;
  }

  const options = {
    model,
    messages,
    temperature,
    max_tokens: 500,
  };

  return options;
}

/**
  * Asks the GPT model a question and returns the response.
  * @async
  * @function askGPT
  * @param {Array} messages - The messages to be processed.
  * @param {string} model - The model to be used.
  * @param {int} temperature - The functions to be called.
  * @param {Object} functions - The functions to be used.
  * @throws {Error} If an error occurs while asking the GPT model.
  */
async function askGPT (messages, model=gptModel, temperature=0.2) {
  options = await prepareGPT (messages, model, temperature);
  if (!options || Object.keys (options).filter ((key) => key !== 'functions').some ((key) => options[key] === undefined)) {
    logWarning ('Improper values passed into askGPT: ', options);
    return;
  }

  // console.log(options);

  let apiKey;
  try {
    apiKey = process.env.openAIAuth;
  } catch (err) {
    logWarning ('Failed to retrieve OpenAI key from Secret Manager');
    throw new Error ('Failed to retrieve OpenAI key from Secret Manager');
  }

  try {
    const openai = new OpenAI ({ apiKey: apiKey });
    const GPTResponse = await openai.chat.completions.create ({
      ...options,
      stream: false,
    });

    return GPTResponse.choices[0].message;
  } catch (err) {
    await logWarning (err.message);
    throw new Error ('Failed to call OpenAI API');
  }
}

/**
  * Asks the GPT model a question and returns the response as a stream.
  * @async
  * @function askGPTStream
  * @param {Array} messages - The messages to be processed.
  * @param {string} model - The model to be used.
  * @param {int} temperature - The functions to be called.
  * @throws {Error} If an error occurs while asking the GPT model.
  */
async function askGPTStream (messages, model=gptModel, temperature=0.5) {
  options = await prepareGPT (messages, model, temperature);
  if (!options || Object.keys (options).filter ((key) => key !== 'functions').some ((key) => options[key] === undefined)) {
    logWarning ('Improper values passed into askGPT: ', options);
    return;
  }

  let apiKey;
  try {
    apiKey = process.env.openAIAuth;
  } catch (err) {
    throw new Error ('Failed to retrieve OpenAI key from Secret Manager');
  }

  try {
    // Streaming:
    const openai = new OpenAI ({ apiKey: apiKey });
    return await openai.chat.completions.create ({
      ...options,
      stream: true,
    });
  } catch (err) {
    console.warn (err.message);
    throw new Error ('Failed to call OpenAI API');
  }
}

module.exports = {
  prepareGPT,
  askGPT,
  askGPTStream,
};
