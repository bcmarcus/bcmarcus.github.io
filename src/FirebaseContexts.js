//FirebaseContexts.js
import React, { useContext, useState, useEffect  } from 'react';

import { createContext } from 'react';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, getIdToken, signOut, sendPasswordResetEmail, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';


export const FirestoreContext = createContext();
export const StorageContext = createContext();
export const DatabaseContext = createContext();
export const FunctionsContext = createContext();
export const AuthContext = createContext();

export const FirestoreProvider = ({ children, app }) => {
  const firestore = getFirestore(app);
  return <FirestoreContext.Provider value={firestore}>{children}</FirestoreContext.Provider>;
};

export const StorageProvider = ({ children, app }) => {
  const storage = getStorage(app);
  return <StorageContext.Provider value={storage}>{children}</StorageContext.Provider>;
};

export const DatabaseProvider = ({ children, app }) => {
  const database = getDatabase(app);
  return <DatabaseContext.Provider value={database}>{children}</DatabaseContext.Provider>;
};

export const FunctionsProvider = ({ children, app }) => {
  const functions = getFunctions(app);
  return <FunctionsContext.Provider value={functions}>{children}</FunctionsContext.Provider>;
};

export const AuthProvider = ({ children, app }) => {
  const auth = getAuth(app);
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const googleProvider = new GoogleAuthProvider();
  const appleProvider = new OAuthProvider("apple.com");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const storedToken = localStorage.getItem('jwtToken');

      if (user) {
        setToken(storedToken);
        setUser(user);
      } else {
        setToken(null);
        setUser(null);
      }

      setError(false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const afterSignin = async (user) => {
    const token = await getIdToken(user);
    localStorage.setItem('jwtToken', token);
    setToken(token);
    setUser(user);
  } 

  const signup = async (email, password, confirmPassword) => {
    if (password != confirmPassword) {
      throw new Error ('Passwords do not match');
    }
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await afterSignin (user);
    console.log('Successfully registered\n');
  };

  const signin = async (email, password) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    await afterSignin (user);
    console.log('Successfully Signed In\n');
  };

  const signout = async (auth) => {
    await signOut(auth);
    localStorage.removeItem('jwtToken');
    setToken(null);
    setUser(null);
    console.log('Successfully Signed Out\n');
  };

  const resetPassword = async (auth, email) => {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent. Check your email.');
  };
  
  return (
    <AuthContext.Provider value={{ googleProvider, appleProvider, auth, user, token, loading, error, signin, signout, signup, afterSignin, resetPassword}}>
      {children}
    </AuthContext.Provider>
  );

  // return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useFirestore = () => {
  return useContext(FirestoreContext);
};

export const useStorage = () => {
  return useContext(StorageContext);
};

export const useDatabase = () => {
  return useContext(DatabaseContext);
};

export const useFunctions = () => {
  return useContext(FunctionsContext);
};

export const useAuth = () => {
  return useContext(AuthContext);
};