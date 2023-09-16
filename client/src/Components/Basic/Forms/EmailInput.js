import React from 'react';
import '/src/Assets/Login/login.css';

const EmailInput = ({ value, onChange }) => {
  return (
    <input
      className="text-black"
      type="email"
      placeholder="Email"
      name="email"
      id="email"
      autocomplete="email"
      value={value}
      onChange={onChange}
    />
  );
};

export default EmailInput;
