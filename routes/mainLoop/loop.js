const { askGPT, askGPTStream } = require ('../LLM/GPT/askGPT');
const { makeTranscript } = require ('../LLM/functions/LLMFunctionUtils');
const { validateLLMOutput } = require ('../LLM/LLMUtils');
const { logWarning, logDev } = require ('../utils/logging');

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

/**
  * Represents one frame of the response loop.
  * @async
  * @function respond
  * @param {Object} communication - The ElevenLabs object.
  * @param {Object} GPTStream - The GPTStream object.
  * @param {Array} messages - The array of messages.
  * @return {Object} An object with the role 'assistant' and the full text content.
  */
async function respond (communication, messages) {
  // fullText is used to store the text for the next GPT query
  let fullText = '';

  // text is used to store the current sentence
  let text = '';

  let proceedCheckPromise;
  let current;

  if (communication.realTime) {
    logDev ('Start time for GPTStream');
    const GPTStream = await askGPTStream (messages);
    logDev ('End time for GPTStream');
    // go through communication in real time
    for await (const part of GPTStream) {
      // get current and prev token, and see if they are part of the same word. if not, sendData. if yes, combine then send.
      current = part.choices[0]?.delta?.content || '';
      // text += current;
      fullText += current;

      // if current doesn't have space, then dont send prev
      if (!current.startsWith (' ') || current.length == 1) {
        text += current;
        continue;
      }

      console.log (text);

      if (text && !startsWithOneOf (text, ignoreParts)) {
        // await elevenLabs.sendData(text);
        elevenLabs.sendData (text);
        text = current;
      } else if (startsWithOneOf (text, ignoreSequences)) {
        if (text.startsWith ('Proceed to functions:') && !proceedCheckPromise) {
          proceedCheckPromise = proceedCheck (messages, text);
        }

        text = current;
      } else {
        text += current;
      }
    }

    if (text && !startsWithOneOf (text, ignoreParts)) {
      elevenLabs.sendData (text);
    }

    await elevenLabs.closeConnection ();
  } else {
    // go through communication in as slow as you want, using a better method

    const gptResponse = await askGPT (messages);
    if (startsWithOneOf (gptResponse, ignoreSequences)) {
      proceedCheckPromise = proceedCheck (messages, gptResponse);
    }
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
          await elevenLabs.sendData (functionResponseMessage);
        }
      } else {
        messages.push ({ role: 'user', content: 'You do not yet know all of the information.' });
        messages.push ({ role: 'assistant', content: validatedLLMData.missing });
        logDev ('More info required');
        await elevenLabs.sendData (validatedLLMData.missing);
      }
    } else {
      logDev ('unable to validateLLMData');
      const outputMessage = 'I am sorry, but I was unable to validate the LLM data. I can either try again, or do something else.';
      messages.push ({ role: 'user', content: 'The LLMData was invalid' });
      messages.push ({ role: 'assistant', content: outputMessage });
      await elevenLabs.sendData (outputMessage);
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

/**
  * Represents the entire call loop.
  * @async
  * @function loop
  * @param {Object} communicationHandler - The communication class, which will determine how to talk to user. Must have a sendData function.
  * @param {SpeechToText} speechToText - The SpeechToText object.
  * @param {string} startMessage - The start message.
  * @param {Object} systemIntel - The system intelligence.
  */
async function realTimeLoop (communicationHandler, speechToText, startMessage, systemIntel) {
  const messages = [
    systemIntel,
    {
      role: 'assistant',
      content: startMessage,
    },
  ];

  global.logDev ('Chat: Before ElevenLabsStreamToTwilio');
  // calls the elevenLabs stream with the startMessage

  await elevenLabs.sendFull (startMessage);

  global.logDev ('Chat: After ElevenLabsStreamToTwilio');

  while (true) {
    logDev ('Start time for VAD');
    await speechToText.start ();
    for await (const part of speechToText.generateSequence ()) {
      part;
    };
    logDev ('End time for VAD');

    logDev ('Start time for speechToText');
    try {
      finalTranscription = await speechToText.getTranscript ();
    } catch (err) {
      global.logWarning (`TTS error: ${err}`);
    }
    logDev ('End time for speechToText');

    if (!finalTranscription) {
      await elevenLabs.sendData ('Sorry, I didn\'t quite catch that. Could you please repeat that?');
      continue;
    }

    messages.push (
        {
          role: 'user',
          content: finalTranscription,
        },
    );
    // -- loops through every sentence returned by GPT (detects when it is finished by seeing when GPT returns the stop command)
    global.logDev ('Chat: Before respond');
    const GPTResponse = await respond (elevenLabs, messages);
    global.logDev ('Chat: After respond');

    // -- pushes everything to the message list
    messages.push (GPTResponse);
    const transcript = await makeTranscript (messages);
    console.log ('Transcript:', transcript);
  }
};

module.exports = {
  loop,
  respond,
};
