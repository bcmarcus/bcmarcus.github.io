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
        <h1 className="title theme-secondary smooth-transition">Vulpine AI SMS Terms and Conditions</h1>
        <h2 className="subtitle theme-secondary font-bold smooth-transition">Last updated 09/15/2023</h2>
        <Card className="theme-primary smooth-transition max-w-screen-2xl mb-24">
          <div className="mx-8 text-xl max-w-screen-2xl">
            <p className="paragraph mt-6">
              1. This program will send messages to users in one of three scenarios. Firstly, if the user makes an inquiry or starts an action with Vulpine AI through either the dashboard, calling, email, or SMS. The second way, is when Vulpine AI completes an action and needs to inform the user about it. The third and final way is if the user enables progress reports, then Vulpine AI will send reports whenever big subtasks have been completed within each action.
            </p>
            <p className="paragraph">
              2. You can cancel the SMS service at any time. Just text "STOP" to the phone number, or disable it in the dashboard. After you send the SMS message "STOP" to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us. If you want to join again, it must be reenabled in the dashboard.
            </p>
            <p className="paragraph">
              3. If you are experiencing issues with the messaging program you can reply with the keyword "HELP" for more assistance, or you can get help directly at dev@vulpine.ai
            </p>
            <p className="paragraph">
              4. Carriers are not liable for delayed or undelivered messages.
            </p>
            <p className="paragraph">
              5. As always, message and data rates may apply for any messages sent to you from us and to us from you. If you have any questions about your text plan or data plan, it is best to contact your wireless provider.
            </p>
            <p className="paragraph">
              6. If you have any questions regarding privacy, please read our <a href="/legal/privacy-policy" className="text-dark-accent dark:text-light-accent underline hover:font-bold" title="privacy policy">privacy policy</a>
            </p>
          </div>
        </Card>
      </div>
    </HomeLayout>
  );
};

export default SMSTermsAndConditions;
