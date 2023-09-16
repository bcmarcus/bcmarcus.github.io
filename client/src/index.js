// main file
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FirebaseApp, App } from './App'; // import the App component
import 'tailwindcss/tailwind.css';
import './index.css';

const root = createRoot (document.getElementById ('root'));

root.render (
    <FirebaseApp>
      <App />
    </FirebaseApp>,
);
