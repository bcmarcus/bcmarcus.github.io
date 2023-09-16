import React from 'react';
import HomeLayout from '/src/Components/Basic/Layouts/HomeLayout';
import RecaptchaV3 from '/src/Components/Security/AntiBot/RecaptchaV3';
import '/src/Assets/Home/home.css';

const DataProcessingAgreement = () => {
  return (
    <HomeLayout>
      <RecaptchaV3 />
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="home-title">Data Processing Agreement</h1>
        <h2 className="mt-4 text-xl">In development</h2>
      </div>
    </HomeLayout>
  );
};

export default DataProcessingAgreement;
