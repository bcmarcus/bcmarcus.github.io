// FormLayout.js
import React from 'react';
import '/src/Assets/Public/Login/login.css';
import '/src/Assets/Public/Layouts/singlePageLayout.css';
import Header from '../../Basic/Header/Header';

const FormLayout = ({ children }) => {
  const links = [];

  return (
    <div className="single-page-layout theme-primary smooth-transition">

      {/* header */}
      <Header links={links}/>

      {/* content */}
      <div className='single-page-layout-content smooth-transition'>
        { children }
      </div>

      {/* footer */}
    </div>
  );
};

export default FormLayout;
