import React from 'react';

// Row.js
function Row ({ columns, className }) {
  return (
    <tr className={`${className ? className : ''}`}>
      {columns && columns.map ((column, index) => (
        <th key={index} className={`border px-4 py-4 ${className ? className : ''} font-normal min-w-[12rem]`}>
          {column}
        </th>
      ))}
    </tr>
  );
}

export default Row;
