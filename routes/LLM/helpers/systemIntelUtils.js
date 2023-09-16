const { logWarning } = require ('../../utils/logging');

/**
  * An array of strings that represent metadata for nested functions.
  * @type {string[]}
  */
const nestedFunctionMetadata = ['anyIfTrue'];

/**
  * An array of strings that represent metadata for functions.
  * @type {string[]}
  */
const functionMetadata = ['anyIfTrue', 'type', 'description'];

/**
  * An array of strings that represent sequences to be ignored.
  * @type {string[]}
  */
const defaultIgnoreSequences = [
  'Answer:',
  'Question:',
  'Proceed to functions:',
];

/**
  * A set of strings that represent parts to be ignored.
  * @type {string[]}
  */
const defaultIgnoreParts = generateIgnoreParts (defaultIgnoreSequences);

/**
  * Generates parts to be ignored from given sequences.
  * @function generateIgnoreParts
  * @param {string[]} ignoreSequences - The sequences to generate ignore parts from.
  * @return {string[]} The generated ignore parts.
  */
function generateIgnoreParts (ignoreSequences) {
  const ignoreParts = new Set ();
  ignoreSequences.forEach ((sequence) => {
    const parts = sequence.split (' ');
    for (let i = 0; i < parts.length; i++) {
      let subSequence = parts.slice (0, i+1).join (' ').trim ();
      ignoreParts.add (subSequence);
      if (parts[i].endsWith (':')) {
        subSequence = subSequence.slice (0, -1);
        ignoreParts.add (subSequence);
      }
    }
  });
  return [...ignoreParts];
}

/**
  * Checks if a given text starts with one of the provided sequences.
  * @function startsWithOneOf
  * @param {string} text - The text to check.
  * @param {string[]} sequences - The sequences to check against.
  * @return {boolean} True if the text starts with one of the sequences, false otherwise.
  */
function startsWithOneOf (text, sequences) {
  return sequences.some ((sequence) => text.startsWith (sequence));
}

/**
  * Formats the details of a given LLM function.
  * @function format
  * @param {Object[]} LLMFunctionDetails - The details of the LLM function to format.
  * @return {string} The formatted details of the LLM function.
  */
function format (LLMFunctionDetails) {
  if (!LLMFunctionDetails) {
    logWarning ('There are no acceptable actions or functions that you can call.');
    return;
  }

  let formattedDetails = '';
  for (let i = 0; i < LLMFunctionDetails.length; i++) {
    const functionDetails = LLMFunctionDetails[i];
    if (
      !functionDetails.action ||
      !functionDetails.description ||
      !functionDetails.requiredParams
    ) {
      logWarning ('Unable to find necessary parameters: ', functionDetails);
      return;
    }
    const formattedParams = formatParams (functionDetails.requiredParams, 97, '\t');
    if (!formattedParams) {
      logWarning ('Unable to format parameters: ', functionDetails);
      return;
    }
    formattedDetails += `${i + 1}. "${functionDetails.action}": ${functionDetails.description} The required parameters for ${functionDetails.action} are as follows.\n${formattedParams}\n`;
  }
  return formattedDetails;
}


module.exports = {
  format,
  startsWithOneOf,
  functionMetadata,
  nestedFunctionMetadata,
  defaultIgnoreParts,
  defaultIgnoreSequences,
};
