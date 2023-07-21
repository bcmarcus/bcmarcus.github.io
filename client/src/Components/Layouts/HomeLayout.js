import React from 'react';
import Header from '../Layouts/Header';
import '/src/Assets/Layouts/homePageLayout.css';

const HomeLayout = ({ children }) => {
  return (
    <div className="home-page-layout">

      <Header/>

      {/* content */}
      <div className='home-page-layout-content'>
        { children }
      </div>
      {/* content */}
    </div>
  );
};

export default HomeLayout;
