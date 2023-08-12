const OpenAI = require ('openAI');
const fs = require ('fs');
const path = require ('path');

const winkNLP = require('wink-nlp');
const its = require('wink-nlp/src/its.js');
const model = require('wink-eng-lite-web-model');
const nlp = winkNLP(model);

process.env.GOOGLE_APPLICATION_CREDENTIALS = "../../../config/service_keys/call-to-action-2afc3-82ae4cc2b811.json";
process.env.DEV = true;
process.env.DEBUG = true;

async function askGPT(messages, model="gpt-3.5-turbo-0613", callFunctions="none", functions = undefined) {

  let apiKey;
  try {
    apiKey = global.openAIAuth;
  } catch (err) {
    throw new Error("Failed to retrieve key from Secret Manager");
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

    // Non-streaming:
    // response = await openai.chat.completions.create(options);
    // console.log(response.choices[0]?.message?.content);

    // Streaming:
    const stream = await openai.chat.completions.create({
      ...options,
      stream: true,
    });
    var fullText = '';
    var text = '';
    var sentences;
    for await (const part of stream) {
      let chunk = part.choices[0]?.delta?.content || '';
      text += part.choices[0]?.delta?.content || '';
      fullText += chunk;
      // process.stdout.write(part.choices[0]?.delta?.content || '');
      const doc = nlp.readDoc(text);
      sentences = doc.sentences().out();
      if (sentences.length > 1) {
        doStuff (sentences[0]);
        text = text.replace(sentences[0], '').trim();
      }
      console.log (sentences);
    }
    process.stdout.write('\n');

  } catch (err) {
    console.warn(err.message);
    throw new Error("Failed to call OpenAI API");
  }

  if (sentences [0]) {
    doStuff (sentences[0]);
  }
  return  { role: 'assistant', content: fullText };
  // return response.data.choices[0].message;
}

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


async function doStuff (sentence) {
  console.log ("This function does stuff with the sentence provided: ", sentence, "\n");
}
// module.exports = askGPT;
function getUserInput(questionText) {
  return new Promise(resolve => rl.question(questionText, answer => resolve(answer)));
}

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

async function chat (messages) {
  const getSecret = require('../../../routes/security/secrets.js');
  global.openAIAuth = await getSecret("openAI");

  while(true) {
    let response = await askGPT (messages);
    messages.push(response);
    let transcript = await makeTranscript(messages);
    console.log (transcript)

    var input = await getUserInput('Enter your message: ');
    
    if(input === 'exit') {
      return messages;
    } else {
      messages.push(
        {
          role: 'user',
          content: input
        }
      );
    }
  }
};


const { defaultSystemIntelSecretary, defaultSystemHasInfo, defaultSystemIntelFunctions } = require('../../GPT/defaultSystemIntel');

content = "Hello, how are you.";

var messages = [
  defaultSystemIntelSecretary, 
  {
    role: 'user',
    content: content
  }
];

chat (messages);