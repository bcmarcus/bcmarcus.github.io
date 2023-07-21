//Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '/src/FirebaseContexts'; 
import PasswordInput from "./PasswordInput";
import EmailInput from "./EmailInput";
import BaseLayout from '../Layouts/BaseLayout';
import googleLogo from '/src/Assets/External/googleLogo.png';
import appleLogo from '/src/Assets/External/appleLogo.png';
import '/src/Assets/Login/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signin, googleProvider, appleProvider, signInWithPopup, afterSignin, resetPassword, token, auth } = useAuth();

  const navigate = useNavigate();
  
  if (token) {
    navigate('/dashboard');
    console.log("token: ", token);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signin(email, password);
      navigate('/dashboard');
    } catch (error) {
      // test to see if it contains network-request-failed
      setError('Error logging in.')
      console.error('Error logging in: ' + error);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    try {
      await resetPassword(auth, email);
      setError (null);
      console.log('Password reset email sent. Check your email.');
    } catch (error) {
      setError('Error sending password reset email.');
      console.error('Error sending password reset email:', error);
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await afterSignin (user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const signInWithApple = async () => {
    try {
      const { user } = await signInWithPopup(auth, appleProvider);
      await afterSignin (user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in with Apple:', error);
    }
  };

  return (
    <BaseLayout>
      <div>
        {/* Wrap the "Login" title, "or create an account" link, and the form in a container */}
        <div className="login-container">
          {/* Wrap the "Login" title and the "or create an account" link in a single container */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Update the "Login" heading */}
            <div className="login-heading">Login</div>

            {/* Add the "or create an account" link */}
            <div className="create-account-link">
              <Link to="/register">or create an account</Link>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Sign in</button>

            {/* Add a "Forgot password?" button */}
            {error && (
              <a href="#" onClick={handleForgotPassword} className="forgot-password-link login-a" style={{ display: 'flex', justifyContent: 'left' }}>Forgot Password?</a>
            )}

            {error && (
              <p className="error-message">{error}</p>
            )}

            <div className="divider">
              <span className="divider-line-left"></span>
              <span>or</span>
              <span className="divider-line-right"></span>
            </div>
          </form>
          <button className="google-button" onClick={signInWithGoogle}>
            <img src={googleLogo} alt="Google logo" />
            Sign in with Google
          </button>
          <button className="apple-button" onClick={signInWithApple}>
            <img src={appleLogo} alt="Apple logo" />
            Sign in with Apple
          </button>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Login;