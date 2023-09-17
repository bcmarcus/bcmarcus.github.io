import React from 'react';

function Card ({ title, children, className}) {
  return (
    <div className={`theme-primary flex flex-col shadow-md rounded p-6 m-4 w-full smooth-transition ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
    </div>
  );
}

export default Card;
