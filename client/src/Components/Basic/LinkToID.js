import React from 'react';

function LinkToID ({ url, urlTitle, ...props }) {
  return (
    <a href={url} className="dark:text-light-accent underline hover:font-bold" title={urlTitle}>
      {urlTitle}
    </a>
  );
}

export default LinkToID;
