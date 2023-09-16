import React, { useContext, useState, useEffect } from 'react';

export const ThemeContext = React.createContext ();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState (
      localStorage.getItem ('theme') ||
    (window.matchMedia && window.matchMedia ('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  );

  // Apply the theme to the body element
  useEffect (() => {
    document.body.className = '';
    document.body.classList.add (theme);
    localStorage.setItem ('theme', theme);
  }, [theme]);

  // Toggle the theme
  function toggleTheme () {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme (newTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext (ThemeContext);
};
