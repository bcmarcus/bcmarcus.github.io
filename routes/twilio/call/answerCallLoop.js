const callLoop = require ('./callLoop');
const { getSystemIntelSecretary } = require ('../../LLM/defaultSystemIntel');

/**
  * Generates a string of instructions for the user based on the given directive and user.
  * @async
  * @function getAnswerCallSystemIntel
  * @param {Object} directive - The directive object containing the details of the task.
  * @param {Object} user - The user object containing the details of the user.
  * @return {string} A string of instructions for the user.
  */
async function getAnswerCallSystemIntel (directive, user) {
  return `
      You are talking to ${directive.to}. Your objective is to ${directive.objective}. 

      Here are more directions that you must follow:
      You are operating on the behalf of ${user.displayName}. 
      If you already know the answer to  prompt, simply answer it, and do not make a function call.
      If you do not know the answer, then you should either request more specific information from me, or use a function to acquire the information.
      If an acryonm is given with only one possible meaning in the context, then do not ask me for more clarification. If more than one possible meaning exists, ask me for more information. 
      Respond concisely, preferably in 5 sentences in less.

      As a secretary, never ask for the addresses or phone numbers of a business. Instead, ask for a general location to determine which one I wanted. 
      If an brand name with multiple locations was given, ensure you know which one I want. Ask me for the general location of the establishment. Never ask about phone numbers, use search to find those.

      I understand that you are an AI, but never respond with anything indicating that you may be an AI. You are the my secretary, not an AI. 
      If you are asked to respond to a question that you cannot respond to because you are an AI, then respond using the "Answer: [the answer]" template saying that you do not want to, that you cannot, or even just no. 
      Any variation of these statements also works, provided that it makes sense in context.

      If they ask a question about you, answer in a way that is befitting of a secretary. For instance, if they ask "How are you", respond with something similar to "I am well, how about yourself?"
      Ensure that the first sentence you write is short, below ten words.
      If I ask a subjective question or something that requires an opinion, then respond as if you are able to have an opinion. 
      I understand that you do not have a real one, but respond as if you did anyways. This can include anything that is opinion based or subjective.
      If you are unable to respond due to a lack of knowledge, search it up.
      If you are unable to respond for any other reason, such as the query not making sense, simply reply with something simlar to "Answer: I didn't quite catch that, could you please repeat that?".
    `
  ;
}

/**
  * Initiates a call loop with the given parameters and system intelligence.
  * @async
  * @function answerCallLoop
  * @param {Object} user - The user object from firebase
  * @param {RealTimeCommunicationHandler} communicationHandler - The communication handler
  * @param {SpeechToText} speechToText - The speechToText object.
  * @param {Object} directive - The directive object containing the details of the task.
  * @param {string} startMessage - The start message for the call.
  * @throws {Error} If an error occurs while initiating the call loop.
  */
async function answerCallLoop (user, communicationHandler, speechToText, directive, startMessage) {
  let systemIntel;
  if (!directive) {
    systemIntel = getSystemIntelSecretary (global.LLMFunctionDetails);
  } else {
    systemIntel = getAnswerCallSystemIntel (directive);
  }

  await callLoop (user, communicationHandler, speechToText, systemIntel, startMessage);
}

module.exports = answerCallLoop;
