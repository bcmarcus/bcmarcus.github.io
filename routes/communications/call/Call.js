// Import required modules
const ffmpeg = require ('fluent-ffmpeg');
const { logDev, logWarning } = require ('../../utils/logging.js');
const WebSocket = require ('ws');
const streamifier = require ('streamifier');
const { RealTimeCommunicationHandler } = require ('../RealTimeCommunicationHandler');

/**
  * Class representing a connection to Eleven Labs.
  * @class Call
  * @constructor
  * @param {string} apiKey - The API key for Eleven Labs.
  * @param {Object} twilioWS - The WebSocket to send the audio data to.
  * @param {string} twilioSID - The Stream SID from Twilio.
  * @param {string} voiceID - The ID of the voice to use for speech synthesis.
  * @param {Object} voiceSettings - The settings for the voice.
  * @param {number} streamingLatency - The latency for streaming.
  * @param {string} modelID - The ID of the model to use for speech synthesis.
  */
class Call extends RealTimeCommunicationHandler {
  /**
    * Creates an instance of the ElevenLabs class.
    * @async
    * @function create
    * @param {string} apiKey - The API key for Eleven Labs.
    * @param {Object} twilioWS - The WebSocket to send the audio data to.
    * @param {string} twilioSID - The Stream SID from Twilio.
    * @param {string} [voiceID='2EiwWnXFnvU5JabPnv8n'] - The ID of the voice to use for speech synthesis.
    * @param {Object} [voiceSettings={ 'stability': 0.2, 'similarity_boost': 0.7 }] - The settings for the voice.
    * @param {number} [streamingLatency=0] - The latency for streaming.
    * @param {string} [modelID='eleven_monolingual_v1'] - The ID of the model to use for speech synthesis.
    * @throws {Error} If an error occurs while creating the instance.
    */
  constructor (apiKey, twilioWS, twilioSID, voiceID, voiceSettings, streamingLatency, modelID) {
    // if (!apiKey || !twilioWS || !twilioSID ||!voiceID || !voiceSettings || !modelID) {
    //   logWarning(`Unable to create ElevenLabs instance, apiKey=${apiKey}, twilioWS=${twilioWS}, twilioSID=${twilioSID}, voiceID=${voiceID}, voiceSettings=${voiceSettings}, streamingLatency=${streamingLatency}, modelID=${modelID}`);
    //   throw new Error('Missing required parameters');
    // }
    super ();

    this.twilioWS = twilioWS;
    this.twilioSID = twilioSID;

    this.apiKey = apiKey;
    this.voiceID = voiceID;
    this.voiceSettings = voiceSettings;
    this.streamingLatency = streamingLatency;
    this.modelID = modelID;
    this.elevenLabsWSUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceID}/stream-input?model_type=${modelID}`;

    this.audioQueue = [];
    this.isProcessing = false;
    this.socketFinished = false;
  }

  /**
    * Creates an instance of the Call class.
    * @async
    * @function create
    * @param {string} apiKey - The API key for Eleven Labs.
    * @param {Object} twilioWS - The WebSocket to send the audio data to.
    * @param {string} twilioSID - The Stream SID from Twilio.
    * @param {string} [voiceID='2EiwWnXFnvU5JabPnv8n'] - The ID of the voice to use for speech synthesis.
    * @param {Object} [voiceSettings={ 'stability': 0.2, 'similarity_boost': 0.7 }] - The settings for the voice.
    * @param {number} [streamingLatency=0] - The latency for streaming.
    * @param {string} [modelID='eleven_monolingual_v1'] - The ID of the model to use for speech synthesis.
    * @throws {Error} If an error occurs while creating the instance.
    */
  static async create (apiKey, twilioWS, twilioSID, voiceID='2EiwWnXFnvU5JabPnv8n', voiceSettings={ 'stability': 0.2, 'similarity_boost': 0.7 }, streamingLatency=0, modelID='eleven_monolingual_v1') {
    try {
      const instance = new Call (apiKey, twilioWS, twilioSID, voiceID, voiceSettings, streamingLatency, modelID);
      await instance._connect ();
      return instance;
    } catch (err) {
      logWarning (err);
      throw err;
    }
  }

  /**
    * Waits for the WebSocket connection to open.
    * @private
    * @function _waitForOpen
    * @return {Promise} Resolves when the connection is open.
    * @throws {Error} If the maximum number of attempts is exceeded.
    */
  _waitForOpen () {
    return new Promise ((resolve, reject) => {
      const maxNumberOfAttempts = 50;
      const intervalTime = 50; // ms
      let currentAttempt = 0;
      const interval = setInterval (() => {
        if (currentAttempt > maxNumberOfAttempts - 1) {
          clearInterval (interval);
          reject (new Error ('Maximum number of attempts exceeded'));
        } else if (this.elevenLabsWS.readyState === WebSocket.OPEN) {
          clearInterval (interval);
          console.log ('Connection has been opened');
          resolve ();
        }
        currentAttempt++;
      }, intervalTime);
    });
  };

  /**
    * Waits for the WebSocket connection to finish.
    * @private
    * @function _waitForFinish
    * @return {Promise} Resolves when the connection has finished.
    * @throws {Error} If the maximum number of attempts is exceeded.
    */
  _waitForFinish () {
    return new Promise ((resolve, reject) => {
      const maxNumberOfAttempts = 200;
      const intervalTime = 50; // ms
      let currentAttempt = 0;
      const interval = setInterval (() => {
        if (currentAttempt > maxNumberOfAttempts - 1) {
          console.log (this.socketFinished, !this.isProcessing, !this.audioQueue.length);

          clearInterval (interval);
          reject (new Error ('Maximum number of attempts exceeded'));
        } else if (this.socketFinished && !this.isProcessing && !this.audioQueue.length) {
          console.log (this.socketFinished, !this.isProcessing, !this.audioQueue.length);
          clearInterval (interval);
          console.log ('Socket has finished');
          resolve ();
        }
        currentAttempt++;
      }, intervalTime);
    });
  };

  /**
    * Connects to Eleven Labs and initializes the WebSocket connection.
    * @private
    * @async
    * @function connect
    * @throws {Error} If an error occurs while connecting.
    */
  async _connect () {
    this.socketFinished = false;
    this.elevenLabsWS = new WebSocket (this.elevenLabsWSUrl);

    this.elevenLabsWS.onopen = (event) => {
      logDev ('ElevenLabsOnOpen');
      const bosMessage = {
        text: ' ',
        voice_settings: {
          stability: 0.5,
          similarity_boost: true,
        },
        xi_api_key: this.apiKey,
      };

      this.elevenLabsWS.send (JSON.stringify (bosMessage));
    };

    // Initialize connection by sending the BOS message
    // Handle server responses
    this.elevenLabsWS.onmessage = (event) => {
      const response = JSON.parse (event.data);

      if (response.audio) {
        logDev (`Audio received`);
        // this.audioQueue.push(response.audio.slice(0));

        this.audioQueue.push (response.audio);

        // Process the audio data if there is no ongoing operation
        if (!this.isProcessing) {
          this._processQueue ();
        }
      }

      if (response.isFinal) {
        this.socketFinished = true;
      }

      if (response.normalizedAlignment) {

      }
    };

    // Handle errors
    this.elevenLabsWS.onerror = (error) => {
      console.error (`WebSocket Error: ${error}`);
      reject (error);
    };

    // Handle this.elevenLabsWS closing
    this.elevenLabsWS.onclose = (event) => {
      logDev ('ElevenLabsOnClose');
      if (event.wasClean) {
        console.info (`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.warn ('Connection died');
      }
    };

    try {
      await this._waitForOpen ();
    } catch (err) {
      logWarning (err);
      reject (err);
    }
  }

  /**
    * Sends a message to be converted to speech.
    * @async
    * @function sendChunk
    * @param {string} message - The message to be converted to speech.
    */
  async sendChunk (message) {
    if (!message.trim ()) {
      logDev ('ElevenLabs sendChunk: Invalid message');
      return;
    }

    logDev (`sendChunk: ${message}`);
    message = message.trim () + ' ';

    const textMessage = {
      text: message,
      try_trigger_generation: true,
    };

    this.elevenLabsWS.send (JSON.stringify (textMessage));
  }

  /**
    * Sends a full message to be converted to speech.
    * @async
    * @function sendFull
    * @param {string} message - The message to be converted to speech.
    */
  async sendFull (message) {
    message = message.trim () + ' ';

    const textMessage = {
      text: message,
      try_trigger_generation: true,
    };

    this.elevenLabsWS.send (JSON.stringify (textMessage));

    await this.reset ();
  }

  /**
    * Closes the connection to Eleven Labs.
    * @async
    * @function closeConnection
    */
  async closeConnection () {
    // Close the connection with the EOS message
    const eosMessage = {
      text: '',
    };

    if (this.elevenLabsWS.readyState === WebSocket.OPEN) {
      this.elevenLabsWS.send (JSON.stringify (eosMessage));
    } else {
      logWarning ('WebSocket is not open');
    }
  }

  /**
    * Resets the connection to Eleven Labs.
    * @async
    * @function reset
    */
  async reset () {
    // Close the connection with the EOS message
    const eosMessage = {
      text: '',
    };

    if (this.elevenLabsWS.readyState === WebSocket.OPEN) {
      this.elevenLabsWS.send (JSON.stringify (eosMessage));
    }

    await this._waitForFinish ();

    await this._connect ();
  }

  /**
    * Processes the audio data queue.
    * @async
    * @function _processQueue
    */
  async _processQueue () {
    logDev (this.audioQueue.length);
    if (this.audioQueue.length > 0) {
      this.isProcessing = true;
      const audio = this.audioQueue.shift ();

      // Process the audio data
      await this._sendDataOverSocket (audio);

      // Continue with the next item in the queue
      if (this.audioQueue.length == 0) {
        this.isProcessing = false;
      }
      this._processQueue ();
    }
  }

  /**
    * Sends audio data over the WebSocket.
    * @function _sendDataOverSocket
    * @param {string} base64Data - The audio data in base64 format.
    * @return {Promise} Resolves when the data has been sent.
    */
  _sendDataOverSocket (base64Data) {
    // data = data.replace("UklGRv////9XQVZFZm10IBIAAAAHAAEAQB8AAEAfAAABAAgAAABMSVNUGgAAAElORk9JU0ZUDQAAAExhdmY2MC4zLjEwMAAAZGF0Yf////8=////////////////////", '');
    logDev ('SendDataOverSocket');
    // logDev(base64Data);
    return new Promise ((resolve, reject) => {
      const data = Buffer.from (base64Data, 'base64');
      const stream = streamifier.createReadStream (data);

      const command = ffmpeg (stream)
          .inputFormat ('mp3')
          .format ('wav')
          .audioCodec ('pcm_mulaw')
          .audioChannels (1)
          .audioFrequency (8000)
          .on ('error', function (err, stdout, stderr) {
            console.error ('Error processing audio data with ffmpeg:', err);
            console.error ('ffmpeg stdout:', stdout);
            console.error ('ffmpeg stderr:', stderr);
            console.error ('ffmpeg data:', base64Data);
          });

      const ffstream = command.pipe ();

      ffstream.on ('data', (pcmData) => {
        const base64AudioData = Buffer.from (pcmData).toString ('base64');

        const twilioMessage = {
          event: 'media',
          streamSid: this.twilioSID,
          media: {
            payload: base64AudioData,
          },
        };

        if (base64AudioData.startsWith ('UklGRv////9XQVZFZm10IBIAAAAHAAEAQB8AAEAfAAABAAgAAABMSVNUGgAA')) {

        } else {
          const twilioMessageString = JSON.stringify (twilioMessage);

          if (!this.twilioWS) {
            logWarning ('TwilioWS is not instanciated');
            console.log (twilioMessage);
          } else {
            this.twilioWS.send (twilioMessageString);
          }
        }
      });

      ffstream.on ('end', () => {
        resolve ();
      });

      ffstream.on ('error', (err) => {
        reject (err);
      });
    });
  }
}


module.exports = {
  Call,
};
