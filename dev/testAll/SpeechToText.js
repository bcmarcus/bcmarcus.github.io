const { spawn } = require('child_process');
const speech = require('@google-cloud/speech');
const { logDebug } = require('../../routes/utils/logging');

const SPEAKING_COUNTER = 4
const VAD_CONFIDENCE = 0.5

class SpeechToText {
  constructor() {
    this.VAD = spawn('python3', ['./audioProcessor.py']);
    this.speechStarted = false;
    this.ttsStarted = false;
    this.ttsFinished = false;
    this.noDataTimer = null;

    this.updated = false;
    this.transcript = '';
    this.counter = 0;
  
    this.VAD.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });

    this.client = new speech.SpeechClient();
    this.stream = null;
    this.buffer = [];
  }

  async handleAudioData(data) {
    this.buffer.push(data);
    
    // If the buffer has more than 4 chunks (i.e., ~100 ms), send it to Google Speech-to-Text
    if (this.buffer.length >= 4) {
      await this.write(Buffer.concat(this.buffer));
      this.buffer = [];
    }

    this.resetNoDataTimer();
  }

  async resetNoDataTimer() {
    if (this.noDataTimer) {
      clearTimeout(this.noDataTimer);
    }
    this.noDataTimer = setTimeout(() => {
      this.ttsFinished = true;
    }, 15000);
  }

  async start() {
    logDebug("TTS: Started");
    this.ttsStarted = true;
  }
  
  async stop () {
    if (this.stream) {
      this.stream.end();
      this.stream = undefined;
      this.speechStarted = false;
      this.ttsStarted = false;
      this.ttsFinished = false;
      this.counter = 0;
    }
  }

  async off() {
    this.stop();
    if (this.noDataTimer) {
      clearTimeout(this.noDataTimer);
    }
  }

  async write(data) {
    if (this.ttsStarted && !this.ttsFinished) {
      this.VAD.stdin.write(data);
    }

    if (!this.stream && this.ttsStarted) {
      logDebug ("TTS: Starting Stream to Google");
      this.stream = this.client.streamingRecognize({
        config: {
          encoding: 'MULAW',
          sampleRateHertz: 8000,
          languageCode: 'en-US',
        },
      }).on('data', data => {
        logDebug(`TTS Transcription: ${data.results[0].alternatives[0].transcript}`);
        this.updated = true;
        this.transcript = data.results[0].alternatives[0].transcript + ' ';
      });
    }

    if (this.ttsStarted && !this.ttsFinished) {
      // logDebug("Sending SpeechToText");
      this.stream.write(data);
    }
  }

  async *generateSequence() {
    while (!this.ttsFinished) {
      yield new Promise(resolve => {
        this.VAD.stdout.once('data', (data) => {
          // logDebug(`TTS: Python Data = ${data}`);

          if (data.toString() > VAD_CONFIDENCE) {
            this.speechStarted = true;
            this.counter = 0;
          } else {
            this.counter++;
            resolve();
          }
          if (this.counter >= SPEAKING_COUNTER && this.ttsStarted && this.speechStarted) {
            logDebug("TTS: Finished");
            this.ttsFinished = true;
          }
          
          resolve();
        });
      });
    }

    this.stop()
  }
  
  getTranscript() {
    return new Promise((resolve, reject) => {
      let checkInterval = setInterval(() => {
        if (this.updated) {
          clearInterval(checkInterval);
          clearTimeout(rejectTimeout);
          resolve(this.transcript);
          this.updated = false;
        }
      }, 10); // checks every 100ms
  
      let rejectTimeout = setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('updated did not become true within 5 seconds'));
      }, 5000); // rejects after 5 seconds
    });
  }
  
}

module.exports = SpeechToText;