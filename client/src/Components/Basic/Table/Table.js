import React from 'react';
import Row from './Row';

// Table.js
function Table ({ children, columns, className }) {
  return (
    <table className={`table-auto border-collapse w-full my-12 ${className}`}>
      <thead>
        {columns && <Row columns={columns} className="py-2 !font-bold"></Row>}
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export default Table;
