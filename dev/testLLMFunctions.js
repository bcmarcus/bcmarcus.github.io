// Import Firebase modules
const admin = require ('firebase-admin');
const { logDev, logWarning } = require ('../routes/utils/logging');

// Express and other previous modules
const path = require ('path');
const config = require ('../config/config.js');
const fs = require ('fs');

process.env.GOOGLE_APPLICATION_CREDENTIALS = '../config/service_keys/call-to-action-2afc3-82ae4cc2b811.json';
process.env.DEV = true;
admin.initializeApp ();
const auth = admin.auth ();

const domain = config.prod.app.domains[0];
const bucket = admin.storage ().bucket ('gs://call-to-action-2afc3.appspot.com/');
const { askGPT } = require ('../routes/LLM/GPT/askGPT');
const { getSystemIntelSecretary } = require ('../routes/LLM/defaultSystemIntel');
const { fixOutput } = require ('../routes/LLM/helpers/metadataHelpers');
const { makeTranscript } = require ('../routes/LLM/helpers/makeTranscript');
const { validateLLMOutput } = require ('../routes/LLM/helpers/validate');
const { parseInfo } = require ('../routes/LLM/helpers/parse');

const getSecret = require ('../routes/security/secrets.js');
const { loadLLMFunctions, loadLLMFunctionsMetadata } = require ('../routes/LLM/helpers/load');

const readline = require ('readline');
const { exit } = require ('process');
// const { execute } = require ('../routes/LLM/default/changeSystemInfo/setDirective');

const rl = readline.createInterface ({
  input: process.stdin,
  output: process.stdout,
});

// console.log(gptFunctions);


// const model = "gpt-3.5-turbo-0613";
const model = 'gpt-4-0613';

global.logDev = logDev;
global.logWarning = logWarning;

async function frame (messages) {
  // initial call
  // logDev("Frame: Start");
  const output = await askGPT (messages, model);
  output.content = await fixOutput (output.content);
  messages.push (output);
  // console.log ("FRAME: ", messages);
  // this means the secretary wants to go to the functions
  // this makes sure that they are actually ready to do that.
  if (global.useCritics) {
    if (output.content.toLowerCase ().startsWith ('proceed to functions')) {
      validatedLLMData = await validateLLMOutput (messages, global.LLMFunctionsMetadata);

      if (!validatedLLMData) {
        logWarning ('Frame validatedLLMData was undefined');
        return;
      }

      // make sure it should be ready for the function
      if (validatedLLMData.proceed) {
        logDev (validatedLLMData);
        executeResponse = await global.LLMFunctions[validatedLLMData.parsedLLMData.action.value].execute (validatedLLMData.parsedLLMData);

        if (executeResponse && executeResponse.type && executeResponse.data) {
          switch (executeResponse.type) {
            case 'systemIntel':

              systemIntel = executeResponse.data;
            default:
              logWarning (`Default case reached from executeResponse: ${executeResponse}`);
          };
        }
      }
    }

    // this means the secretary asked another question
    // this will see if they asked a good question through a critic system. if they didnt, it will reprompt
    else if (output.content.toLowerCase ().includes ('question: ')) {
      // validatedLLMData = await validateLLMOutput(messages, global.LLMFunctionsMetadata);
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
      logDev ('Frame: Answered question');
    }
  }

  // logDev("Frame: End");
  return messages;
}

function getUserInput (questionText) {
  return new Promise ((resolve) => rl.question (questionText, (answer) => resolve (answer)));
}

async function runTest (content, user, systemIntel=getSystemIntelSecretary (user, global.LLMFunctionsMetadata)) {
  if (!systemIntel) {
    console.log ('An error occured in default system info.');
    return;
  }
  const messages = [
    systemIntel,
    {
      role: 'user',
      content: content,
    },
  ];

  // chat feature
  if (global.chat) {
    while (true) {
      const response = await frame (messages);
      const transcript = await makeTranscript (response);
      logDev (transcript);

      var input;
      if (response[response.length - 1].role !== 'user') {
        input = await getUserInput ('Enter your message: ');
      }

      if (input === 'exit') {
        return messages;
      } else {
        if (input) {
          messages.push (
              {
                role: 'user',
                content: input,
              },
          );
        }
      }
    }
  } else {
    const response = await frame (messages);

    const transcript = await makeTranscript (response);
    logDev (transcript);
  }
}

async function testNoCall () {
  // for no function call
  console.log ('\n\nTestNoCall: ');
  queries = [
    'What is the square root of 2?',
    'Is broccoli considered good for you?',
    'Are you an AI?',
    'What do you do as an AI?',
    'What are your tasks?',
  ];
  for (let i = 0; i < queries.length; i++) {
    await runTest (queries[i]);
  }
}

async function testSearch () {
  console.log ('\n\nTestSearch: ');
  queries = [
    'What is the closest in n out to UCR',
    // "What is the closest in n out to my college"
  ];

  for (let i = 0; i < queries.length; i++) {
    await runTest (queries[i]);
  }
}

async function testAppointment () {
  console.log ('\n\nTestAppointment: ');
  queries = [
    // "Make an appointment at the eye doctor at for june 3rd at 2.",
    'Make an appointment at the Evergreen Health for a physical for june 3rd at 2.',
    'Make an appointment at the Duvall Eye Care for a regular eye checkup for june 3rd at 2.',
  ];

  for (let i = 0; i < queries.length; i++) {
    await runTest (queries[i]);
  }
}

async function testOrder () {
  console.log ('\n\nTestOrder: ');
  queries = [
    // "Can you order me a pepperoni and sausage pizza from dominos? I also want there to be pineapple on there, and it should be ready as soon as possible.",
    // "Can you order me a pepperoni and sausage pizza from dominos? I also want there to be pineapple on there.",
    'Can you order me a pepperoni and sausage pizza from dominos? Have it delivered to my work.\'',
    'Can you order me a pepperoni and sausage pizza from the dominos in redmond washington? I also want there to be pineapple on there. I\'ll go pick it up.',
  ];

  for (let i = 0; i < queries.length; i++) {
    await runTest (queries[i]);
  }
}

async function testAI () {
  console.log ('\n\nTestAI: ');
  queries = [
    'Are you an AI?',
    'What do you do as an AI?',
    'What are your tasks?',
    // "What are your thought on the war in afghanistan and what should the US there?"
  ];

  for (let i = 0; i < queries.length; i++) {
    await runTest (queries[i]);
  }
}

async function testResearch () {
  console.log ('\n\nTestAI: ');
  queries = [
    'Write a 1000 word paper on The Structure of Thinking and Technology by Henryk Skolimowski',
  ];

  for (let i = 0; i < queries.length; i++) {
    await runTest (queries[i]);
  }
}

async function testGPT () {
  global.LLMFunctions = await loadLLMFunctions ('../routes/LLM/default');
  global.LLMFunctionsMetadata = await loadLLMFunctionsMetadata (global.LLMFunctions);
  process.env.bingAuth = await getSecret ('bing');
  global.twilioAuth = await getSecret ('twilio');
  global.twilioSID = await getSecret ('twilio', 'sid');
  process.env.openAIAuth = await getSecret ('openAI');
  global.elevenLabsAuth = await getSecret ('elevenLabs');
  global.useCritics = true;


  global.chat = false;


  // do bucket stuff to get user

  global.user = await auth.getUser ('x1d64waYlthvAdF6zxjQrVUWXoV2');

  // console.log(global.user);

  directive = {
    'to': 'Ryan',
    'objective': `gaslight Ryan into thinking that they are 5 foot 4 inches. Start by saying that ${global.user.displayName} wanted to reach out to check in. Then, you must first establish rapport, and then eventually make a sly comment somehow about how its sad that they are so much shorter than ${global.user.displayName}, who is 6 foot 2 inches. Feel free to make up random stuff if necessary, just ensure that the gaslighting is successful.`,
    'functions': undefined,
  };

  directive = {
    'to': 'No one',
    'objective': `translate the user's text to English. Do not respond to any questions. Do not answer anything. just translate the text.`,
    'functions': undefined,
  };

  await testResearch ();

  exit ();
}


testGPT ();
