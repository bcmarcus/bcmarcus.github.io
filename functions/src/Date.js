const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.getCurrentTimestamp = functions.https.onCall(async (data, context) => {
  try {
    const timestamp = admin.firestore.Timestamp.now();
    const dateTime = new Date(timestamp.toMillis());

    const payload = {
      timestamp: timestamp.toMillis(),
      date: dateTime.toLocaleDateString(),
      time: dateTime.toLocaleTimeString(),
    };

    return payload;
  } catch (error) {
    console.error("Error occurred:", error);
    throw new functions.https.HttpsError('internal', 'An internal error occurred.');
  }
});