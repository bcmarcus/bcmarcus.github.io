import React from 'react';
import HomeLayout from '/src/Components/Basic/Layouts/HomeLayout';
import RecaptchaV3 from '/src/Components/Security/AntiBot/RecaptchaV3';
import '/src/Assets/Public/basicStyles.css';

const Home = () => {
  return (
    <HomeLayout>
      {/* <RecaptchaV3 /> */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="title">Vulpine AI</h1>
        <h2 className="subtitle">In development</h2>
      </div>
    </HomeLayout>
  );
};

export default Home;
