const fs = require('fs');
const WebSocket = require('ws');
const WaveFile = require('wavefile').WaveFile;

class TwilioMediaStreamSaveAudioFile {
  constructor(options) {
    this.saveLocation = options.saveLocation || __dirname;
    this.saveFilename = options.saveFilename || Date.now();
    this.onSaved = options.onSaved || null;
    this.websocket = null;
    this.audioData = [];  // Add this line to hold all audio data
  }

  get filename() {
    return `${this.saveFilename}.wav`;
  }

  get writeStreamPath() {
    return `${this.saveLocation}/${this.filename}`;
  }

  setWebsocket(websocket) {
    this.websocket = websocket;
  }

  twilioStreamStart() {
    this.websocket.on('message', (data) => {
      // Parse the JSON data
      const msg = JSON.parse(data.toString());
    
      // Check if the message contains audio data
      if (msg.event === 'media') {
        // Decode the base64-encoded audio data
        const audioData = Buffer.from(msg.media.payload, 'base64');
    
        // Add audioData to the array
        this.audioData.push(audioData);
      }
    });
  }

  twilioStreamStop() {
    // Convert audioData array to buffer
    const audioBuffer = Buffer.concat(this.audioData);
    // Create a new WaveFile object
    const wav = new WaveFile();
    
    // Load the audio data into the WaveFile object
    wav.fromScratch(1, 8000, '8m', audioBuffer);
    
    // Convert the 'audio/x-mulaw' audio data to PCM format
    wav.fromMuLaw();
    
    // Write the WaveFile object to a file
    fs.writeFile(this.writeStreamPath, wav.toBuffer(), (err) => {
      if (err) throw err;
      console.log('The "data to append" was appended to file!');
    });

    if (this.onSaved) {
      this.onSaved();
    }
  }
}

module.exports = TwilioMediaStreamSaveAudioFile;
