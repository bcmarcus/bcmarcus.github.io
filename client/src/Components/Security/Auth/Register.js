import React, { useState } from 'react';
import { useAuth } from '/src/Providers/Firebase';
import { useNavigate, Link } from 'react-router-dom';
import PasswordInput from '../../Basic/Forms/PasswordInput';
import EmailInput from '../../Basic/Forms/EmailInput';
import BaseLayout from '../../Basic/Layouts/BaseLayout';
import googleLogo from '/src/Assets/Public/External/googleLogo.png';
import appleLogo from '/src/Assets/Public/External/appleLogo.png';
import '/src/Assets/Public/Login/login.css';
import InputField from '../../Basic/Forms/InputField';

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

        <form onSubmit={handleSubmit} className="flex flex-col items-start mt-5">
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail (e.target.value)}
            className="mb-2 box-border p-2 border-gray-300 w-full text-lg"
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword (e.target.value)}
            className="mb-2 box-border p-2 border-gray-300 w-full text-lg"
          />
          <InputField
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword (e.target.value)}
            className="mb-2 box-border p-2 border-gray-300 w-full text-lg"
          />
          <div className="form-container">
            <button type="submit" className="bg-blue-500 text-white p-2 border-none rounded-md w-full font-bold cursor-pointer mt-0 hover:bg-blue-700">Register</button>
          </div>

          {error && (
            <p className="text-red-600 font-bold text-lg mt-2 mb-0">{error}</p>
          )}

          <div className="flex items-center justify-center my-5 w-full">
            <span className="flex-grow h-px bg-black mr-2"></span>
            <span>or</span>
            <span className="flex-grow h-px bg-black ml-2"></span>
          </div>

          <button className="flex items-center justify-center bg-white text-black p-2 border-gray-300 rounded-md w-full font-bold cursor-pointer mb-2 hover:bg-gray-200">
            <img src={googleLogo} alt="Google logo" className="w-5 h-5 mr-2" />
    Sign up with Google
          </button>
          <button className="flex items-center justify-center bg-white text-black p-2 border-gray-300 rounded-md w-full font-bold cursor-pointer mb-2 hover:bg-gray-200">
            <img src={appleLogo} alt="Apple logo" className="w-5 h-5 mr-2" />
    Sign up with Apple
          </button>
        </form>

      </div>
    </BaseLayout>
  );
};

export default Register;
