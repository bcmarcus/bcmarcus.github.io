const { logWarning, logDev } = require ('../../utils/logging');

/**
  * Fixes the output content by adding appropriate prefixes.
  * @async
  * @function fixOutput
  * @param {string} content - The content to be fixed.
  * @return {string} The fixed content.
  */
async function fixOutput (content) {
  // preprocessing
  if (!content.startsWith ('Answer: ') && !content.startsWith ('Question: ') && !content.startsWith ('Proceed to function')) {
    logDev ('Frame: improper formatting');
    if (content.includes ('.')) {
      content = 'Answer: ' + content;
    } else {
      content = 'Question: ' + content;
    }
  }

  return content;
}

/**
  * Retrieves the value of a specified property from a string.
  * @async
  * @function getProperty
  * @param {string} str - The string to search in.
  * @param {string} property - The property to find.
  * @return {string} The value of the property.
  */
async function getProperty (str, property) {
  let value;

  let start = str.indexOf (property + ':');

  // If the property is not found, set it to 'Unknown'
  if (start === -1) {
    value = 'Unknown';
  } else {
    // adjust start to exclude the property and ': '
    start += property.length + 2;

    let end = str.indexOf (',', start);

    // If the end of the property is not found (i.e., this is the last property), slice to the end of the string
    if (end === -1) {
      end = str.length;
    }

    value = str.slice (start, end).trim ();
  }

  return value;
}

/**
  * Retrieves the function details from a string.
  * @async
  * @function getFunctionDetailsStr
  * @param {string} str - The string to retrieve from.
  * @param {Object} LLMFunctionDetails - The function details to retrieve.
  * @return {Object} The retrieved function details.
  */
async function getFunctionDetailsStr (str, LLMFunctionDetails) {
  // Define the properties expected in the string.
  if (!str || !LLMFunctionDetails) {
    logWarning (`Invalid call to parseInfoHelper. str=${str}, params=${LLMFunctionDetails}`);
    return;
  }

  // first, get the action name, then the rest of the properties.
  const action = await getProperty (str, 'action');
  if (!action) {
    logWarning (`ParseInfoHelper: Action could not be found in parseInfoHelper.`);
    return;
  }

  return LLMFunctionDetails.find ((obj) => obj.action === action);
}

/**
  * Retrieves the function details from an action.
  * @async
  * @function getFunctionDetailsAction
  * @param {string} action - The action to retrieve from.
  * @param {Object} LLMFunctionDetails - The function details to retrieve.
  * @return {Object} The retrieved function details.
  */
async function getFunctionDetailsAction (action, LLMFunctionDetails) {
  // Define the properties expected in the string.
  if (!action || !LLMFunctionDetails) {
    logWarning (`Invalid call to parseInfoHelper. action=${action}, params=${LLMFunctionDetails}`);
    return;
  }

  // first, get the action name, then the rest of the properties.
  if (!action) {
    logWarning (`ParseInfoHelper: Action could not be found in parseInfoHelper.`);
    return;
  }

  return LLMFunctionDetails.find ((obj) => obj.action === action);
}

/**
  * Constructs a string of examples from the provided function details.
  * @function getExamples
  * @param {Array} LLMFunctionDetails - An array of function details, each containing an action, description, and example.
  * @return {string} A string representation of the examples from the function details.
  */
function getExamples (LLMFunctionDetails) {
  if (!LLMFunctionDetails) {
    return;
  }

  let examplesString = '';

  for (let i = 0; i < LLMFunctionDetails.length; i++) {
    const functionDetails = LLMFunctionDetails[i];
    examplesString += 'Action: ' + functionDetails.action + '\n';
    examplesString += 'Description: ' + functionDetails.description + '\n';
    examplesString += functionDetails.example + '\n\n';
  }

  return examplesString;
}

/**
  * Formats the parameters into a string with a specific format.
  * @function formatParams
  * @param {Object} params - An object containing the parameters to be formatted.
  * @param {number} prefix - A number to be used as a prefix in the formatted string.
  * @param {string} tab - A string to be used for indentation in the formatted string.
  * @return {string} A string representation of the formatted parameters.
  * @throws {Error} If a parameter does not have a type or description, or if unable to format 'either if true'.
  */
function formatParams (params, prefix, tab) {
  let formatted = '';
  let count = 0;
  for (const key in params) {
    if (!params.hasOwnProperty (key)) {
      continue;
    }

    count++;
    const value = params[key];
    if (!value.type || !value.description) {
      logWarning ('Type or description not found', value);
      return;
    }
    formatted += `${tab}${String.fromCharCode (prefix + count - 1)}. "${key}" (${value.type}): ${value.description}\n`;
    if (value.anyIfTrue) {
      const formattedAnyIfTrue = formatParams (value.anyIfTrue, 65, tab + '\t');
      if (!formattedAnyIfTrue) {
        logWarning ('Unable to format either if true', value);
        return;
      }
      formatted += `${tab + '\t'}If ${key} is true, then at least one of these other parameters must be set. If it is not true, none of the followering parameters need to be set. \n${formattedAnyIfTrue}`;
    }
  }
  return formatted;
}

module.exports = {
  fixOutput,
  getFunctionDetailsStr,
  getFunctionDetailsAction,
  getExamples,
  formatParams,
};
