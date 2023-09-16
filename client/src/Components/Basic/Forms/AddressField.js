import React from 'react';
import InputField from './InputField';

function AddressField ({ onDelete }) {
  return (
    <div className="flex flex-col border rounded p-4 mb-4">
      <div className="flex">
        <InputField label="Title" />
      </div>
      <div className="flex">
        <InputField label="Street" type="text" name="street-address" id="street-address" autoComplete="street-address"/>
        <InputField label="Apartment or Suite Number" type="text" name="apartment" id="apartment" autoComplete="address-line2"/>
      </div>
      <div className="flex">
        <InputField label="City" type="text" name="city" id="city" autoComplete="address-level2"/>
        <InputField label="State" type="text" name="state" id="state" autoComplete="address-level1"/>
        <InputField label="ZIP" type="text" name="postal-code" id="postal-code" autoComplete="postal-code"/>
        <InputField label="Country" type="text" name="country" id="country" autoComplete="country"/>
      </div>
      <button onClick={onDelete} className="self-end mt-2 text-white text-lg bg-red-500 border-8 border-red-500 hover:bg-red-700 hover:border-red-700 transition duration-500 ease-in-out transform">
        Delete
      </button>
    </div>
  );
}

// maybe for mobile?
// function AddressField ({ onDelete }) {
//   return (
//     <div className="flex flex-col border rounded p-4 mb-4">
//       <InputField label="Title" />
//       <InputField label="Street" />
//       <InputField label="Apartment or Suite Number" />
//       <InputField label="City" />
//       <InputField label="State" />
//       <InputField label="ZIP" />
//       <InputField label="Country" />
//       <button onClick={onDelete} className="self-end mt-2 text-red-500">Delete</button>
//     </div>
//   );
// }

export default AddressField;
