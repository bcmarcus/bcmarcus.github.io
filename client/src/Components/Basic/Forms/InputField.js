import React from 'react';

function InputField ({ label, ...props }) {
  return (
    <div className="flex flex-grow flex-col mb-4 mx-6">
      <label className="mb-2">{label}</label>
      <input className="text-black border rounded p-2" {...props} />
    </div>
  );
}

export default InputField;
