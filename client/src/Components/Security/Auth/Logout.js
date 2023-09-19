import React, { useEffect, useState } from 'react';
// import { signOut, getIdToken, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '/src/Providers/Firebase';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { auth } = useAuth ();
  const navigate = useNavigate ();
  const [token, setToken] = useState (null);

  const handleSignOut = async () => {
    try {
      await signOut (auth);
      navigate ('/');
    } catch (error) {
      console.error ('Error signing out:', error);
    }
  };

  useEffect (() => {
    const unsubscribe = onAuthStateChanged (auth, async (user) => {
      if (user) {
        const token = await getIdToken (user);
        setToken (token);
      }
    });

    return () => {
      unsubscribe ();
    };
  }, []);

  return (
    <div>
      <h1>Log out</h1>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Logout;
