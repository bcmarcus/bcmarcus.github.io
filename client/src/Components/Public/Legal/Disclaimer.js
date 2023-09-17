import React from 'react';
import HomeLayout from '/src/Components/Basic/Layouts/HomeLayout';
import RecaptchaV3 from '/src/Components/Security/AntiBot/RecaptchaV3';
import '/src/Assets/Public/basicStyles.css';
import { Card } from 'react-bootstrap';

const SMSTermsAndConditions = () => {
  return (
    <HomeLayout>
      <RecaptchaV3 />
      <div className="theme-secondary smooth-transition flex-grow flex flex-col items-center">
        <h1 className="title theme-secondary smooth-transition">Vulpine AI DISCLAIMER</h1>
        <h2 className="subtitle theme-secondary font-bold smooth-transition">Last updated 09/15/2023</h2>
        <Card className="theme-primary smooth-transition max-w-screen-2xl mb-24">
          <div className="mx-8 text-xl max-w-screen-2xl">
            <h1 className="h1-heading mt-8">WEBSITE DISCLAIMER</h1>
            <p className="paragraph">
                The information provided by Vulpine AI ("we," "us," or "our") on vulpine.ai (the "Site") and our mobile application is for general informational purposes only.
                All information on the Site and our mobile application is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site or our mobile application.
                UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR OUR MOBILE APPLICATION OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE AND OUR MOBILE APPLICATION.
                YOUR USE OF THE SITE AND OUR MOBILE APPLICATION AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE AND OUR MOBILE APPLICATION IS SOLELY AT YOUR OWN RISK.
            </p>
          </div>
        </Card>
      </div>
    </HomeLayout>
  );
};

export default SMSTermsAndConditions;
