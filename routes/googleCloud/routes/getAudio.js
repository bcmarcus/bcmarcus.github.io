// getAudio.js
const express = require ('express');
const router = express.Router ();
const admin = require ('firebase-admin');
const bucket = admin.storage ().bucket ('gs://call-to-action-2afc3.appspot.com/');
const mime = require ('mime-types');
const path = require ('path');

/**
  * Returns the content type of a given file based on its extension.
  * @async
  * @function getContentType
  * @param {string} filepath - The path of the file.
  * @return {Promise<string>} The content type of the file.
  */
async function getContentType (filepath) {
  const extension = path.extname (filepath);
  return mime.contentType (extension) || 'application/octet-stream';
}

/**
  * Returns a reference to a file in a Google Cloud Storage bucket.
  * @async
  * @function getFile
  * @param {string} filePath - The path of the file in the bucket.
  * @return {Promise<admin.storage.File>} A reference to the file.
  */
async function getFile (filePath) {
  if (filePath.startsWith ('getAudio/')) {
    filePath = filePath.substring ('getAudio/'.length);
  }

  await logDev ('Getting audio at: ', filePath);

  return bucket.file (filePath);
}

/**
  * Express.js router for handling GET requests to retrieve audio files.
  * @name router:get
  * @function
  * @param {string} path - The path of the request.
  * @param {function} callback - The callback function to handle the request.
  */
router.get ('/:filepath*', async (req, res) => { // added :filepath*
  const filePath = req.params.filepath + req.params[0]; // added params[0] for multi-level path

  if (filePath === undefined) {
    await logDev ('Invalid storage file path: ', filePath);
    res.status (400).send ('Invalid file path');
    return;
  }

  const file = await getFile (filePath);

  // Check if file exists
  file.exists ().then (async (data) => {
    const exists = data[0];
    if (!exists) {
      await logDev ('File does not exist');
      res.status (404).send ('Not Found');
      return;
    } else {
      // Set the appropriate content type based on the file extension
      const contentType = await getContentType (filePath);
      res.set ('Content-Type', contentType);
      await logDev (contentType);

      // Stream the file content to the response
      file.createReadStream ()
          .on ('error', async function (err) {
            await logDev ('Error reading file', err);
            res.status (500).send ('Server Error');
          })
          .pipe (res);
    }
  })
      .catch (async (error) => {
        await logDev ('Error checking if file exists', error.message);
        res.status (500).send ('Server Error');
      });
});


module.exports = router;
