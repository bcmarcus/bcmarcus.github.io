const twilio = require ('twilio');
const VoiceResponse = require ('twilio').twiml.VoiceResponse;

/**
  * Creates and returns a Twilio client using global Twilio SID and Auth.
  * @function createTwilioClient
  * @return {Object} Returns a Twilio client.
  */
function createTwilioClient () {
  const twilioAuth = process.env.twilioAuth;
  const twilioSID = process.env.twilioSID;

  const client = twilio (twilioSID, twilioAuth);
  return client;
}

/**
  * Ends a call with a specified CallSid by playing a goodbye message and then hanging up.
  * @async
  * @function hangup
  * @param {string} callSid - The unique identifier of the call to be ended.
  * @throws {Error} If an error occurs while updating the call.
  */
async function hangup (callSid) {
  const filePath = 'default/goodbye.mp3';
  const AIvoiceMessageUrl = `${global.storageDomain}/getAudio/${filePath}`;
  const twiml = new VoiceResponse ();
  twiml.play ({}, AIvoiceMessageUrl);
  twiml.hangup ();

  const twilioClient = global.twilioClient;
  await twilioClient.calls (callSid).update ({
    twiml: twiml.toString (),
  });
}

module.exports = {
  createTwilioClient,
  hangup,
};
