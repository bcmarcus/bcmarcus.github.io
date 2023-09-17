import React from 'react';
import '/src/Assets/Public/Login/login.css';

const PasswordInput = ({ value, onChange }) => {
  return (
    <input
      className="text-black"
      type="password"
      placeholder="Password"
      name="password"
      id="password"
      autocomplete="new-password"
      value={value}
      onChange={onChange}
    />
  );
};

export default PasswordInput;
