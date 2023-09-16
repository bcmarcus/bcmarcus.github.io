/**
  * Capitalizes the first character of a string.
  * @function capitalizeFirst
  * @param {string} string - The string to be capitalized.
  * @return {string} The input string with the first character capitalized.
  */
function capitalizeFirst (string) {
  return string.charAt (0).toUpperCase () + string.slice (1);
}

/**
  * Creates a transcript from a list of messages.
  * Each message is prefixed with the role of the sender, which is capitalized if it's not 'assistant'.
  * If the role is 'assistant', it's replaced with 'Secretary'.
  * @async
  * @function makeTranscript
  * @param {Array} messages - The list of messages. Each message is an object with 'role' and 'content' properties.
  * @return {string} The transcript, as a single string.
  */
async function makeTranscript (messages) {
  let transcript = '';

  // preprocessing transcript for GPT
  for (let j = 1; j < messages.length; j++) {
    const role = messages[j].role === 'assistant' ? 'Secretary' : capitalizeFirst (messages[j].role);
    const add = role + ': ' + messages[j].content + '\n';
    transcript += add;
  }

  return transcript;
}

module.exports = {
  makeTranscript,
};
