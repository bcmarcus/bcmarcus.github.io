import React, { useState } from 'react';

function InputField ({ label, validation, className, ...props }) {
  const [error, setError] = useState ('');

  const handleChange = (e) => {
    const isValid = validation (e.target.value);
    if (!isValid) {
      setError ('Invalid input');
    } else {
      setError ('');
    }
    if (props.onChange) props.onChange (e);
  };

  return (
    <div className={`theme-primary smooth-transition flex flex-grow flex-col ${className}`}>
      {label && <label className="mb-2">{label}</label>}
      <input className="smooth-transition theme-primary text-black border rounded p-2" {...props} onChange={handleChange} />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default InputField;
