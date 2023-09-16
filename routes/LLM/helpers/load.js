const fs = require ('fs');
const path = require ('path');
/**
  * Loads all LLM functions from a specified directory and its subdirectories.
  * @async
  * @function loadLLMFunctions
  * @param {string} dir - The directory from which to load the LLM functions.
  * @param {string} [parent=''] - The parent directory of the current directory.
  * @return {Object} modules - An object containing all the loaded LLM functions.
  * @throws {Error} If an error occurs while reading the directory or loading a module.
  */
async function loadLLMFunctions (dir, parent = '') {
  const files = fs.readdirSync (dir);
  const modules = {};

  for (const file of files) {
    const fullPath = path.resolve (dir, file);
    if (fs.lstatSync (fullPath).isDirectory ()) {
      const childModules = await loadLLMFunctions (fullPath, parent + file + '/');
      Object.assign (modules, childModules);
    } else if (path.extname (file) === '.js') {
      const name = path.basename (file, '.js');
      modules[name] = require (fullPath);
    }
  }

  return modules;
}

/**
  * Loads the details of all LLM functions from a specified LLMFunctions object.
  * @async
  * @function loadLLMFunctionsMetadata
  * @param {Object} LLMFunctions - The object containing the LLM functions.
  * @return {Array} functionDetailsArray - An array containing the details of all LLM functions.
  * @throws {Error} If an error occurs while accessing the functionDetails property of an LLM function.
  */
async function loadLLMFunctionsMetadata (LLMFunctions) {
  const functionDetailsArray = [];

  for (const functionName in LLMFunctions) {
    if (LLMFunctions[functionName].hasOwnProperty ('functionDetails')) {
      functionDetailsArray.push (LLMFunctions[functionName].functionDetails);
    }
  }

  return functionDetailsArray;
};

module.exports = {
  loadLLMFunctions,
  loadLLMFunctionsMetadata,
};
