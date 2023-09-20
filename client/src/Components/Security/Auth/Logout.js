import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useAuth } from '/src/Providers/Firebase';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { auth } = useAuth ();
  const navigate = useNavigate ();

  const handleSignOut = async () => {
    try {
      await signOut (auth);
      navigate ('/');
    } catch (error) {
      console.error ('Error signing out:', error);
    }
  };

  useEffect (() => {
    handleSignOut ();
  }, []);

  return null;
};

export default Logout;
