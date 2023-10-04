const { getFunctionDetailsStr } = require ('./metadataHelpers');
const { makeTranscript } = require ('./makeTranscript');
const { getSystemHasInfo } = require ('../defaultSystemIntel');
const { askLLM } = require ('../askLLM');


/**
  * Parses an input string into a properties object.
  * @function parseInputString
  * @param {string} str - The string to parse.
  * @return {Object} The parsed properties.
  */
function parseInputString (str) {
  const properties = {};
  const pairs = str.split (', ');
  pairs.forEach ((pair) => {
    const [key, value] = pair.split (': ');
    properties[key] = value;
  });
  return properties;
}

/**
  * Retrieves all properties from the function details.
  * @function getAllProperties
  * @param {Object} properties - The properties to retrieve.
  * @param {Object} functionDetails - The function details to retrieve from.
  * @return {Object} The retrieved properties.
  */
function getAllProperties (properties, functionDetails) {
  const output = {};

  for (const key in functionDetails) { // loop through functionDetails
    if (!(key in properties)) { // if key doesn't exist in properties
      output[key] = { value: 'Unknown' };
    } else if (functionDetails[key].anyIfTrue && properties[key] === 'true') { // if it has nested properties and value is true
      output[key] = { value: true, anyIfTrue: getAllProperties (properties, functionDetails[key].anyIfTrue) }; // call getAllProperties recursively
    } else { // if it doesn't have nested properties
      output[key] = { value: properties[key] };
    }
  }

  return output;
}

/**
  * This asynchronous function validates and parses the details from a given set of messages and function details object.
  * It logs any events for dev mode. It uses a GPT model for validation and parsing information.
  *
  * @async
  * @function parseInfo
  * @param {Array} messages - An array of messages to be parsed.
  * @param {Object} LLMFunctionDetails - An object containing required function details.
  * @return {Object|null} It returns an object with parsed data or null if any error or invalid data is encountered.
  * @throws {Error} If an error occurs during any operation like invalid arguments, GPT validation failure etc.
  */
async function parseInfo (messages, LLMFunctionDetails) {
  logDev ('ParseInfo: Enter');

  if (!messages || !LLMFunctionDetails) {
    logWarning ('ParseInfo: Invalid arguments');
    return;
  }

  const transcript = await makeTranscript (messages);

  // messages
  const defaultSystemHasInfo = getSystemHasInfo (LLMFunctionDetails);

  if (!defaultSystemHasInfo) {
    logWarning ('ParseInfo: defaultSystemHasInfo errored');
    return;
  }
  const hasInfoMessages = [
    defaultSystemHasInfo,
    {
      role: 'user',
      content: transcript,
    },
  ];

  // gpt
  logDev (`ParseInfo transcript: ${transcript}`);

  const infoOutput = await askLLM (hasInfoMessages);

  if (!infoOutput) {
    logDev ('An error occured while using the GPT validator');
  }

  const functionDetails = await getFunctionDetailsStr (infoOutput.content, LLMFunctionDetails);
  // see if it really is good data
  if (!functionDetails) {
    logWarning (`ParseInfo invalid output: functionDetails=${functionDetails}`);
    return;
  }

  const properties = parseInputString (infoOutput.content);
  const parsedLLMData = getAllProperties (properties, functionDetails.requiredParams);
  // logDev(properties);
  // logDev(functionDetails.requiredParams);
  // logDev(parsedLLMData);
  parsedLLMData.action = { value: functionDetails.action };
  return parsedLLMData;
}

module.exports = {
  parseInfo,
};
