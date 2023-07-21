// firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD7yrcF4hX7D4JClbtoU5Y4zS9BkfxH5kk",
  authDomain: "call-to-action-2afc3.firebaseapp.com",
  databaseURL: "https://call-to-action-2afc3-default-rtdb.firebaseio.com",
  projectId: "call-to-action-2afc3",
  storageBucket: "call-to-action-2afc3.appspot.com",
  messagingSenderId: "643217092679",
  appId: "1:643217092679:web:ff26c58b0c3c66cd020162",
  measurementId: "G-VEZGEG7S0H"
};

const app = initializeApp(firebaseConfig);


// You can export the auth functions here
export {
  app,
  firebaseConfig
};