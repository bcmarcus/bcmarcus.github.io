// Import Firebase modules
const admin = require('firebase-admin');
admin.initializeApp();
const functions = require('firebase-functions');
const { logDebug, logWarning } = require('../utils/logging');

// Express and other previous modules
const path = require('path');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const config = require("../../config/config.js");
const axios = require('axios');

const os = require('os');
const fs = require('fs');

process.env.GOOGLE_APPLICATION_CREDENTIALS = "../../config/service_keys/call-to-action-2afc3-82ae4cc2b811.json";
process.env.DEV = true;
process.env.DEBUG = true;

const domain = config.prod.app.domains[0];
const bucket = admin.storage().bucket('gs://call-to-action-2afc3.appspot.com/');
const askGPT = require("../GPT/askGPT");
const { defaultSystemIntelSecretary, defaultSystemHasInfo, defaultSystemIntelFunctions } = require('../GPT/defaultSystemIntel');


const getSecret = require('../security/secrets.js');
const { RestoreAssistantInstance } = require('twilio/lib/rest/autopilot/v1/restoreAssistant');
const { ConversationListInstance } = require('twilio/lib/rest/conversations/v1/conversation');
const { exit } = require('process');

// Load all JS files in a specific directory
const loadModules = dir => {
  const files = fs.readdirSync(dir);
  const modules = {};

  for (let file of files) {
    if (path.extname(file) === '.js') {
      const name = path.basename(file, '.js');
      modules[name] = require(path.join(dir, file));
    }
  }

  return modules;
};

global.gptFunctions = loadModules ("../GPT/GPTFunctions/default");

// console.log(gptFunctions);


const model = "gpt-3.5-turbo-0613";
// const model = "gpt-4-0613";

const getFunctionDetails = (gptFunctions) => {
  let functionDetailsArray = [];

  for (let functionName in gptFunctions) {
    if (gptFunctions[functionName].hasOwnProperty('functionDetails')) {
      functionDetailsArray.push(gptFunctions[functionName].functionDetails);
    }
  }

  return functionDetailsArray;
};

// usage
const functionDetailsArray = getFunctionDetails(gptFunctions);
global.gptFunctionDetails = functionDetailsArray;

global.logDebug = logDebug;
global.logWarning = logWarning;

async function fixOutput (content) {
  // preprocessing
  if (!content.startsWith("Answer: ") && !content.startsWith("Question: ") && !content.startsWith ("Proceed to function")) {
    logDebug("Frame: improper formatting");
    if (content.includes(".")) {
      content = "Answer: " + content;
    } else {
      content = "Question: " + content;
    }
  }

  return content;
}
async function parseInfoHelper (str) {
  // Define the properties expected in the string.
  let properties = ['Action', 'Request', 'BusinessName', 'MultipleLocations', 'Location', 'Address', 'PhoneNumber', 'Date', 'Time'];

  let data = {};

  properties.forEach((property, index) => {
    let start = str.indexOf(property + ":");

    // If the property is not found, set it to 'Unknown'
    if (start === -1) {
      data[property] = 'Unknown';
    } else {
      // adjust start to exclude the property and ': '
      start += property.length + 2;  

      let end = str.indexOf(",", start);
      
      // If the end of the property is not found (i.e., this is the last property), slice to the end of the string
      if (end === -1) {
        end = str.length;
      }

      let value = str.slice(start, end).trim();

      data[property] = value;
    }
  });

  return data;
}



// this function checks to see if proceed really should have been called
async function parseInfo (messages) {
  logDebug("ParseInfo: ParseInfo to proceed functions");
  if (!messages) {
    logWarning("ParseInfo: Invalid arguments");
  }
    
  var proceed = false;
  var transcript = await makeTranscript(messages);

  // messages
  var criticMessages = [
    defaultSystemHasInfo, 
    {
      role: 'user',
      content: transcript
    }
  ];

  // gpt
  logDebug("ParseInfo transcript: ", transcript);
  var criticOutput = await askGPT(criticMessages, model);
  logDebug("ParseInfo critic ouptut: ", criticOutput);

  // see if it really is good data
  let data = await parseInfoHelper(criticOutput.content);
  logDebug (data);

  // return the data
  return data;
}

async function enoughInfo (data) {
  logDebug("EnoughInfo: Enter");
  var proceed;

  let bingSearchRequiredFields = ['Action', 'Request'];
  let bingSearchLocationFields = ['MultipleLocations', 'Location', 'Address'];;
  let makeAppointmentRequiredFields = ['Action', 'BusinessName', 'Request', 'Date', 'Time'];
  let makeAppointmentLocationFields = ['MultipleLocations', 'Location', 'Address'];
  let orderFoodRequiredFields = ['Action', 'BusinessName', 'Request', 'Date', 'Time'];
  let orderFoodLocationFields = ['MultipleLocations', 'Location', 'Address'];

  let missingBingSearchRequiredFields = bingSearchRequiredFields.some(field => data[field].toLowerCase()  === 'unknown');
  let missingBingSearchLocationFields = bingSearchLocationFields.every(field => data[field].toLowerCase() === 'unknown' || data[field].toLowerCase()  === 'true');
  let missingMakeAppointmentRequiredFields = makeAppointmentRequiredFields.some(field => data[field].toLowerCase()  === 'unknown');
  let missingMakeAppointmentLocationFields = makeAppointmentLocationFields.every(field => data[field].toLowerCase()  === 'unknown' || data[field].toLowerCase()  === 'true');
  let missingOrderFoodRequiredFields = orderFoodRequiredFields.some(field => data[field].toLowerCase()  === 'unknown');
  let missingOrderFoodLocationFields = orderFoodLocationFields.every(field => data[field].toLowerCase()  === 'unknown' || data[field].toLowerCase()  === 'true');

  var missing;
  var requiredMissing;
  var notRequiredMissing;

  if (data.Action === "Bing Search") {
    requiredMissing = bingSearchRequiredFields.filter(field => data[field].toLowerCase()  === 'unknown').join(", ");
    notRequiredMissing = bingSearchLocationFields.filter(field => data[field].toLowerCase()  === 'unknown').join(", ");

    if (missingBingSearchRequiredFields || (data.BusinessName && missingBingSearchLocationFields)) {
      logDebug("EnoughInfo: Not enough info found for bing search");
      proceed = false;
    } else {
      logDebug("EnoughInfo: Enough info found for bing search");
      proceed = true;
    }  
  } else if (data.Action === "Make Appointment") {
    requiredMissing = makeAppointmentRequiredFields.filter(field => data[field].toLowerCase()  === 'unknown').join(", ");
    notRequiredMissing = makeAppointmentLocationFields.filter(field => data[field].toLowerCase()  === 'unknown').join(", ");

    if (missingMakeAppointmentRequiredFields || missingMakeAppointmentLocationFields) {
      logDebug("EnoughInfo: Not enough info found for make appointment");
      proceed = false;
    } else {
      logDebug("EnoughInfo: Enough info found for make appointment");
      proceed = true;
    }  

    if (missingMakeAppointmentLocationFields) {
      requiredMissing += "At least one of the location fields: 'MultipleLocations', 'Location', 'Address'. Furethermore, MultipleLocations cannot be true while Location and Address are both Unknown."
    }
  } else if (data.Action === "Order Food") {
    requiredMissing = orderFoodRequiredFields.filter(field => data[field].toLowerCase()  === 'unknown').join(", ");
    notRequiredMissing = orderFoodLocationFields.filter(field => data[field].toLowerCase()  === 'unknown').join(", ");
    if (missingOrderFoodRequiredFields || missingOrderFoodLocationFields) {
      logDebug("EnoughInfo: Not enough info found for order food");
      proceed = false;
    } else {
      logDebug("EnoughInfo: Enough info found for order food");
      proceed = true;
    }  

    if (missingOrderFoodLocationFields) {
      requiredMissing += "At least one of the location fields: 'MultipleLocations', 'Location', 'Address'. Furethermore, MultipleLocations cannot be true while Location and Address are both Unknown."
    }
  } else {
    proceed = false;
  }

  missing += requiredMissing;

  // let requiredFields = ['Action', 'BusinessName', 'Request', 'Date', 'Time'];
  // let locationFields = ['MultipleLocations', 'Location', 'Address'];
  
  // let missingRequiredField = requiredFields.some(field => data[field].toLowerCase()  === 'unknown');
  // let missingLocationField = locationFields.every(field => data[field].toLowerCase()  === 'unknown' || data[field].toLowerCase()  === 'true');

  // if (missingRequiredField || missingLocationField) {
  //     logDebug("EnoughInfo: Not enough info found");
  //     proceed = false;
  // } else {
  //     logDebug("EnoughInfo: Enough info found");
  //     proceed = true;
  // }  

  // var requiredMissing = requiredFields.filter(field => data[field].toLowerCase()  === 'unknown').join(", ");
  // let notRequiredMissing = locationFields.filter(field => data[field].toLowerCase()  === 'unknown').join(", ");
  // let missing = requiredMissing + notRequiredMissing;
  
  // if (missingLocationField) {
  //   requiredMissing += "At least one of the location fields: 'MultipleLocations', 'Location', 'Address'. Furethermore, MultipleLocations cannot be true while Location and Address are both unknown."
  // }

  return {
    proceed: proceed,
    missing: missing,
    requiredMissing: requiredMissing,
    notRequiredMissing: notRequiredMissing
  }
}

async function frame (messages) {
  // initial call
  // logDebug("Frame: Start");
  var output = await askGPT(messages, model, "none", functionDetailsArray);

  output.content = await fixOutput(output.content);

  // this means the secretary wants to go to the functions
  // this makes sure that they are actually ready to do that.
  if (global.useCritics) {
    if (output.content.toLowerCase().startsWith("proceed to functions")) {
      let data = await parseInfo(messages);
      let info = await enoughInfo (data);
      messages.push(output);
      if (info.proceed) {
        logDebug("Frame: Enough data found");
      } else {
        logDebug("Frame: Not enough data found.");
        messages.push({
          role: "user",
          content: "You do not yet know all of the information. These parameters are still missing: " + info.requiredMissing
        })
      }
    } 
    
    // this means the secretary asked another question
    // this will see if they asked a good question through a critic system. if they didnt, it will reprompt
    else if (output.content.toLowerCase().includes("question: ")){
      let data = await parseInfo(messages);
      let info = await enoughInfo (data);
      if (info.proceed) {
        logDebug("Frame: Enough data found");
        messages.push({
          role: 'assistant',
          content: 'Proceed to functions'
        });
      } else {    
        logDebug("Frame: Not enough data found. Asking more questions");

        messages.push (output);
        console.log(messages);
      }
    }

    // this means the secretary answered a question. No further action is necessary
    else {
      logDebug("Frame: Answered question");
      messages.push(output);  
    }
  } else {
    messages.push(output);  
  }
  // logDebug("Frame: End");
  return messages;
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

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getUserInput(questionText) {
  return new Promise(resolve => rl.question(questionText, answer => resolve(answer)));
}

async function runTest (content) {
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
  global.twilioAuth = await getSecret('twilio');
  global.twilioSID = await getSecret('twilio', 'sid');
  global.openAIAuth = await getSecret("openAI");
  global.elevenLabsAuth = await getSecret('elevenLabs');
  global.useCritics = true;
  global.chat = true;

  // await testNoCall();
  // await testSearch();
  // await testAppointment();
  await testOrder();
  await testAI();
}


testGPT();

// there is some weird race condition at voice.textToSpeech, and I am unsure why that is the case.