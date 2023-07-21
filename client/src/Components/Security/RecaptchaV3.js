import React, { useEffect, useRef } from 'react';
import { RecaptchaVerifier } from 'firebase/auth';
import { useAuth } from '/src/FirebaseContexts';

const RecaptchaV3 = () => {
  const recaptchaRef = useRef();
  const { auth } = useAuth();

  useEffect(() => {
    return;
    // if (auth.settings) {
    //   return;
    // }

    const recaptchaVerifier = new RecaptchaVerifier(recaptchaRef.current, {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, perform your desired action
        // console.log('reCAPTCHA solved:', response);
      },
      'expired-callback': () => {
        // Response expired, ask the user to solve reCAPTCHA again
        console.log('reCAPTCHA expired');
      },
    }, auth);

    recaptchaVerifier.verify().catch((error) => {
      console.error('reCAPTCHA error:', error);
    });
  }, []);  // Empty array means this effect runs once after the component mounts

  return (
    <div ref={recaptchaRef}></div>
  );
};

export default RecaptchaV3;
