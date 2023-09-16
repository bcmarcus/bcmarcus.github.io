// ProvideAuth.js
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getIdToken, signOut, sendPasswordResetEmail, signInWithCustomToken } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

const ProvideAuth = ({ auth, children }) => {
  const [user, setUser] = useState (null);
  const [token, setToken] = useState (null);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);

  const afterSignin = async (user) => {
    const token = await getIdToken (user);
    localStorage.setItem ('jwtToken', token);
    setToken (token);
    setUser (user);
  };

  const signup = async (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      throw new Error ('Passwords do not match');
    }
    const { user } = await createUserWithEmailAndPassword (auth, email, password);
    await afterSignin (user);
    console.log ('Successfully registered\n');
  };

  const signin = async (email, password) => {
    const { user } = await signInWithEmailAndPassword (auth, email, password);
    await afterSignin (user);
    console.log ('Successfully Signed In\n');
  };

  const signout = async () => {
    await signOut (auth);
    localStorage.removeItem ('jwtToken');
    setToken (null);
    setUser (null);
    console.log ('Successfully Signed Out\n');
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail (auth, email);
    console.log ('Password reset email sent. Check your email.');
  };

  return children;
};

export default ProvideAuth;
