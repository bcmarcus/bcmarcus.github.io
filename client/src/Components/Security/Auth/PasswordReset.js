// PasswordReset.js
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '/src/Providers/Firebase';


const PasswordReset = () => {
  const [email, setEmail] = useState ('');
  const [message, setMessage] = useState ('');
  const { auth } = useAuth ();

  const handleSubmit = async (e) => {
    e.preventDefault ();
    try {
      await sendPasswordResetEmail (auth, email);
      setMessage ('A password reset email has been sent to your inbox.');
    } catch (error) {
      setMessage (error.message);
    }
  };

  return (
    <div>
      <h1>Password Reset</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail (e.target.value)} required />
        </label>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PasswordReset;
