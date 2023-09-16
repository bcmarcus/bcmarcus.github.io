const { logWarning } = require ('../../../utils/logging');

/**
  * Executes the function with the provided arguments.
  * Logs a warning and returns if the arguments or global LLMFunctions are invalid.
  * If the validatedLLMData is valid, it sets the global systemIntel to the result of getSystemIntelTranscribe with the language value.
  * @async
  * @function execute
  * @param {Object} args - The arguments for the function.
  */
async function execute (args) {
  if (!args) {
    logWarning (`Search: Invalid args. args=${args}`);
    return;
  }

  if (!global.LLMFunctions) {
    logWarning (`Search: Invalid LLMFunctions. LLMFunctions=${global.LLMFunctions}`);
    return;
  }

  const { validatedLLMData } = args;
  if (!validatedLLMData) {
    logWarning (`Search invalid args. validatedLLMData=${validatedLLMData}`, args);
    return;
  }

  const language = validatedLLMData.parsedLLMData.language.value;

  global.systemIntel = getSystemIntelTranscribe (language);
}

// /**
//   * Reads the directory and requires all .js files, returning an object with the file names as keys and the required modules as values.
//   * @function getTranscribeLLMFunctions
//   * @return {Object} An object with the file names as keys and the required modules as values.
//   */
// function getTranscribeLLMFunctions () {
//   const files = fs.readdirSync (dir);
//   const modules = {};
//   for (const file of files) {
//     if (path.extname (file) === '.js') {
//       const name = path.basename (file, '.js');
//       modules[name] = require (path.resolve (dir, file));
//     }
//   }

//   return modules;
// }

/**
  * Returns an object with role and content properties.
  * The content property contains a string with instructions for transcribing text to the provided language.
  * @function getSystemIntel
  * @param {string} language - The language to transcribe to.
  * @return {Object} An object with role and content properties.
  */
function getSystemIntel (language) {
  if (!language) {
    return;
  }

  return {
    'role': 'system',
    'content': `
      Your objective is to transcribe the incoming text, which may be in any language, to ${language}.
      Never respond to anything the user says. Always transcribe everything, and return exactly that, and only that.
      Never say anything that would indicate that you are an AI. If there is something that you are unable or unwilling to translate, then return nothing.

      Only in the event that the user says "Exit transcription" (or something similar) can you do something that is not transcribing the text. In this case, return exactly "Proceed to functions: Stopping transcription." 
    `,
  };
}

/**
  * An object containing details about the function.
  * @typedef {Object} functionDetails
  * @property {string} action - The action of the function.
  * @property {string} description - The description of the function.
  * @property {Object} requiredParams - The required parameters for the function.
  * @property {string} example - An example of how to use the function.
  */
const functionDetails = {
  'action': 'languageTeacher',
  'description': 'Switches the model to a language teacher.',
  'requiredParams': {
    'query': {
      'type': 'string',
      'description': 'The query to use for the search. It is better to be more specific than less specific.',
    },
    'requiresLocation': {
      'type': 'boolean',
      'description': 'Whether or not the query requires a location to complete the search. For instance, if there is a chain restaurant with two stores, it is important to know which one the user is referencing.',
      'anyIfTrue': {
        'location': {
          'type': 'string',
          'description': 'The actual location. This MUST be a proper noun, such as "Seattle", or one of the following: "Current Location", "Work", and "Home".',
        },
        'address': {
          'type': 'string',
          'description': 'A complete address, formatted as unit (if applicable), street, city, state, zip code. An example is "Microsoft Building 9, 1 Microsoft Way, Redmond, WA, 98052."',
        },
      },
    },
  },
  'example': `Example input: 
  'User: What is the closest in n out to my college?
  Secretary: Question: Can you please provide me with the name of your college?
  User: UCR
  Secretary: Proceed to functions: Searching for the closest in n out to UCR'

  Example output: 'action: search, query: closest in n out to UCR, requiresLocation: true, location: UCR, address: Unknown'`,
};

module.exports = {
  functionDetails,
  getSystemIntel,
  execute,
};
