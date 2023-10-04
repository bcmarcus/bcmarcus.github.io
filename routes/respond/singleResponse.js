/**
  * Represents one frame of the response loop.
  * @async
  * @function respond
  * @param {Object} user - The user object from firebase
  * @param {CommunicationHandler} communicationHandler - The communication method
  * @param {Array} messages - The array of messages.
  * @return {Object} An object with the role 'assistant' and the full text content.
  */
async function singleResponse (user, communicationHandler, messages) {
  let proceedCheckPromise;

  logDev ('Start time for GPTStream');
  const fullText = await askLLM (messages);
  logDev ('End time for GPTStream');

  if (startsWithOneOf (gptResponse, ignoreSequences)) {
    proceedCheckPromise = proceedCheck (messages, gptResponse);
  }

  // now that all of the information is complete from the first step, more data needs to be streamed to twilio. if it was proceed to function
  if (proceedCheckPromise) {
    const validatedLLMData = await proceedCheckPromise;
    let functionResponseMessage;
    const twilioClient = global.twilioClient;
    if (validatedLLMData) {
      logDev ('Running functions');
      if (validatedLLMData.proceed) {
        console.log (validatedLLMData);
        console.log (global.LLMFunctions[validatedLLMData.parsedLLMData.action.value]);
        if (functionResponseMessage = await global.LLMFunctions[validatedLLMData.parsedLLMData.action.value].execute ({ elevenLabs, twilioClient, validatedLLMData })) {
          console.log (functionResponseMessage);
          messages.push ({ role: 'assistant', content: functionResponseMessage });
          await communicationHandler.send (functionResponseMessage);
        }
      } else {
        messages.push ({ role: 'user', content: 'You do not yet know all of the information.' });
        messages.push ({ role: 'assistant', content: validatedLLMData.missing });
        logDev ('More info required');
        await communicationHandler.send (validatedLLMData.missing);
      }
    } else {
      logDev ('unable to validateLLMData');
      const outputMessage = 'I am sorry, but I was unable to validate the LLM data. I can either try again, or do something else.';
      messages.push ({ role: 'user', content: 'The LLMData was invalid' });
      messages.push ({ role: 'assistant', content: outputMessage });
      await communicationHandler.send (outputMessage);
    }
  }

  // enables elevenLabs to send more data
  await elevenLabs.reset ();

  // if no proceedCheckPromise
  return {
    role: 'assistant',
    content: fullText,
  };
}

module.exports = {
  singleResponse,
};
