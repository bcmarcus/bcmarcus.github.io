const { validateLLMOutput } = require ('../LLM/helpers/validate');
const { logWarning } = require ('../utils/logging');

/**
  * Checks if there is enough information for the function call.
  * @async
  * @function proceedCheck
  * @param {Array} messages - The array of messages.
  * @param {string} text - The text to check.
  * @return {Object} The validated LLM data if the text starts with 'proceed to functions', otherwise undefined.
  */
async function proceedCheck (messages, text) {
  if (!messages || !text) {
    return;
  }

  let validatedLLMData;
  if (text.toLowerCase ().startsWith ('proceed to functions')) {
    validatedLLMData = await validateLLMOutput (messages, global.LLMFunctionDetails);

    if (!validatedLLMData) {
      logWarning ('Frame validatedLLMData was undefined');
      return;
    }
  }

  return validatedLLMData;
}

module.exports = {
  proceedCheck,
};
