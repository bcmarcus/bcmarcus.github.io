const WebSocket = require('ws');
const { spawn } = require('child_process');
const pythonProcess = spawn('python3', ['./audioProcessorv2.py']);
const express = require('express');
const fs = require('fs');
const WaveFile = require('wavefile').WaveFile;

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

function isBase64(str) {
  const base64Regex = /^([A-Za-z0-9+/]{4})*(([A-Za-z0-9+/]{2}==)|([A-Za-z0-9+/]{3}=))?$/;
  return base64Regex.test(str);
}


// When a message is received from the client
wss.on('connection', ws => {
  var audioData = [];
  ws.on('message', async message => {
    const msg = JSON.parse(message);
    switch (msg.event) {
      case 'connected':
        console.log(`A new call has connected.`);
        break;

      case 'start':
        twilioStreamSid = msg.streamSid; // Capture the StreamSid
        console.log(`Starting Media Stream ${twilioStreamSid}`);
        break;
      case 'media':
        // if (isBase64(msg.media.payload)) {
        //     console.log(`Valid Base64: ${msg.media.payload}`);
        // } else {
        // console.log('The payload is not a valid Base64 string.');
        // }
        const incomingData = Buffer.from(msg.media.payload, 'base64');
    
        // Add audioData to the array
        audioData.push(incomingData);

        // Write the mulaw/8000 data to the Python process's stdin
        pythonProcess.stdin.write(incomingData);
        break;


      case 'stop':
        // Convert audioData array to buffer
        const audioBuffer = Buffer.concat(audioData);

        // Create a new WaveFile object
        const wav = new WaveFile();
        
        // Load the audio data into the WaveFile object
        wav.fromScratch(1, 8000, '8m', audioBuffer);
        
        // Convert the 'audio/x-mulaw' audio data to PCM format
        wav.fromMuLaw();

        fs.writeFile("test.wav", wav.toBuffer(), (err) => {
          if (err) throw err;
          console.log('The "data to append" was appended to file!');
        });

        console.log(`Stopping Media Stream ${twilioStreamSid}`);
        break;
    }
  });
});

// When start and end times are received from the Python process
pythonProcess.stdout.on('data', data => {
  console.log(`Python Data: ${data}`);
});


// Handle if any error occurs
pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
});

app.post('/', (req, res) => {
  res.set('Content-Type', 'text/xml');
  res.send(`
    <Response>
      <Connect>
        <Stream url="wss://${req.headers.host}/"/>
      </Connect>
    </Response>
  `);
});

server.listen(8080);

console.log("Server listening on 8080!");
