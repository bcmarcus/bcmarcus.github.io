import React from 'react';
import '/src/Assets/Login/login.css';

const PasswordInput = ({ value, onChange }) => {
  return (
    <input
      type="password"
      placeholder="Password"
      value={value}
      onChange={onChange}
    />
  );
};

export default PasswordInput;
