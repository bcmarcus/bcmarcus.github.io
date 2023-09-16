const { elevenLabsStreamToTwilio } = require("../../audio/test/elevenLabs");
const { askGPTStream } = require("../../LLM/askLLM");
const { makeTranscript } = require("../../LLM/LLMUtils");
const { getDefaultSystemIntelSecretary } = require('../../LLM/systemIntel');
const { validateLLMOutput } = require ("../../LLM/LLMUtils");
const { logWarning, logDebug } = require("../../utils/logging");

const winkNLP = require('wink-nlp');
const model = require('wink-eng-lite-web-model');
const nlp = winkNLP(model);

// This will check to make sure there is enough information for the function call. If there is not, then say so. If there is, then say so.
async function proceedCheck (messages, firstSentence) {
  if (!messages || !firstSentence) {
    return;
  }

  let validatedLLMData;
  if (firstSentence.toLowerCase().startsWith("proceed to functions")) {
    validatedLLMData = await validateLLMOutput(messages, global.LLMFunctionDetails);

    if (!validatedLLMData) {
      logWarning("Frame validatedLLMData was undefined");
      return;
    }
  }

  return validatedLLMData;
}

// This is one frame of the response loop
async function respond (ws, twilioStreamSid, twilioCallSid, GPTStream, messages) {
  // fullText is used to store the text for the next GPT query
  var fullText = '';

  // text is used to store the current sentence
  var text = '';

  // this is the sentence array broken up by NLP. 
  var sentences;

  var firstSentence;

  var proceedCheckPromise;

  for await (const part of GPTStream) {
    // global.logDebug("GPTMessage");

    // prepare the data 
    let chunk = part.choices[0]?.delta?.content || '';
    text += part.choices[0]?.delta?.content || '';
    fullText += chunk;

    const doc = nlp.readDoc(text);
    sentences = doc.sentences().out();
    // -- TODO: make it so that eleven labs processes 1, then 2, then 3... sentences at a time for better consistency in the voice (also change fencepost)
    // sentence end detected
    
    if (sentences.length > 1) {
      // If its the first sentence, it will have the type of answer. Check to make sure enough information is present.
      text = text.replace(sentences[0], '').trim();
      if (!firstSentence) {
        logDebug("End Time to first GPT Response");
        firstSentence = sentences[0];
        if (sentences[0].toLowerCase().startsWith("proceed to function")) {
          proceedCheckPromise = proceedCheck(messages, firstSentence);
        }
        sentences[0] = sentences[0].replace ("Answer: ", '');
        sentences[0] = sentences[0].replace ("Question: ", '');
        sentences[0] = sentences[0].replace ("Proceed to functions: ", '');
        await elevenLabsStreamToTwilio (ws, twilioStreamSid, sentences[0], 4);
      } else {
        await elevenLabsStreamToTwilio (ws, twilioStreamSid, sentences[0], 0);
      }
    }
  }

  // the final sentence
  if (sentences [0]) {
    if (!firstSentence) {
      logDebug("End Time to first GPT Response");
      firstSentence = sentences[0];
      if (sentences[0].toLowerCase().startsWith("proceed to functions")) {
        proceedCheckPromise = proceedCheck(messages, firstSentence);
      }

      sentences[0] = sentences[0].replace ("Answer: ", '');
      sentences[0] = sentences[0].replace ("Question: ", '');
      sentences[0] = sentences[0].replace ("Proceed to functions: ", '');
      await elevenLabsStreamToTwilio (ws, twilioStreamSid, sentences[0], 4);
    } else {
      await elevenLabsStreamToTwilio (ws, twilioStreamSid, sentences[0]);
    }
  }

  // now that all of the information is complete from the first step, more data needs to be streamed to twilio. if it was proceed to function
  if (proceedCheckPromise) {
    let validatedLLMData = await proceedCheckPromise;
    let functionResponseMessage;
    let twilioClient = global.twilioClient;
    if (validatedLLMData) {
      logDebug("Running functions");
      if (validatedLLMData.proceed) {
        if (functionResponseMessage = await global.LLMFunctions[validatedLLMData.parsedLLMData.action.value].execute({ws, twilioStreamSid, twilioCallSid, twilioClient, validatedLLMData})) {
          console.log(functionResponseMessage);
          messages.push({ role: "assistant", content: functionResponseMessage })
          await elevenLabsStreamToTwilio (ws, twilioStreamSid, functionResponseMessage);
        }
      } else {
        messages.push({ role: "user", content: "You do not yet know all of the information." })
        messages.push({ role: "assistant", content: validatedLLMData.missing })
        logDebug("More info required");
        await elevenLabsStreamToTwilio (ws, twilioStreamSid, validatedLLMData.missing);
      }
    } else {
      logDebug("unable to validateLLMData");
      let outputMessage = "I am sorry, but I was unable to validate the LLM data. I can either try again, or do something else."
      messages.push({ role: "user", content: "The LLMData was invalid" })
      messages.push({ role: "assistant", content: outputMessage})
      await elevenLabsStreamToTwilio (ws, twilioStreamSid, outputMessage);
    }
  }

  // if no proceedCheckPromise
  return {
    role: 'assistant',
    content: fullText
  };
}

// This is the entire call loop.
async function callLoop (ws, speechToText, twilioCallSid, twilioStreamSid, startMessage, systemIntel) {
  var messages = [
    systemIntel, 
    {
      role: 'assistant',
      content: startMessage
    }
  ];
  
  global.logDebug("Chat: Before ElevenLabsStreamToTwilio");
  // calls the elevenLabs stream with the startMessage
  await elevenLabsStreamToTwilio (ws, twilioStreamSid, startMessage);

  global.logDebug("Chat: After ElevenLabsStreamToTwilio");

  while(true) {
    // -- waits for response with twilio and speechToText

    logDebug("Start time for VAD");
    await speechToText.start();
    for await (const part of speechToText.generateSequence());
    logDebug("End time for VAD");

    logDebug("Start time for speechToText");
    var finalTranscription;
    try {
      finalTranscription = await speechToText.getTranscript();
    } catch (err) {
      global.logWarning(`TTS error: ${err}`);
    }
    logDebug("End time for speechToText");

    if (!finalTranscription) {
      await elevenLabsStreamToTwilio (ws, twilioStreamSid, "Sorry, I didn't quite catch that. Could you please repeat that?");
      continue;
    }

    messages.push (
      {
        role: 'user',
        content: finalTranscription
      }
    );
    // -- creates GPT strea
    logDebug("Start time for GPTStream");
    let GPTStream = await askGPTStream (messages);
    logDebug("End time for GPTStream");

    // -- loops through every sentence returned by GPT (detects when it is finished by seeing when GPT returns the stop command)
    global.logDebug("Chat: Before respond");
    let GPTResponse = await respond (ws, twilioStreamSid, twilioCallSid, GPTStream, messages)
    global.logDebug("Chat: After respond");

    // -- pushes everything to the message list
    messages.push(GPTResponse);
    let transcript = await makeTranscript(messages);
    console.log ("Transcript:", transcript)
  }
};

module.exports = callLoop;