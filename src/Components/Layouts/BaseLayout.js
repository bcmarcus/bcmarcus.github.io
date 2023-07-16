// src/components/HeaderComponent/index.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/src/Assets/Logo/logo-placeholder-image.png';
import '/src/Assets/Layouts/singlePageLayout.css';

const BaseLayout = ({ children }) => {
  return (
    <div className="single-page-layout">

      {/* header */}
      <header className="header">
        <Link to="/" className="header-button">
          <img src={logo} alt="Logo" className="header-logo"/>
        </Link>
        <nav className="header-buttons">
          <Link to="/login" className="login-button header-button">Log In</Link>
          <button className="menu-button header-button">Menu</button>
        </nav>
      </header>

      {/* content */}
      <div className='single-page-layout-content'>
        { children }
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="social-media-icons">
            {/* Add your social media icons here */}
          </div>
          <div className="footer-links">
            {/* Add footer links to important pages, privacy policy, terms of service, etc. */}
          </div>
          <div className="copyright">
            {/* Add your copyright notice */}
          </div>
        </div>
      </footer>
      {/* footer */}
    </div>
  );
};

export default BaseLayout;