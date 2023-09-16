const WebSocket = require('ws');

const voiceId = "2EiwWnXFnvU5JabPnv8n"; // replace with your voice_id
const model = 'eleven_monolingual_v1';
const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_type=${model}?optimize_streaming_latency=4`;
const socket = new WebSocket(wsUrl);

// 2. Initialize the connection by sending the BOS message
socket.onopen = function (event) {
    const bosMessage = {
        "text": " ",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": true
        },
        "chunk_length_schedule": [50, 50, 50, 50],
        "xi_api_key": "50a1d803799f2e42f61fbb7716e4cce5", // replace with your API key
    };

    console.log (bosMessage);
    socket.send(JSON.stringify(bosMessage));

    // 3. Send the input text message ("Hello World")
    const textMessage = {
        "text": "Hello World ",
        "try_trigger_generation": true,
    };

    console.log (textMessage);

    socket.send(JSON.stringify(textMessage));

    const textMessage2 = {
        "text": "How are you? ",
        "try_trigger_generation": false,
    };

    // socket.send(JSON.stringify(textMessage2));

    // socket.send(JSON.stringify(textMessage2));
    // socket.send(JSON.stringify(textMessage2));
    // socket.send(JSON.stringify(textMessage2));

    // 4. Send the EOS message with an empty string
    const eosMessage = {
        "text": ""
    };

    socket.send(JSON.stringify(eosMessage));

    // sleep(5000).then(() => {
    //     socket.send(JSON.stringify(bosMessage));

    //     socket.send(JSON.stringify(textMessage2));

    //     socket.send(JSON.stringify(eosMessage));
    // });
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}  

// 5. Handle server responses
socket.onmessage = function (event) {
    const response = JSON.parse(event.data);

    console.log("Server response:", response);

    if (response.audio) {
        // decode and handle the audio data (e.g., play it)
        console.log("Received audio chunk");
    } else {
        console.log("No audio data in the response");
    }

    if (response.isFinal) {
        console.log (WebSocket.OPEN);
        console.log (socket.readyState);
    }

    if (response.normalizedAlignment) {
        // use the alignment info if needed
    }
};

// Handle errors
socket.onerror = function (error) {
    console.error(`WebSocket Error: ${error}`);
};

// Handle socket closing
socket.onclose = function (event) {
    if (event.wasClean) {
        console.info(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
    } else {
        console.warn('Connection died');
    }
};
