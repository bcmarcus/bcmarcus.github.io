import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderLink = ({ title, url, isVertical=false }) => {
  const navigate = useNavigate ();

  if (!isVertical) {
    return (
      <div onClick={() => navigate (url)} className={`smooth-transition theme-secondary hover-theme`}>
        <div className={`flex items-center justify-center h-full text-lg font-bold mx-4`}>{title}</div>
      </div>
    );
  } else {
    return (
      <div onClick={() => navigate (url)} className={`w-full smooth-transition theme-secondary hover-theme`}>
        <div to="/login" className={`flex items-center justify-center h-16 w-full text-lg font-bold `}>{title}</div>
      </div>
    );
  }
};

export default HeaderLink;
