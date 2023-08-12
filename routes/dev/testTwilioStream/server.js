const WebSocket = require('ws');
const { spawn } = require('child_process');
const pythonProcess = spawn('python3', ['./audioProcessor.py']);
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

function isBase64(str) {
  const base64Regex = /^([A-Za-z0-9+/]{4})*(([A-Za-z0-9+/]{2}==)|([A-Za-z0-9+/]{3}=))?$/;
  return base64Regex.test(str);
}


// When a message is received from the client
wss.on('connection', ws => {

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
        if (isBase64(msg.media.payload)) {
            // console.log(`Valid Base64: ${msg.media.payload}`);
            const audioData = Buffer.from(msg.media.payload, 'base64');
            pythonProcess.stdin.write(audioData.toString('base64') + '\n');
          } else {
            console.log('The payload is not a valid Base64 string.');
        }
        break;


      case 'stop':
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
    <Start>
      <Stream url="wss://${req.headers.host}/"/>
    </Start>
    <Say>I will stream the next 5 seconds of audio through your websocket</Say>
    <Pause length="5" />
    </Response>
  `);
});

server.listen(8080);

console.log("Server listening on 8080!");
