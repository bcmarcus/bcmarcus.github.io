import React from 'react';
import HomeLayout from '/src/Components/Basic/Layouts/HomeLayout';
import RecaptchaV3 from '/src/Components/Security/AntiBot/RecaptchaV3';
import '/src/Assets/Home/home.css';

const SMSTermsAndConditions = () => {
  return (
    <HomeLayout>
      <RecaptchaV3 />
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="home-title">Vulpine AI SMS Terms and Conditions</h1>
        <ol>
          <li>Program Description</li>

          <li>You can cancel the SMS service at any time. Just text "STOP" to the short code. After you send the SMS message "STOP" to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us. If you want to join again, it must be reenabled in the dashboard.</li>

          <li>3. If you are experiencing issues with the messaging program you can reply with the keyword HELP for more assistance, or you can get help directly at dev@vulpine.ai</li>

          <li>4. Carriers are not liable for delayed or undelivered messages.</li>

          <li>5. As always, message and data rates may apply for any messages sent to you from us and to us from you. You will receive messages in one of two scenarios. First, if you message us. One or more responses may be sent to you. Secondly, if you start an action, either through messages or through the dashboard. You will be notified when the action has been completed. If enabled, you will also be notified of the status of your action. If you have any questions about your text plan or data plan, it is best to contact your wireless provider.</li>

          <li>6. If you have any questions regarding privacy, please read our <a href="/legal/privacy-policy" className="text-dark-accent dark:text-light-accent underline hover:font-bold" title="privacy policy">privacy policy</a></li>
        </ol>
      </div>
    </HomeLayout>
  );
};

export default SMSTermsAndConditions;
