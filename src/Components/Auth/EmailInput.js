import React from 'react';
import '/src/Assets/Login/login.css';

const EmailInput = ({ value, onChange }) => {
  return (
    <input
      type="email"
      placeholder="Email"
      value={value}
      onChange={onChange}
    />
  );
};

export default EmailInput;