const { getFunctionDetailsAction } = require ('./metadataHelpers');

/**
  * Validates the output of the LLM.
  * @async
  * @function validateLLMOutput
  * @param {Array} messages - The messages to validate.
  * @param {Object} LLMFunctionDetails - The function details to validate against.
  * @return {Object} The validation result.
  */
async function validateLLMOutput (messages, LLMFunctionDetails) {
  if (!messages || !LLMFunctionDetails) {
    logDev (`validateLLMOutput: data or function details are improper. messages=${messages}, LLMFunctionDetails=${LLMFunctionDetails}`);
    return;
  }

  const parsedLLMData = await parseInfo (messages, LLMFunctionDetails);
  if (!parsedLLMData || Object.keys (parsedLLMData).some ((key) => !parsedLLMData[key])) {
    logDev (`validateLLMOutput: Unable to properly parse input. parsedLLMData=${parsedLLMData}`);
    return;
  }

  const functionDetails = await getFunctionDetailsAction (parsedLLMData.action.value, LLMFunctionDetails);
  if (!functionDetails) {
    logDev (`validateLLMOutput: Unable to find function with name ${parsedLLMData.action}.`);
    return;
  }

  let proceed = true;
  let missing = '';

  /**
  * Checks for missing properties in an object.
  * @function checkMissing
  * @param {Object} obj - The object to check.
  * @param {string} [path=''] - The current path in the object.
  * @return {Array} An array of paths to missing properties.
  */
  function checkMissing (obj, path = '') {
    const missing = [];
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if ('value' in obj[key] && (obj[key].value === 'Unknown' || obj[key].value === undefined)) {
          missing.push (path + key);
        }
        if ('anyIfTrue' in obj[key]) {
          const anyIfTrueMissing = checkMissing (obj[key].anyIfTrue, path + key + '.');
          if (anyIfTrueMissing.length === Object.keys (obj[key].anyIfTrue).length) {
            missing.push (...anyIfTrueMissing);
          }
        }
      }
    }
    return missing;
  }


  const requiredMissing = checkMissing (parsedLLMData);

  if (requiredMissing.length > 0) {
    proceed = false;
    missing += ' Please provide me with the required information on these fields: ';
    for (let i = 0; i < requiredMissing.length; i++) {
      if (requiredMissing[i].includes ('.anyIfTrue.')) {
        missing += requiredMissing[i].split ('.anyIfTrue.')[0] + ' (at least one of the following: ' + requiredMissing[i].split ('.anyIfTrue.')[1] + ')';
      } else {
        missing += requiredMissing[i];
      }
      if (i < requiredMissing.length - 1) {
        missing += ', ';
      }
    }
    missing += '.';
  }

  for (const field in functionDetails.requiredParams) {
    if (!functionDetails.requiredParams.hasOwnProperty (field)) {
      continue;
    }

    if (parsedLLMData[field] === 'Unknown' ||
        (parsedLLMData[field].value && typeof parsedLLMData[field].value === 'string' && parsedLLMData[field].value.toLowerCase () === 'unknown')) {
      requiredMissing.push (field);
    }

    if (parsedLLMData[field].anyIfTrue) {
      for (const subParam in parsedLLMData[field].anyIfTrue) {
        if (typeof parsedLLMData[field].anyIfTrue[subParam] === 'string' &&
            parsedLLMData[field].anyIfTrue[subParam].toLowerCase () === 'unknown') {
          requiredMissing.push (subParam);
        }
      }
    }
  }


  if (requiredMissing.length > 0) {
    proceed = false;
    missing += ' Please provide me with the required information on these fields: ' + requiredMissing.join (', ') + '.';
  }

  return {
    proceed: proceed,
    parsedLLMData: parsedLLMData,
    missing: missing,
  };
}

module.exports = {
  validateLLMOutput,
};
