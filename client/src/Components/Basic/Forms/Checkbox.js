import React from 'react';

function Checkbox ({ label, url, urlTitle, required, ...props }) {
  return (
    <div className="flex items-center mb-4 mx-6">
      <input type="checkbox" className="mr-6" required={required} {...props} />
      <label>
        {label}
        {url && (
          <a href={url} className="text-dark-accent dark:text-light-accent underline hover:font-bold" title={urlTitle}>
            {urlTitle}
          </a>
        )}
      </label>
    </div>
  );
}

export default Checkbox;
