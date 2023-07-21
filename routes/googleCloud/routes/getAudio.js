//getAudio.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const bucket = admin.storage().bucket('gs://call-to-action-2afc3.appspot.com/');
const mime = require('mime-types');
const path = require('path');

function getContentType(filepath) {
    const extension = path.extname(filepath);
    return mime.contentType(extension) || 'application/octet-stream';
}

async function getFile(filePath) {
  if (filePath.startsWith('getAudio/')) {
    filePath = filePath.substring('getAudio/'.length);
  }

  console.log("Getting audio at: ", filePath);

  return bucket.file(filePath);
}

router.get('/:filepath*', async (req, res) => { // added :filepath*
  const filePath = req.params.filepath + req.params[0]; // added params[0] for multi-level path

  if (filePath === undefined) {
    console.log('Invalid storage file path: ', filePath);
    res.status(400).send('Invalid file path');
    return;
  }

  const file = await getFile(filePath);
  
  // Check if file exists
  file.exists().then(data => {
    const exists = data[0];
    if(!exists){
      console.log('File does not exist');
      res.status(404).send('Not Found');
      return;
    } 
    else {
      // Set the appropriate content type based on the file extension
      const contentType = getContentType(filePath);
      res.set('Content-Type', contentType);
      console.log(contentType);

      // Stream the file content to the response
      file.createReadStream()
      .on('error', function(err) {
        console.log('Error reading file', err);
        res.status(500).send('Server Error');
      })
      .pipe(res);
    }
  })
  .catch(error => {
    console.log('Error checking if file exists', error.message);
    res.status(500).send('Server Error');
  });
});


module.exports = router;