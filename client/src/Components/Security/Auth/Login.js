// Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../Providers/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import FormLayout from '../../Basic/Layouts/FormLayout';
import googleLogo from '/src/Assets/Public/External/googleLogo.png';
import appleLogo from '/src/Assets/Public/External/appleLogo.png';
import '/src/Assets/Public/Login/login.css';
import InputField from '../../Basic/Forms/InputField';
import { alwaysValid } from '../../Security/InputValidation';

const Login = () => {
  const [email, setEmail] = useState ('');
  const [password, setPassword] = useState ('');
  const [error, setError] = useState ('');
  const { signin, googleProvider, appleProvider, signInWithPopup, afterSignin, resetPassword, auth } = useAuth ();
  const [user, setUser] = useState (null);
  const [token, setToken] = useState (null);
  const [loading, setLoading] = useState (true);

  const navigate = useNavigate ();

  useEffect (() => {
    const unsubscribe = onAuthStateChanged (auth, (user) => {
      if (user) {
        // User is signed in, get the token
        user.getIdToken ().then ((token) => {
          // Save the token to local storage
          localStorage.setItem ('jwtToken', token);
          setToken (token);
          setUser (user);
          navigate ('/dashboard');
        });
      } else {
        // User is signed out
        setToken (null);
        setUser (null);
      }
      setError (false);
      setLoading (false);
    });

    return () => unsubscribe ();
  }, [auth, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault ();
    try {
      await signin (email, password);
      navigate ('/dashboard');
    } catch (error) {
      // test to see if it contains network-request-failed
      setError ('Error logging in.');
      console.error ('Error logging in: ' + error);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault ();
    try {
      await resetPassword (auth, email);
      setError (null);
      console.log ('Password reset email sent. Check your email.');
    } catch (error) {
      setError ('Error sending password reset email.');
      console.error ('Error sending password reset email:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup (auth, googleProvider);
      await afterSignin (user);
      navigate ('/dashboard');
    } catch (error) {
      console.error ('Error signing in with Google:', error);
    }
  };

  const signInWithApple = async () => {
    try {
      const { user } = await signInWithPopup (auth, appleProvider);
      await afterSignin (user);
      navigate ('/dashboard');
    } catch (error) {
      console.error ('Error signing in with Apple:', error);
    }
  };

  return (
    <FormLayout>
      <div className="theme-primary smooth-transition">
        {/* Wrap the "Login" title, "or create an account" link, and the form in a container */}
        <div className="login-container theme-primary smooth-transition">
          {/* Wrap the "Login" title and the "or create an account" link in a single container */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Update the "Login" heading */}
            <div className="login-heading">Login</div>

            {/* Add the "or create an account" link */}
            <div className="create-account-link">
              <Link className="text-dark-accent dark:text-light-accent hover:underline smooth-transition" to="/register">or create an account</Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-start mt-5">
            <InputField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail (e.target.value)}
              className="mb-2 box-border p-0 border-gray-300 w-full text-lg"
              innerClassName="w-full"
              validation={alwaysValid}
            />
            <InputField
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword (e.target.value)}
              className="mb-2 box-border p-0 border-gray-300 w-full text-lg"
              innerClassName="w-full"
              validation={alwaysValid}
            />
            <button type="submit" className="bg-blue-500 text-white p-2 border-none rounded-md w-full font-bold cursor-pointer mt-0 hover:bg-blue-700">Sign in</button>


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
    </FormLayout>
  );
};

export default Login;
