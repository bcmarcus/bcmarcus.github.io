const admin = require('firebase-admin');
admin.initializeApp();

const express = require('express');
const googleCloudRouter = require('./routes/googleCloud/googleCloudRouter');
const twilioRouter = require('./routes/twilio/twilioRouter');
const date = require('./routes/utils/date');
const port = process.env.PORT || 8080;

const config = require("./config/config.js");
global.domain = config.prod.app.domains[0];

// Import logWarning
const logWarning = require('./routes/utils/logging');
// Make logWarning global
global.logWarning = logWarning;

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// add "/route" as first param if needed
app.use(googleCloudRouter);
app.use(twilioRouter);
app.use(date);

app.listen(port, async () => {
  await logWarning(`Server is running on port ${port}`);
});
