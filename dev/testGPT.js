// Import Firebase modules
const admin = require('firebase-admin');
admin.initializeApp();
const { logDebug, logWarning } = require('../routes/utils/logging');

// Express and other previous modules
const path = require('path');
const config = require("../config/config.js");
const fs = require('fs');

process.env.GOOGLE_APPLICATION_CREDENTIALS = "../config/service_keys/call-to-action-2afc3-82ae4cc2b811.json";
process.env.DEV = true;
process.env.DEBUG = true;

const domain = config.prod.app.domains[0];
const bucket = admin.storage().bucket('gs://call-to-action-2afc3.appspot.com/');
const { askGPT } = require("../routes/LLM/askLLM");
const { getDefaultSystemIntelSecretary, defaultSystemHasInfo, defaultSystemIntelFunctions } = require('../routes/LLM/defaultSystemIntel');
const { fixOutput, makeTranscript, validateLLMOutput } = require ('../routes/LLM/LLMUtils'); 

const getSecret = require('../routes/security/secrets.js');
const { loadLLMFunctions, loadLLMFunctionsDetails } = require ("../routes/LLM/LLMUtils");

// console.log(gptFunctions);


const model = "gpt-3.5-turbo-0613";
// const model = "gpt-4-0613";

global.logDebug = logDebug;
global.logWarning = logWarning;

async function frame (messages) {
  // initial call
  // logDebug("Frame: Start");
  let functionResponseMessage;
  var output = await askGPT(messages, model);
  output.content = await fixOutput(output.content);
  messages.push(output);
  console.log ("FRAME: ", messages);
  // this means the secretary wants to go to the functions
  // this makes sure that they are actually ready to do that.
  if (global.useCritics) {
    if (output.content.toLowerCase().startsWith("proceed to functions")) {
      validatedLLMData = await validateLLMOutput(messages, global.LLMFunctionDetails);

      if (!validatedLLMData) {
        logWarning("Frame validatedLLMData was undefined");
        return;
      }
      
      // make sure it should be ready for the function 
      if (validatedLLMData.proceed) {
        functionResponseMessage = await global.LLMFunctions[validatedLLMData.parsedLLMData.action.value].execute(validatedLLMData.parsedLLMData);
      }
    } 
    
    // this means the secretary asked another question
    // this will see if they asked a good question through a critic system. if they didnt, it will reprompt
    else if (output.content.toLowerCase().includes("question: ")){
      // validatedLLMData = await validateLLMOutput(messages, global.LLMFunctionDetails);
      // if (!validatedLLMData) {
      //   logWarning("Frame validatedLLMData was undefined");
      //   return;
      // }
      
      // // make sure it should be asking a question
      // if (!validatedLLMData.proceed) {

      // }
    }

    // this means the secretary answered a question. No further action is necessary
    else {
      logDebug("Frame: Answered question");
    }
  }

  // logDebug("Frame: End");
  return messages;
}

const readline = require('readline');
const { exit } = require('process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getUserInput(questionText) {
  return new Promise(resolve => rl.question(questionText, answer => resolve(answer)));
}

async function runTest (content) {
  const defaultSystemIntelSecretary = getDefaultSystemIntelSecretary(global.LLMFunctionDetails);
  if (!defaultSystemIntelSecretary) {
    console.log ("An error occured in default system info.");
    return; 
  }
  var messages = [
    defaultSystemIntelSecretary, 
    {
      role: 'user',
      content: content
    }
  ];

  // chat feature
  if (global.chat) {
    while(true) {
      let response = await frame (messages);
      console.log(response);
      let transcript = await makeTranscript(response);
      logDebug (transcript)
      
      console.log ("ENTER ", response[response.length - 1]);
      var input;
      if (response[response.length - 1].role !== 'user') {
        input = await getUserInput('Enter your message: ');
      }
      
      if(input === 'exit') {
        return messages;
      } else {
        if (input) {
          messages.push(
            {
              role: 'user',
              content: input
            }
          );
        }
      }
    }
  } else {
    let response = await frame (messages);

    let transcript = await makeTranscript(response);
    logDebug (transcript)
  }
}

async function testNoCall() {
  // for no function call
  console.log("\n\nTestNoCall: ");
  queries = [
    "What is the square root of 2?",
    "Is broccoli considered good for you?"
  ];
  for (var i = 0; i < queries.length; i++) {
    await runTest(queries[i]);
  }
}

async function testSearch() {
  console.log("\n\nTestSearch: ");
  queries = [
    "What is the closest in n out to UCR",
    "What is the closest in n out to my college"
  ];

  for (var i = 0; i < queries.length; i++) {
    await runTest(queries[i]);
  }
}

async function testAppointment() {
  console.log("\n\nTestAppointment: ");
  queries = [
    // "Make an appointment at the eye doctor at for june 3rd at 2.",
    "Make an appointment at the Evergreen Health for a physical for june 3rd at 2.",
    "Make an appointment at the Duvall Eye Care for a regular eye checkup for june 3rd at 2."
  ];

  for (var i = 0; i < queries.length; i++) {
    await runTest(queries[i]);
  }
}

async function testOrder() {
  console.log("\n\nTestOrder: ");
  queries = [
    // "Can you order me a pepperoni and sausage pizza from dominos? I also want there to be pineapple on there, and it should be ready as soon as possible.",
    // "Can you order me a pepperoni and sausage pizza from dominos? I also want there to be pineapple on there.",
    "Can you order me a pepperoni and sausage pizza from dominos? Have it delivered to my work.'",
    "Can you order me a pepperoni and sausage pizza from the dominos in redmond washington? I also want there to be pineapple on there. I'll go pick it up."
  ];

  for (var i = 0; i < queries.length; i++) {
    await runTest(queries[i]);
  }
}

async function testAI() {
  console.log("\n\nTestAI: ");
  queries = [
    "Are you an AI?",
    "What do you do as an AI?",
    "What are your tasks?",
    // "What are your thought on the war in afghanistan and what should the US there?"
  ];

  for (var i = 0; i < queries.length; i++) {
    await runTest(queries[i]);
  }
}

async function testGPT() {
  global.LLMFunctions = await loadLLMFunctions("../routes/LLM/LLMFunctions/default")
  global.LLMFunctionDetails = await loadLLMFunctionsDetails(global.LLMFunctions);
  global.bingAuth = await getSecret('bing');
  global.twilioAuth = await getSecret('twilio');
  global.twilioSID = await getSecret('twilio', 'sid');
  global.openAIAuth = await getSecret("openAI");
  global.elevenLabsAuth = await getSecret('elevenLabs');
  global.useCritics = true;
  global.chat = true;

  // await testNoCall();
  await testSearch();
  // await testAppointment();
  // await testOrder();
  // await testAI();
  exit();
}


testGPT();

// there is some weird race condition at voice.textToSpeech, and I am unsure why that is the case.