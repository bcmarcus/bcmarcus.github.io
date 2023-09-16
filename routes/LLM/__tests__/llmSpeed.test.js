const { describe, beforeEach, expect, test } = require ('bun:test');

const { askGPT, askGPTStream } = require ('../GPT/askGPT');

/**
  * Tests the execution time of an asynchronous function and checks whether it is within a maximum limit.
  * @async
  * @function testExecutionTime
  * @param {Function} asyncFn - A function to test.
  * @param {Array} args - Array of arguments to pass to the function to test.
  * @param {number} maxTime - Maximum acceptable time for the function to execute, in milliseconds.
  */
async function testExecutionTime (asyncFn, args, maxTime) {
  const startTime = Date.now ();

  await asyncFn (...args);

  const endTime = Date.now ();
  const executionTime = endTime - startTime; // Time in milliseconds

  expect (executionTime).toBeLessThan (maxTime); // Ensure time is less than maxTime
}

/**
  * Executes an asynchronous function and processes each part of the resulting stream.
  * @async
  * @function testValidityStream
  * @param {Function} asyncFn - An asynchronous function to test.
  * @param {Array} args - Array of arguments to pass to the function to test.
  * @return {string} - String formed by concatenating all parts from the stream.
  */
async function getFullTextStream (asyncFn, args) {
  const stream = await asyncFn (...args);

  let fullText = '';
  for (const part in stream) {
    if (stream.hasOwnProperty (part)) {
      fullText += part;
    }
  }

  return fullText;
}

/**
  * Tests the execution time of an asynchronous function which returns a stream and checks whether the initial
  * response and total execution time are within a maximum limit.
  * @async
  * @function testExecutionTimeStream
  * @param {Function} asyncFn - A function to test.
  * @param {Array} args - Array of arguments to pass to the function to test.
  * @param {number} maxTime - Maximum acceptable time for the function to execute, in milliseconds.
  */
async function testExecutionTimeStream (asyncFn, args, maxTime) {
  const startTime = Date.now ();

  const response = await asyncFn (...args);
  const initialResponseTime = Date.now ();
  const initialResponseExecutionTime = initialResponseTime - startTime; // Time in milliseconds
  expect (initialResponseExecutionTime).toBeLessThan (1000); // Ensure time is less than 3 seconds

  await Promise.all (Array.from (response));

  const endTime = Date.now ();
  const executionTime = endTime - startTime; // Time in milliseconds

  expect (executionTime).toBeLessThan (maxTime); // Ensure time is less than maxTime
}

describe ('askPalm', () => {
  test ('testPalm validity', async () => {
    askPALM (['Hello, How are you?'])
        .then ((response) => console.log (response))
        .catch ((err) => console.error (err));
  });
});

// describe ('askPalmStream', () => {

// });

describe ('askGPT', () => {
  let messages;

  beforeEach (async () => {
    process.env.openAIAuth = await getSecret ('openAI');
    messages = [
      {
        'role': 'system',
        'content': 'You are a helpful secretary',
      },
      {
        'role': 'user',
        'content': `Hello, how are you today?`,
      },
    ];
  });

  test ('validity GPT3.5', async () => {
    const response = await askGPT (messages, 'gpt-3.5-turbo-0613', 0);
    console.error (response);
    expect (response).toBe ('Some String');
  });

  test ('validity GPT4', async () => {
    const response = await testExecutionTime (askGPT, [messages, 'gpt-4-0613', 0], 5000);
    expect (response).toBe ('Some String');
  });

  test ('speed GPT 3.5', async () => {
    await testExecutionTime (askGPT, [messages, 'gpt-3.5-turbo-0613', 0], 3000);
  });

  test ('speed GPT 4', async () => {
    await testExecutionTime (askGPT, [messages, 'gpt-4-0613', 0], 5000);
  });
});

describe ('askGPTStream', async () => {
  beforeEach (async () => {
    process.env.openAIAuth = await getSecret ('openAI');
  });

  test ('validity', async () => {
    const response = await getFullTextStream (askGPTStream, [messages, 'gpt-3.5-turbo-0613', 0]);
    expect (response).toBe ('Some String');
  });

  test ('validity', async () => {
    const response = await getFullTextStream (askGPTStream, [messages, 'gpt-3.5-turbo-0613', 0]);
    expect (response).toBe ('Some String');
  });

  test ('speed GPT 3.5 stream', async () => {
    await testExecutionTimeStream (askGPTStream, [messages, 'gpt-3.5-turbo-0613', 0], 3000);
  });

  test ('speed GPT 4 stream', async () => {
    await testExecutionTimeStream (askGPTStream, [messages, 'gpt-4-0613', 0], 5000);
  });
});
