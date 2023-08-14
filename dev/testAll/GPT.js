const OpenAI = require ('openAI');

const { logDebug, logWarning } = require ("../../routes/utils/logging");

process.env.GOOGLE_APPLICATION_CREDENTIALS = "../../../config/service_keys/call-to-action-2afc3-82ae4cc2b811.json";
process.env.DEV = true;
process.env.DEBUG = true;

async function prepareGPT (messages, model, callFunctions, functions) {
  if (messages === undefined || model === undefined || callFunctions === undefined) {
    logWarning("PrepareGPT: Invalid Parameters\n", messages, model, callFunctions);
    return false;
  }

  const options = {
    model,
    messages,
    max_tokens: 500
  }
  if (functions) {
    options.functions = functions;
    options.function_call = callFunctions;
  } 

  return options;
}

async function askGPT (messages, model="gpt-3.5-turbo-0613", callFunctions="none", functions = undefined) {
  options = prepareGPT(messages, model, callFunctions, functions)
  if (!options) {
    return false;
  }

  var GPTresponse;
  try {
    let apiKey;
    try {
      apiKey = global.openAIAuth;
    } catch (err) {
      throw new Error("Failed to retrieve OpenAI key from Secret Manager");
    }

    const openai = new OpenAI({apiKey: apiKey});
    GPTresponse = await openai.createChatCompletion(options);
  } catch (err) {
    await logWarning(err.message);
    throw new Error("Failed to call OpenAI API");
  }

  return GPTresponse;
}

// returns the stream.
async function askGPTStream(messages, model="gpt-3.5-turbo-0613", callFunctions="none", functions = undefined) {
  options = prepareGPT(messages, model, callFunctions, functions)
  if (!options) {
    return false;
  }

  let apiKey;
  try {
    apiKey = global.openAIAuth;
  } catch (err) {
    throw new Error("Failed to retrieve OpenAI key from Secret Manager");
  }

  const openai = new OpenAI({apiKey: apiKey});

  if (!messages) {
    console.warn ("Bad call to askGPT.");
    return "";
  }

  let response;
  try {
    const options = {
      model,
      messages,
      max_tokens: 500
    }
    if (functions) {
      options.functions = functions;
      options.function_call = callFunctions;
    } 

    // Streaming:
    const stream = await openai.chat.completions.create({
      ...options,
      stream: true,
    });
    return stream;

  } catch (err) {
    console.warn(err.message);
    throw new Error("Failed to call OpenAI API");
  }
}

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function capitalizeFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function makeTranscript (messages) {
  var transcript = "";

  // preprocessing transcript for GPT
  for (let j = 1; j < messages.length; j++) {
    let role = messages[j].role === 'assistant' ? "Secretary" : capitalizeFirst(messages[j].role);
    var add = role + ": " + messages[j].content + "\n";
    transcript += add;
  }

  return transcript;
}

module.exports = { askGPTStream, makeTranscript };


// const { defaultSystemIntelSecretary, defaultSystemHasInfo, defaultSystemIntelFunctions } = require('../../GPT/defaultSystemIntel');

// content = "Hello, how are you.";

// var messages = [
//   defaultSystemIntelSecretary, 
//   {
//     role: 'user',
//     content: content
//   }
// ];

// chat (messages);