const player = require('play-sound')();

// Replace 'path/to/your/audio/file.mp3' with the actual path to your audio file
const audioFilePath = 'path/to/your/audio/file.mp3';

// Play the audio file
player.play(audioFilePath, (err) => {
  if (err) {
    console.error('Error occurred while playing audio:', err);
  }
});



// get the twilio audio