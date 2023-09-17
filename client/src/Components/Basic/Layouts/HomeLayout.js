import React from 'react';
import Header from '../Header/Header';
import '/src/Assets/Public/Layouts/homePageLayout.css';

const HomeLayout = ({ children }) => {
  const links = [
    { title: 'About', url: '/about' },
    { title: 'Disclaimer', url: '/legal/disclaimer' },
    { title: 'Privacy Policy', url: '/legal/privacy-policy' },
    { title: 'SMS Terms and Conditions', url: '/legal/sms-terms-and-conditions' },
    { title: 'Terms and Conditions', url: '/legal/terms-and-conditions' },
    { title: 'Data Processing Agreement', url: '/legal/dpa' },
    { title: 'Contact Us', url: '/contact' },
    { title: 'Log In', url: '/login' },
  ];

  return (
    <div className="home-page-layout flex flex-col h-screen">
      <Header links={links}/>
      <div className='flex home-page-layout-content smooth-transition theme-primary'>
        { children }
      </div>
    </div>
  );
};

export default HomeLayout;
