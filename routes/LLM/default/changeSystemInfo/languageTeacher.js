// languageTeacher.js

const { logWarning } = require ('../../../utils/logging');

/**
  * Executes the language teacher function.
  * @async
  * @function execute
  * @param {Object} args - The arguments for the function.
  * @throws {Error} If an error occurs while executing the function.
  */
async function execute (args) {
  if (!args) {
    logWarning (`Search: Invalid args, expected query to be set. args=${args}`);
    return;
  }

  if (!global.LLMFunctions) {
    logWarning (`Search: Invalid LLMFunctions. LLMFunctions=${global.LLMFunctions}`);
    return;
  }

  const { user, validatedLLMData } = args;
  if (!user || !validatedLLMData) {
    logWarning (`Search invalid args. user=${user}, validatedLLMData=${validatedLLMData}`, args);
    return;
  }

  const language = validatedLLMData.parsedLLMData.language.value;
  const proficiency = validatedLLMData.parsedLLMData.proficiency.value;

  const newSystemIntel = global.LLMFunctions[validatedLLMData.parsedLLMData.newSystemInfo.value].getSystemIntel (user, language, proficiency);

  if (!newSystemIntel) {
    return 'Unable to set system intel. Please try again later.';
  }

  global.systemIntel = newSystemIntel;
  return 'Successfully changed directive to language teacher';
}

/**
  * Gets the system intelligence for the language teacher.
  * @async
  * @function getSystemIntel
  * @param {Object} user - The user object.
  * @param {string} language - The language to be taught.
  * @param {number} proficiency - The proficiency level of the user in the language.
  * @throws {Error} If an error occurs while getting the system intelligence.
  */
async function getSystemIntel (user, language, proficiency) {
  if (!user || !language || !proficiency) {
    logWarning (`LanguageTeacher :: getSystemIntel, one of the args is invalid. user=${user}, language=${language}, proficiency=${proficiency}`);
    return '';
  }

  return {
    'role': 'system',
    'content': `You are a ${language} teacher. Your goal is to help the user learn ${language}. 
    They are currently at a skill level of ${proficiency} / 10, where 0 is a beginner who has never learned anything about ${language}, and a 10 is someone fluent in ${language}. 
    The language they know will be determined by their first message.
    Structure the content in a format that would make you the best language teacher. 
    This could include asking questions to the user, explaining things if they have questions, and going through mock conversations, or anything else that you would think makes an amazing teacher.
    `,
  };
};

/**
  * Details of the language teacher function.
  * @typedef {Object} functionDetails
  * @property {string} action - The action of the function.
  * @property {string} description - The description of the function.
  * @property {Object} requiredParams - The required parameters for the function.
  * @property {string} example - An example of how to use the function.
  */
const functionDetails = {
  'action': 'languageTeacher',
  'description': 'Fundamentally changes the assistant\'s objective to become a language teacher.',
  'requiredParams': {
    'language': {
      'type': 'string',
      'description': 'The query to use for the search. It is better to be more specific than less specific.',
    },
    'proficiency': {
      'type': 'integer',
      'description': 'The query to use for the search. It is better to be more specific than less specific.',
    },
  },
  'example': `Example input: 
  'User: Hello, can you help me learn spanish?
  Secretary: Question: Sure! What would you say your proficiency in the language is, from 0 to 10?
  User: 2
  Secretary: Proceed to functions: Switching to language teacher'

  Example output: 'action: languageTeacher, language: Spanish, proficiency: 2'`,
};

module.exports = {
  functionDetails,
  getSystemIntel,
  execute,
};
