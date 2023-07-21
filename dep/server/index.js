const admin = require('firebase-admin');
admin.initializeApp();

const { AskGPT } = require("./src/AskGPT.js.js.js");
const { getCurrentTimestamp } = require("./src/Date.js.js.js");
const { call, getAudio, transcribe } = require("./src/Call.js.js.js");

exports.AskGPT = AskGPT;
exports.getCurrentTimestamp = getCurrentTimestamp;
exports.call = call;
exports.getAudio = getAudio;
exports.transcribe = transcribe;
