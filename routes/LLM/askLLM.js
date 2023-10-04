const { logWarning } = require ('../utils/logging');
const { askGPT, askGPTStream } = require ('./GPT/askGPT');
// const { askPalm, askPalmStream } = require ('./palm/askPalm');

/**
 * Wrapper for all possible LLM's
 * @class LLM
 */
class LLM {
  /**
   * @function constructor
   * @param {string} model - The model to be used.
   */
  constructor (model='gpt-3.5-turbo-16k') {
    this.gptModel = 'gpt-3.5-turbo-16k';
    switch (model) {
      case 'gpt-4':
        this.context = 8192;
        break;
      case 'gpt-4-32k':
        this.context = 32768;
        break;
      case 'gpt-3.5-turbo':
        this.context = 4096;
        break;
      case 'gpt-3.5-turbo-16k':
        this.context = 16384;
        break;
      case 'palm-model-1': // replace with actual model name
        this.context = 8000; // replace with actual context length
        break;
      case 'palm-model-2': // replace with actual model name
        this.context = 8000; // replace with actual context length
        break;
      // add more cases as needed
      default:
        console.log ('Invalid model');
        break;
    }

    // this.gptModel = "gpt-4-0613";
    // this.gptModel = 'gpt-4-32k';
  }

  /**
  * Asks the GPT model a question and returns the response.
  * @async
  * @function askGPT
  * @param {Array} messages - The messages to be processed.
  * @param {string} model - The model to be used.
  * @param {int} temperature - The functions to be called.
  * @param {Object} functions - The functions to be used.
  * @throws {Error} If an error occurs while asking the GPT model.
  */
  async ask (messages, model=this.model, temperature=0.2) {
    return await askGPT (messages, model, temperature);
  }

  /**
  * Asks the model a question and returns the response as a stream.
  * @async
  * @function askStream
  * @param {Array} messages - The messages to be processed.
  * @param {string} model - The model to be used.
  * @param {int} temperature - The functions to be called.
  * @throws {Error} If an error occurs while asking the model.
  */
  async streamAsk (messages, model=this.model, temperature=0.2) {
    return await askGPTStream (messages, model, temperature);
  }
}

module.exports = LLM;
