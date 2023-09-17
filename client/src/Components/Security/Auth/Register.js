import React, { useState } from 'react';
import { useAuth } from '/src/Providers/Firebase';
import { useNavigate, Link } from 'react-router-dom';
import PasswordInput from '../../Basic/Forms/PasswordInput';
import EmailInput from '../../Basic/Forms/EmailInput';
import BaseLayout from '../../Basic/Layouts/BaseLayout';
import googleLogo from '/src/Assets/Public/External/googleLogo.png';
import appleLogo from '/src/Assets/Public/External/appleLogo.png';
import '/src/Assets/Public/Login/login.css';

const Register = () => {
  const [email, setEmail] = useState ('');
  const [password, setPassword] = useState ('');
  const [confirmPassword, setConfirmPassword] = useState ('');
  const [error, setError] = useState ('');
  const { signup, googleProvider, appleProvider, signInWithPopup, afterSignin, auth } = useAuth ();

  const navigate = useNavigate ();

  const handleSubmit = async (event) => {
    event.preventDefault ();
    try {
      await signup (email, password, confirmPassword);
      navigate ('/accountSetup');
    } catch (error) {
      if (error.toString () == 'Error: Passwords do not match') {
        setError (error.toString ());
      } else if (error.toString ().includes ('Password should be at least 6 characters')) {
        setError ('Password should be at least 6 characters');
      } else if (error.toString ().includes ('auth/email-already-in-use')) {
        setError ('Invalid credentials, email already in use');
      } else {
        setError ('Unknown error, please try again later');
      }
      console.error ('Error registering:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup (auth, googleProvider);
      await afterSignin (user);
    } catch (error) {
      setError (error.message);
    }
  };

  const signInWithApple = async () => {
    try {
      const { user } = await signInWithPopup (auth, appleProvider);
      await afterSignin (user);
    } catch (error) {
      setError (error.message);
    }
  };

  return (
    <BaseLayout>
      <div className="login-container theme-primary">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Update the "Login" heading */}
          <div className="login-heading">Register</div>

          {/* Add the "or create an account" link */}
          <div className="login-account-link">
            <Link className="text-dark-accent dark:text-light-accent hover:underline" to="/login">or log in</Link>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <EmailInput value={email} onChange={(e) => setEmail (e.target.value)} />
          <PasswordInput value={password} onChange={(e) => setPassword (e.target.value)} />
          <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword (e.target.value)} />
          <div className="form-container">
            <button type="submit">Register</button>
          </div>

          {error && (
            <p className="error-message">{error}</p>
          )}

          <div className="divider">
            <span className="divider-line-left"></span>
            <span>or</span>
            <span className="divider-line-right"></span>
          </div>

          <button className="google-button" onClick={signInWithGoogle}>
            <img src={googleLogo} alt="Google logo" />
            Sign up with Google
          </button>
          <button className="apple-button" onClick={signInWithApple}>
            <img src={appleLogo} alt="Apple logo" />
            Sign up with Apple
          </button>
        </form>
      </div>
    </BaseLayout>
  );
};

export default Register;
