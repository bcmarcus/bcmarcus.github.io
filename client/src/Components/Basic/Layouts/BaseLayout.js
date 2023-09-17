// src/components/HeaderComponent/index.jsx
import React from 'react';
import '/src/Assets/Public/Layouts/singlePageLayout.css';
import Header from '../../Basic/Header/Header';

const BaseLayout = ({ children }) => {
  const links = [
    { title: 'Log In', url: '/login' },
    { title: 'About', url: '/about' },
    { title: 'Privacy Policy', url: '/privacy' },
    { title: 'Contact Us', url: '/contact' },
  ];

  return (
    <div className="single-page-layout">

      {/* header */}
      <Header links={links}/>

      {/* content */}
      <div className='single-page-layout-content theme-primary'>
        { children }
      </div>

      {/* footer */}
    </div>
  );
};

export default BaseLayout;
