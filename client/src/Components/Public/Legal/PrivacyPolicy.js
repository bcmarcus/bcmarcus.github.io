import React from 'react';
import HomeLayout from '/src/Components/Basic/Layouts/HomeLayout';
import RecaptchaV3 from '/src/Components/Security/AntiBot/RecaptchaV3';
import '/src/Assets/Home/home.css';

const PrivacyPolicy = () => {
  return (
    <HomeLayout>
      <RecaptchaV3 />
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="home-title">Vulpine AI Privacy Policy</h1>
        <h2 className="font-bold">Last updated 09/15/2023</h2>
      </div>
    </HomeLayout>
  );
};

export default PrivacyPolicy;
