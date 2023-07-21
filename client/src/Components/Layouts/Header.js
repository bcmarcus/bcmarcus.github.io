import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/src/Assets/Logo/logo-placeholder-image.png';
import '/src/Assets/Layouts/homePageLayout.css';

const Header = () => {
  return (
      <header className="header">
        {/* header */}
        <Link to="/" className="header-button">
          <img src={logo} alt="Logo" className="header-logo"/>
        </Link>
        <nav className="header-buttons">
          <Link to="/login" className="login-button header-button">Log In</Link>
          <button className="menu-button header-button">Menu</button>
        </nav>
        {/* header */}
      </header>
  );
};

export default Header;