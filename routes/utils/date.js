const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require('express');
const router = express.Router();

router.get('/date', async (req, res) => {
  try {
    const timestamp = admin.firestore.Timestamp.now();
    const dateTime = new Date(timestamp.toMillis());

    const payload = {
      timestamp: timestamp.toMillis(),
      date: dateTime.toLocaleDateString(),
      time: dateTime.toLocaleTimeString(),
    };

    await logDebug (payload);
    res.json(payload); 
  } catch (error) {
    await logWarning ("Error occurred:", error.message);
    res.status(500).send('An internal error occurred.');
  }
});

module.exports = router;