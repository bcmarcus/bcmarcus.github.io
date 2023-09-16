const { spawn } = require ('child_process');
const speech = require ('@google-cloud/speech');
const { logDev } = require ('../utils/logging');

const SPEAKING_COUNTER = 3;
const VAD_CONFIDENCE = 0.9;

/**
  * Class representing a SpeechToText.
  */
class SpeechToText {
  /**
    * Create a SpeechToText.
    */
  constructor () {
    this.VAD = spawn ('python3', ['./routes/audio/audioProcessor.py']);
    this.speechStarted = false;
    this.ttsStarted = false;
    this.ttsFinished = false;
    this.noDataTimer = null;

    this.updated = false;
    this.transcript = '';
    this.counter = 0;

    this.VAD.stderr.on ('data', (data) => {
      console.error (`Python Error: ${data}`);
    });

    this.client = new speech.SpeechClient ();
    this.stream = null;
    this.buffer = [];
  }

  /**
    * Handles audio data by buffering it and sending it to Google Speech-to-Text when the buffer is full.
    * @async
    * @function handleAudioData
    * @param {Buffer} data - The audio data to be handled.
    */
  async handleAudioData (data) {
    this.buffer.push (data);

    // If the buffer has more than 4 chunks (i.e., ~100 ms), send it to Google Speech-to-Text
    if (this.buffer.length >= 4) {
      await this.write (Buffer.concat (this.buffer));
      this.buffer = [];
    }

    this.resetNoDataTimer ();
  }

  /**
    * Resets the timer that determines when speech-to-text is finished.
    * @async
    * @function resetNoDataTimer
    */
  async resetNoDataTimer () {
    if (this.noDataTimer) {
      clearTimeout (this.noDataTimer);
    }
    this.noDataTimer = setTimeout (() => {
      this.ttsFinished = true;
    }, 15000);
  }

  /**
    * Starts the speech-to-text process.
    * @async
    * @function start
    */
  async start () {
    logDev ('TTS: Started');
    this.ttsStarted = true;
  }

  /**
    * Stops the speech-to-text process.
    * @async
    * @function stop
    */
  async stop () {
    if (this.stream) {
      this.stream.end ();
      this.stream = undefined;
      this.speechStarted = false;
      this.ttsStarted = false;
      this.ttsFinished = false;
      this.counter = 0;
    }
  }

  /**
    * Turns off the speech-to-text process.
    * @async
    * @function off
    */
  async off () {
    this.stop ();
    if (this.noDataTimer) {
      clearTimeout (this.noDataTimer);
    }
  }

  /**
    * Writes data to the speech-to-text process.
    * @async
    * @function write
    * @param {Buffer} data - The data to be written.
    */
  async write (data) {
    if (this.ttsStarted && !this.ttsFinished) {
      this.VAD.stdin.write (data);
    }

    if (!this.stream && this.ttsStarted) {
      logDev ('TTS: Starting Stream to Google');
      this.stream = this.client.streamingRecognize ({
        config: {
          encoding: 'MULAW',
          sampleRateHertz: 8000,
          languageCode: 'en-US',
        },
      }).on ('data', (data) => {
        logDev (`TTS Transcription: ${data.results[0].alternatives[0].transcript}`);
        this.updated = true;
        this.transcript = data.results[0].alternatives[0].transcript + ' ';
      });
    }

    if (this.ttsStarted && !this.ttsFinished) {
      // logDev("Sending SpeechToText");
      this.stream.write (data);
    }
  }

  /**
    * Generates a sequence of promises that resolve when speech is detected.
    * @async
    * @function generateSequence
    * @yields {Promise} A promise that resolves when speech is detected.
    */
  async* generateSequence () {
    while (!this.ttsFinished) {
      yield new Promise ((resolve) => {
        this.VAD.stdout.once ('data', (data) => {
          // logDev(`TTS: Python Data = ${data}`);

          if (data > VAD_CONFIDENCE) {
            logDev ('TTS: Speech Detected');
            this.speechStarted = true;
            this.counter = 0;
          } else {
            this.counter++;
            resolve ();
          }
          if (this.counter >= SPEAKING_COUNTER && this.ttsStarted && this.speechStarted) {
            logDev ('TTS: Finished');
            this.ttsFinished = true;
          }

          resolve ();
        });
      });
    }

    this.stop ();
  }

  /**
    * Gets the transcript from the speech-to-text process.
    * @function getTranscript
    * @return {Promise} A promise that resolves with the transcript.
    */
  getTranscript () {
    return new Promise ((resolve, reject) => {
      const checkInterval = setInterval (() => {
        if (this.updated) {
          clearInterval (checkInterval);
          clearTimeout (rejectTimeout);
          resolve (this.transcript);
          this.updated = false;
        }
      }, 10); // checks every 100ms

      const rejectTimeout = setTimeout (() => {
        clearInterval (checkInterval);
        reject (new Error ('updated did not become true within 5 seconds'));
      }, 5000); // rejects after 5 seconds
    });
  }
}

module.exports = SpeechToText;
