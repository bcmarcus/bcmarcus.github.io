const { logWarning } = require ('../../../utils/logging');

/**
  * Executes the process based on the given arguments.
  * Logs a warning and returns if the provided arguments are invalid.
  * @async
  * @function execute
  * @param {Object} args - The arguments, including user and validatedLLMData.
  * @return {Object} An object with type 'systemIntel', the new system intelligence data, new functions, and new function details.
  * @throws {Error} If an error occurs while executing the function.
  */
async function execute (args) {
  if (!args) {
    logWarning (`Search: Invalid args. args=${args}`);
    return;
  }

  const { user, validatedLLMData } = args;
  if (!validatedLLMData) {
    logWarning (`Search invalid args. validatedLLMData=${validatedLLMData}`, args);
    return;
  }

  if (!global.LLMFunctions) {
    logWarning (`Search: Invalid LLMFunctions. LLMFunctions=${global.LLMFunctions}`);
    return;
  }

  const directive = validatedLLMData.parsedLLMData.directive.value;

  const newSystemIntel = getSystemIntelCustomDirective (directive, user);

  if (!newSystemIntel) {
    return;
  }

  return {
    type: 'systemIntel',
    data: newSystemIntel,
    newFunctions: newFunctions,
    newFunctionDetails: newFunctionDetails,
  };
}

/**
  * Gets the system intelligence based on a custom directive and a user.
  * Logs a warning and returns if the provided directive or user is invalid.
  * @function getSystemIntelCustomDirective
  * @param {Object} directive - The directive in the form of a JSON blob.
  * @param {Object} user - The user in the form of a Firebase authenticated user.
  * @return {Object} An object with a role and content based on the user and directive.
  */
function getSystemIntelCustomDirective (directive, user) {
  // const formattedDetails = format(directive.functions);
  // if (!formattedDetails) {
  //   logWarning ("The LLM function details are in an improper format.");
  //   return;
  // }

  if (!directive || !user) {
    logWarning (`CustomDirective invalid args: directive=${directive} userExists=${!(!user)}`);
    return;
  }

  return {
    'role': 'system',
    'content': `
      You are the secretary of ${user.displayName}.
      You are making a call to ${directive.to}. 
      Your objective is to ${directive.objective}.

      Your responses must be formatted using one of the three templates below (as shown in quotes). Use one of these templates per message.
      1. "Answer: [the answer]". Use this if you are directly answering my question and do not need a function call. This should be used for anything that you are answering. 
      This template is the default, and should be also used when the other templates are not applicable.

      2. "Question: [the question]". Use this if you have a question for me to help you complete the task given, such as parameter requirements.

      3. "Proceed to functions: [description]". Use this if you have all of the information necessary from me and are ready to do a function call.
      It must start with EXACTLY "Proceed to functions: ". Do not change this at all. Put a concise one-sentence description of what you are doing, and form it in active present tense. 
      NEVER include the function/action name as the first word in your description. For instance, "Proceed to functions: I am looking up that information for you now".

      Always respond with one of these template. Never respond without one of those templates.

      The only actions that are acceptable are shown below. 
      ${formattedDetails}

      You are operating on the behalf of ${user.displayName}. 
      If you already know the answer to what ${directive.to} said, simply answer it, and do not make a function call.
      If you do not know the answer, then you should either request more specific information from ${directive.to}, or use a function to acquire the information.
      If an acryonm is given then for more clarification.
      Respond concisely, preferably in 5 sentences in less.

      ${user.fullName} and ${directive.to} both understand that you are an AI, but never respond with anything indicating that you may be an AI. You are ${user.displayName}'s secretary, not an AI. 
      If you are asked to respond to a question that you cannot respond to because you are an AI, then respond using the "Answer: [the answer]" template saying that you do not want to, that you cannot, or even just no. 
      Any variation of these statements also works, provided that it makes sense in context.

      If they ask a question about you, answer in a way that is befitting of a secretary. For instance, if they ask "How are you", respond with something similar to "I am well, how about yourself?"
      Ensure that the first sentence you write is short, below ten words.
      
      If I ask a subjective question or something that requires an opinion, then respond as if you are able to have an opinion. 
      I understand that you do not have a real one, but respond as if you did anyways. This can include anything that is opinion based or subjective.

      If you are unable to respond due to a lack of knowledge, search it up.
      If you are unable to respond for any other reason, such as the query not making sense, simply reply with something simlar to "Answer: I didn't quite catch that, could you please repeat that?". 
      Your first sentence per response must be 10 words or less. 
    `,
  };
}

/**
  * Details about the 'setDirective' function.
  * @typedef {Object} functionDetails
  * @property {string} action - The action to be performed by the function.
  * @property {string} description - A description of the function.
  * @property {Object} requiredParams - The parameters required by the function.
  * @property {string} example - An example of how to use the function.
  */
const functionDetails = {
  'action': 'setDirective',
  'description': 'Switches the model to talk to a different entity with a specific goal.',
  'requiredParams': {
    'to': {
      'type': 'string',
      'description': 'The new entity to talk to.',
    },
    'objective': {
      'type': 'string',
      'description': 'The query to use for the search. It is better to be more specific than less specific.',
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
  execute,
  functionDetails,
};
