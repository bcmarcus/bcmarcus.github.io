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
const { askGPT } = require ('../routes/LLM/askLLM');
const { getSystemIntelSecretary, getSystemIntelCustomDirective } = require ('../routes/LLM/defaultSystemIntel');
const { fixOutput, makeTranscript, validateLLMOutput } = require ('../routes/LLM/functions/helpers/metadataHelpers');

const getSecret = require ('../routes/security/secrets.js');
const { loadLLMFunctions, loadLLMFunctionsDetails } = require ('../routes/LLM/functions/helpers/metadataHelpers');

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
      validatedLLMData = await validateLLMOutput (messages, global.LLMFunctionDetails);

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
      logDev ('Frame: Answered question');
    }
  }

  // logDev("Frame: End");
  return messages;
}

const readline = require ('readline');
const { exit } = require ('process');
const { execute } = require ('../routes/LLM/functions/default/changeSystemInfo/setDirective');

const rl = readline.createInterface ({
  input: process.stdin,
  output: process.stdout,
});

function getUserInput (questionText) {
  return new Promise ((resolve) => rl.question (questionText, (answer) => resolve (answer)));
}

async function runTest (content, systemIntel=getSystemIntelSecretary (global.LLMFunctionDetails)) {
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
      console.log (response);
      const transcript = await makeTranscript (response);
      logDev (transcript);

      // console.log ("ENTER ", response[response.length - 1]);
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

async function testDirective (directive) {
  // queries = [
  //   "Are you an AI?",
  //   "What do you do as an AI?",
  //   "What are your tasks?",
  //   // "What are your thought on the war in afghanistan and what should the US there?"
  // ];

  const systemIntel = getSystemIntelCustomDirective (directive, global.user);

  // for (var i = 0; i < queries.length; i++) {
  await runTest ('Hello?', systemIntel);
  // }
}

async function testTranslate (directive) {
  // queries = [
  //   "Are you an AI?",
  //   "What do you do as an AI?",
  //   "What are your tasks?",
  //   // "What are your thought on the war in afghanistan and what should the US there?"
  // ];

  const systemIntel = getSystemIntelCustomDirective (directive, global.user);

  // for (var i = 0; i < queries.length; i++) {
  await runTest ('Hello?', systemIntel);
  // }
}


async function testGPT () {
  global.LLMFunctions = await loadLLMFunctions ('../routes/LLM/LLMFunctions/default');
  global.LLMFunctionDetails = await loadLLMFunctionsDetails (global.LLMFunctions);
  global.bingAuth = await getSecret ('bing');
  global.twilioAuth = await getSecret ('twilio');
  global.twilioSID = await getSecret ('twilio', 'sid');
  global.openAIAuth = await getSecret ('openAI');
  global.elevenLabsAuth = await getSecret ('elevenLabs');
  global.useCritics = true;
  global.chat = true;

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

  // await testNoCall();
  // await testSearch();
  // await testAppointment();
  // await testOrder();
  // await testAI();
  await testDirective (directive);

  exit ();
}


testGPT ();

// there is some weird race condition at voice.textToSpeech, and I am unsure why that is the case.

// Amendment I: Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances. Amendment II: A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed. Amendment III: No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner, nor in time of war, but in a manner to be prescribed by law. Amendment IV: The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated, and no Warrants shall issue, but upon probable cause, supported by Oath or affirmation, and particularly describing the place to be searched, and the persons or things to be seized. Amendment V: No person shall be held to answer for a capital, or otherwise infamous crime, unless on a presentment or indictment of a Grand Jury, except in cases arising in the land or naval forces, or in the Militia, when in actual service in time of War or public danger; nor shall any person be subject for the same offence to be twice put in jeopardy of life or limb; nor shall be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law; nor shall private property be taken for public use, without just compensation. Amendment VI: In all criminal prosecutions, the accused shall enjoy the right to a speedy and public trial, by an impartial jury of the State and district wherein the crime shall have been committed, which district shall have been previously ascertained by law, and to be informed of the nature and cause of the accusation; to be confronted with the witnesses against him; to have compulsory process for obtaining witnesses in his favor, and to have the Assistance of Counsel for his defence. Amendment VII: In Suits at common law, where the value in controversy shall exceed twenty dollars, the right of trial by jury shall be preserved, and no fact tried by a jury, shall be otherwise re-examined in any Court of the United States, than according to the rules of the common law. Amendment VIII: Excessive bail shall not be required, nor excessive fines imposed, nor cruel and unusual punishments inflicted. Amendment IX: The enumeration in the Constitution, of certain rights, shall not be construed to deny or disparage others retained by the people. Amendment X: The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people.
