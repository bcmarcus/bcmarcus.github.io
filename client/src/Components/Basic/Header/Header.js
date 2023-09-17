import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '/src/Providers/Theme';
import logo from '/src/Assets/Public/Logo/logo-placeholder-image.png';
import HeaderLink from './HeaderLink';

const MOBILE_VIEW_MAX_WIDTH = 768; // Maximum screen size for mobile view

const Header = (links={ links: [] }) => {
  links = links.links;

  const { theme, toggleTheme } = useTheme ();
  const [isOpen, setIsOpen] = useState (false);
  const [isMobileView, setIsMobileView] = useState (window.innerWidth <= MOBILE_VIEW_MAX_WIDTH);

  useEffect (() => {
    const handleResize = () => setIsMobileView (window.innerWidth <= MOBILE_VIEW_MAX_WIDTH);
    window.addEventListener ('resize', handleResize);
    return () => window.removeEventListener ('resize', handleResize);
  }, []);

  const mobileMenu = useRef ();
  useEffect (() => {
    function handleClickOutside (event) {
      if (mobileMenu.current && !mobileMenu.current.contains (event.target)) {
        // The click was outside the div, handle it here
        setIsOpen (false);
      }
    }

    // Attach the listeners on component mount
    document.addEventListener ('mousedown', handleClickOutside);

    // Clean up the listeners on component unmount
    return () => {
      document.removeEventListener ('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setIsOpen (!isOpen);

  const accent = `${theme}-accent`;

  return (
    <header className={`relative theme-secondary smooth-transition h-32 z-10`}>
      <div className="mx-auto flex justify-between items-center h-full">
        <Link to="/" className={`font-bold text-xl text-${accent}`}>
          <img src={logo} alt="Logo" className="ml-6 h-32 w-auto"/>
        </Link>
        {!isMobileView && <nav className={`${isOpen ? 'block' : 'hidden'} mr-6 md:block h-full`}>
          <div className="h-full flex items-stretch">
            {links.map ((link) => (
              <HeaderLink key={link.url} title={link.title} url={link.url} />
            ))}
            <div onClick={toggleTheme} className={`smooth-transition theme-secondary hover-theme`}>
              <button className={`flex items-center justify-center h-full text-lg font-bold mx-4`}>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        </nav>}
        <div onClick={toggleMenu} className={`${isMobileView ? 'block' : 'hidden'} h-full flex items-stretch md:hidden smooth-transition theme-secondary hover-theme`}>
          <button className={`flex items-center justify-center h-full text-lg font-bold mx-4`}>
                Menu
          </button>
        </div>
      </div>

      {isMobileView && <div>
        <div className={`fixed right-0 top-0 w-screen h-screen bg-gray-500 opacity-50 ${isOpen ? 'block' : 'hidden'}`}></div>
        <div ref={mobileMenu} className={`fixed items-end right-0 top-0 w-64 h-screen theme-secondary smooth-transition ${isOpen ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-0'}`} >
          <nav className={`flex md:block h-full w-64 theme-secondary`}>
            <div className="w-full flex flex-col items-stretch">
              {links.map ((link) => (
                <HeaderLink key={link.url} title={link.title} url={link.url} isVertical={true} />
              ))}
              <div onClick={toggleTheme} className={`smooth-transition theme-secondary hover-theme`}>
                <button className={`flex h-16 items-center justify-center w-full text-lg font-bold `}>
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
          </nav>
          <button onClick={() => setIsOpen (false)} className={`absolute top-1/2 transition-transform duration-300 -translate-y-1/2 m-2 transition-none rounded-full p-2 theme-secondary w-10 h-10 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>}
    </header>
  );
};

export default Header;
