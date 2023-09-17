import React from 'react';
import HomeLayout from '../../Basic/Layouts/HomeLayout';
import RecaptchaV3 from '../../Security/AntiBot/RecaptchaV3';
import '../../../Assets/Public/basicStyles.css';
import Card from '../../Basic/Card';
import LinkToID from '../../Basic/LinkToID';
import Table from '../../Basic/Table/Table';
import Row from '../../Basic/Table/Row';

const SMSTermsAndConditions = () => {
  return (
    <HomeLayout>
      <RecaptchaV3 />
      <div className="theme-secondary smooth-transition flex-grow flex flex-col items-center">
        <h1 className="title theme-secondary smooth-transition">Vulpine AI Privacy Policy</h1>
        <h2 className="subtitle theme-secondary font-bold smooth-transition">Last updated 09/15/2023</h2>
        <Card className="theme-primary smooth-transition max-w-screen-2xl mb-24">
          <div className="mx-8 text-xl max-w-screen-2xl">
            <h1 className="h1-heading mt-8">AGREEMENT TO OUR LEGAL TERMS</h1>
            <p className="paragraph">
              This privacy notice for Vulpine AI LLC ("we," "us," or "our"), describes how and why we might collect, store, use, and/or share ("process") your information when you use our services ("Services"), such as when you:
            </p>
            <ul className="list">
              <li className="list-element">Visit our website at https://vulpine.ai/, or any website of ours that links to this privacy notice</li>
              <li className="list-element">Engage with us in other related ways, including any sales, marketing, or events</li>
            </ul>
            <div className="paragraph">
              <p className="font-bold">Questions or concerns?</p>
              <p className="tab">Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at dev@vulpine.ai.</p>
            </div>
            <h2 id="our-services" className="h2-heading">SUMMARY OF KEY POINTS</h2>
            <p className="paragraph font-bold italic">
              This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our <LinkToID url="#table-of-contents" urlTitle="table of contents"></LinkToID> below to find the section you are looking for.
            </p>
            <div className="paragraph">
              <p className="font-bold">What personal information do we process?</p>
              <p className="tab">When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use. Learn more about <LinkToID url="#what-information-do-we-collect" urlTitle="personal information you disclose to us"></LinkToID> <br/>.</p>
            </div>
            <div className="paragraph">
              <p className="font-bold">Do we process any sensitive personal information?</p>
              <p className="tab">We may process sensitive personal information when necessary with your consent or as otherwise permitted by applicable law. Learn more about <LinkToID url="#what-information-do-we-collect" urlTitle="sensitive information we process"></LinkToID> </p>
            </div>
            <div className="paragraph">
              <p className="font-bold">Do we receive any information from third parties? </p>
              <p className="tab">We do not receive any information from third parties.</p>
            </div>
            <div className="paragraph">
              <p className="font-bold">How do we process your information?</p>
              <p className="tab">We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Learn more about <LinkToID url="#how-do-we-process-your-information" urlTitle="how we process your information"></LinkToID></p>
            </div>
            <div className="paragraph">
              <p className="font-bold">In what situations and with which types of parties do we share personal information?</p>
              <p className="tab">We may share information in specific situations and with specific categories of third parties. Learn more about <LinkToID url="#when-and-with-whom-do-we-share-your-information" urlTitle="when and with whom we share your personal information"></LinkToID>.</p>
            </div>
            <div className="paragraph">
              <p className="font-bold">How do we keep your information safe?</p>
              <p className="tab">
                We have organizational and technical processes and procedures in place to protect your personal information.
                However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.
                Learn more about <LinkToID url="#how-long-do-we-keep-your-information" urlTitle="how we keep your information safe"></LinkToID>.</p>
            </div>
            <div className="paragraph">
              <p className="font-bold">What are your rights?</p>
              <p className="tab">Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Learn more about <LinkToID url="#what-are-your-privacy-rights" urlTitle="your privacy rights"></LinkToID>.</p>
            </div>
            <div className="paragraph">
              <p className="font-bold">How do you exercise your rights?</p>
              <p className="tab">The easiest way to exercise your rights is by submitting a <a href="/legal/data-request" className="dark:text-light-accent underline hover:font-bold" title="data subject access request">data subject access request</a>, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.</p>
            </div>
            <p>Want to learn more about what we do with any information we collect? <LinkToID url="#table-of-contents" urlTitle="Review the privacy notice in full."></LinkToID></p>

            <h1 id="table-of-contents" className="h1-heading">TABLE OF CONTENTS</h1>
            <div className="smooth-transition tab">
              <LinkToID url="#what-information-do-we-collect" urlTitle="1. WHAT INFORMATION DO WE COLLECT?"></LinkToID> <br/>
              <LinkToID url="#how-do-we-process-your-information" urlTitle="2. HOW DO WE PROCESS YOUR INFORMATION?"></LinkToID> <br/>
              <LinkToID url="#what-legal-bases-do-we-rely-on" urlTitle="3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?"></LinkToID> <br/>
              <LinkToID url="#when-and-with-whom-do-we-share-your-information" urlTitle="4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?"></LinkToID> <br/>
              <LinkToID url="#do-we-use-cookies-and-other-tracking-technologies" urlTitle="5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?"></LinkToID> <br/>
              <LinkToID url="#how-do-we-handle-your-social-logins" urlTitle="6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?"></LinkToID> <br/>
              <LinkToID url="#is-your-information-transferred-internationally" urlTitle="7. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?"></LinkToID> <br/>
              <LinkToID url="#how-long-do-we-keep-your-information" urlTitle="8. HOW LONG DO WE KEEP YOUR INFORMATION?"></LinkToID> <br/>
              <LinkToID url="#how-do-we-keep-your-information-safe" urlTitle="9. HOW DO WE KEEP YOUR INFORMATION SAFE?"></LinkToID> <br/>
              <LinkToID url="#what-are-your-privacy-rights" urlTitle="10. WHAT ARE YOUR PRIVACY RIGHTS?"></LinkToID> <br/>
              <LinkToID url="#controls-for-do-not-track-features" urlTitle="11. CONTROLS FOR DO-NOT-TRACK FEATURES"></LinkToID> <br/>
              <LinkToID url="#do-california-residents-have-specific-privacy-rights" urlTitle="12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?"></LinkToID> <br/>
              <LinkToID url="#do-virginia-residents-have-specific-privacy-rights" urlTitle="13. DO VIRGINIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?"></LinkToID> <br/>
              <LinkToID url="#do-we-make-updates-to-this-notice" urlTitle="14. DO WE MAKE UPDATES TO THIS NOTICE?"></LinkToID> <br/>
              <LinkToID url="#how-can-you-contact-us-about-this-notice" urlTitle="15. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"></LinkToID> <br/>
              <LinkToID url="#how-can-you-review-update-or-delete-the-data-we-collect-from-you" urlTitle="16. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?"></LinkToID> <br/>
            </div>


            <h2 id="what-information-do-we-collect" className="h2-heading">1. WHAT INFORMATION DO WE COLLECT?</h2>
            <div className='tab'>
              <h3 className="h3-heading">Personal information you disclose to us</h3>
              <p className="paragraph">
                In Short: We collect personal information that you provide to us.
              </p>
              <p className="paragraph">
                We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
              </p>
              <h3 className="h3-heading">Personal Information Provided by You</h3>
              <p className="paragraph">
                The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
              </p>
              <ul className="list">
                <li className="list-element">names</li>
                <li className="list-element">phone numbers</li>
                <li className="list-element">email addresses</li>
                <li className="list-element">mailing addresses</li>
                <li className="list-element">job titles</li>
                <li className="list-element">usernames</li>
                <li className="list-element">passwords</li>
                <li className="list-element">contact preferences</li>
                <li className="list-element">contact or authentication data</li>
                <li className="list-element">billing addresses</li>
                <li className="list-element">debit/credit card numbers</li>
              </ul>

              <h3 className="h3-heading">Sensitive Information</h3>
              <p className="paragraph">
                When necessary, with your consent or as otherwise permitted by applicable law, we process the following categories of sensitive information:
              </p>
              <ul className="list">
                <li className="list-element">age</li>
                <li className="list-element">fitness data</li>
                <li className="list-element">health data</li>
                <li className="list-element">religion</li>
              </ul>

              <h3 className="h3-heading">Payment Data</h3>
              <p className="paragraph">
                We may collect data necessary to process your payment if you make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is stored by Stripe. You may find their privacy notice link(s) here: <a href="https://stripe.com/privacy" className="dark:text-light-accent underline hover:font-bold" title="stripe privacy">Stripe Privacy Policy</a>.
              </p>

              <h3 className="h3-heading">Social Media Login Data</h3>
              <p className="paragraph">
                We may provide you with the option to register with us using your existing social media account details, like your Facebook, Twitter, or other social media account. If you choose to register in this way, we will collect the information described in the section called "<LinkToID url="#how-do-we-handle-your-social-logins" urlTitle="HOW DO WE HANDLE YOUR SOCIAL LOGINS?"></LinkToID>" below.
              </p>
            </div>
            <p className="paragraph">
              All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
            </p>
            <div className="tab">
              <h3 className="h3-heading">Information automatically collected</h3>
              <p className="paragraph">
                In Short: Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.
              </p>
              <p className="paragraph">
                We automatically collect certain information when you visit, use, or navigate the Services.
                This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information.
                This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.
              </p>
              <p className="paragraph">
                Like many businesses, we also collect information through cookies and similar technologies.
              </p>
              <p className="paragraph">
                The information we collect includes:
              </p>
              <ul className="list">
                <li className="list-element">
                  Location Data. We collect location data such as information about your device's location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services.
                  For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address).
                  You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services.
                </li>
              </ul>
            </div>

            <h2 id="how-do-we-process-your-information" className="h2-heading">2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
            <p className="paragraph">
              In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.
            </p>
            <div className="tab">
              <h3 className="h3-heading mb-6">We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</h3>
              <ul className="list">
                <li className="list-element"><span className="font-bold">To facilitate account creation and authentication and otherwise manage user accounts.</span> We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
                <li className="list-element"><span className="font-bold">To deliver and facilitate delivery of services to the user.</span> We may process your information to provide you with the requested service.</li>
                <li className="list-element"><span className="font-bold">To respond to user inquiries/offer support to users.</span> We may process your information to respond to your inquirires and solve any potential issues you might have with the requested service.</li>
                <li className="list-element"><span className="font-bold">To fulfill and manage your orders.</span> We may proess your information to fulfill and manage your orders, payments, returns, and exchanges made through the Services.</li>
                <li className="list-element"><span className="font-bold">To request feedback.</span> We may process your information when necessary to request feedback and to contact you about your use of our Services.</li>
                <li className="list-element"><span className="font-bold">To identify usage trends.</span> We may process information about how you use our Services to better understand how they are being used so we can improve them.</li>
                <li className="list-element"><span className="font-bold">To save or protect an individual's vital interest.</span> We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm.</li>
              </ul>
            </div>

            <h2 id="what-legal-bases-do-we-rely-on" className="h2-heading">3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</h2>
            <p className="paragraph">
              In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.
            </p>
            <h3 className="h3-heading tab font-bold italic">If you are located in the EU or UK, this section applies to you.</h3>
            <p className="paragraph">
              The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information.
              As such, we may rely on the following legal bases to process your personal information:
            </p>
            <ul className="list tab">
              <li className="list-element"><span className="font-bold">Consent.</span> We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Learn more about <LinkToID url="#what-are-your-privacy-rights" urlTitle="withdrawing your consent"></LinkToID>.</li>
              <li className="list-element"><span className="font-bold">Performance of a Contract.</span> We may process your personal information when we believe it is necessary to fulfill our contractual obligations to youm including providing our Services or at your reuest prior to entering into a contract with you.</li>
              <li className="list-element"><span className="font-bold">Legitimate Interests.</span> We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh you interests and fundamental rights and freedoms.For example, we may process your personal information for some of the purposes described in order to:
                <ul className="list tab">
                  <li className="list-element">Analyze how our services are used so we can improve them to engage and retain users</li>
                  <li className="list-element">Understand how our users use our products and services so we can improve user experience</li>
                </ul>
              </li>
              <li className="list-element"><span className="font-bold">Legal Obligations.</span> We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.</li>
              <li className="list-element"><span className="font-bold">Vital Interests.</span> We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.</li>
            </ul>

            <h3 className="h3-heading tab font-bold italic">If you are located in Canada, this section applies to you.</h3>
            <p className="paragraph">
              We may process your information if you have given us specific permission (i.e., express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e., implied consent). You can <LinkToID url="#what-are-your-privacy-rights" urlTitle="withdraw your consent"></LinkToID> at any time.
            </p>
            <p className="paragraph">
              In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:
            </p>
            <ul className="list">
              <li className="list-element">If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way</li>
              <li className="list-element">For investigations and fraud detection and prevention</li>
              <li className="list-element">For business transactions provided certain conditions are met</li>
              <li className="list-element">If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim</li>
              <li className="list-element">For identifying injured, ill, or deceased persons and communicating with next of kin</li>
              <li className="list-element">If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse</li>
              <li className="list-element">If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province</li>
              <li className="list-element">If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records</li>
              <li className="list-element">If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced</li>
              <li className="list-element">If the collection is solely for journalistic, artistic, or literary purposes</li>
              <li className="list-element">If the information is publicly available and is specified by the regulations</li>
            </ul>

            <h2 id="when-and-with-whom-do-we-share-your-information" className="h2-heading">4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
            <p className="paragraph">
              In Short: We may share information in specific situations described in this section and/or with the following categories of third parties.
            </p>
            <div className='tab'>
              <h3 className="h3-heading">Vendors, Consultants, and Other Third-Party Service Providers</h3>
              <p className="paragraph">
                We may share your data with third-party vendors, service providers, contractors, or agents ("third parties") who perform services for us or on our behalf and require access to such information to do that work.
                We have contracts in place with our third parties, which are designed to help safeguard your personal information. This means that they cannot do anything with your personal information unless we have instructed them to do it.
                They will also not share your personal information with any organization apart from us. They also commit to protect the data they hold on our behalf and to retain it for the period we instruct.
                The categories of third parties we may share personal information with are as follows:
              </p>
              <ul className="list">
                <li className="list-element">Data Analytics Services</li>
                <li className="list-element">Finance & Accounting Tools</li>
                <li className="list-element">Payment Processors</li>
                <li className="list-element">Performance Monitoring Tools</li>
                <li className="list-element">User Account Registration & Authentication Services</li>
                <li className="list-element">Website Hosting Service Providers</li>
              </ul>
            </div>
            <p className='paragraph'>
              We also may need to share your personal information in the following situations:
            </p>
            <ul className="list tab">
              <li className="list-element"><span className='font-bold'>Business Transfers.</span> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
              <li className="list-element"><span className='font-bold'>Business Partners.</span> We may share your information with our business partners to offer you certain products, services, or promotions.</li>
            </ul>

            <h2 id="do-we-use-cookies-and-other-tracking-technologies" className="h2-heading">5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
            <p className="paragraph">
              In Short: We may use cookies and other tracking technologies to collect and store your information.
            </p>
            <p className='paragraph'>
              We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
            </p>

            <h2 id="how-do-we-handle-your-social-logins" className="h2-heading">6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h2>
            <p className="paragraph">
              In Short: If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.
            </p>
            <p className='paragraph'>
              Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or Twitter logins). Where you choose to do this, we will receive certain profile information about you from your social media provider.
              The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.
            </p>
            <p className="paragraph">
              We will use the information we receive only for the purposes that are described in this privacy notice or that are otherwise made clear to you on the relevant Services.
              Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider.
              We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.
            </p>


            <h2 id="#is-your-information-transferred-internationally" className="h2-heading">7. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?</h2>
            <p className="paragraph">
              In Short: We may transfer, store, and process your information in countries other than your own.
            </p>
            <p className="paragraph">
              Our servers are located in the United States.
              If you are accessing our Services from outside the United States, please be aware that your information may be transferred to, stored, and processed by us in our facilities and by those third parties with whom we may share your personal information (see "<LinkToID url="#when-and-with-whom-do-we-share-your-information" urlTitle='WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?'></LinkToID>" above), in the United States, and other countries.
            </p>
            <p className="paragraph">
              If you are a resident in the European Economic Area (EEA), United Kingdom (UK), or Switzerland, then these countries may not necessarily have data protection laws or other similar laws as comprehensive as those in your country.
              We have not yet actively implemented these data protection measures, or any from the European Commission's Standard Contractual Clauses. If you are one of these groups, then you should not use this service.
            </p>
            {/* However, we will take all necessary measures to protect your personal information in accordance with this privacy notice and applicable law. */}
            {/* European Commission's Standard Contractual Clauses: We have implemented measures to protect your personal information, including by using the European Commission's Standard Contractual Clauses for transfers of personal information between our group companies and between us and our third-party providers. These clauses require all recipients to protect all personal information that they process originating from the EEA or UK in accordance with European data protection laws and regulations. Our Data Processing Agreements that include Standard Contractual Clauses are available here: https://vulpine.ai/legal/dpa. We have implemented similar appropriate safeguards with our third-party service providers and partners and further details can be provided upon request. */}

            <h2 id="how-long-do-we-keep-your-information" className="h2-heading">8. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
            <p className="paragraph">
              In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.
            </p>
            <p className="paragraph">
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).
              No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.            </p>
            <p className="paragraph">
              When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
            </p>

            <h2 id="how-do-we-keep-your-information-safe" className="h2-heading">9. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
            <p className="paragraph">
              In Short: We aim to protect your personal information through a system of organizational and technical security measures.
            </p>
            <p className="paragraph">
              We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process.
              However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.
              Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
            </p>

            <h2 id="what-are-your-privacy-rights" className="h2-heading">10. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
            <p className="paragraph">
              In Short: In some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.
            </p>
            <p className="paragraph">
              In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right
              (i) to request access and obtain a copy of your personal information,
              (ii) to request rectification or erasure;
              (iii) to restrict the processing of your personal information;
              (iv) if applicable, to data portability; and
              (v) not to be subject to automated decision-making.
              In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section "<LinkToID url="#how-can-you-contact-us-about-this-notice" urlTitle="HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"></LinkToID>" below.
            </p>
            <p className="paragraph">
              We will consider and act upon any request in accordance with applicable data protection laws.
            </p>
            <p className="paragraph">
              If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your <a href="https://ec.europa.eu/newsroom/article29/items/612080" className="dark:text-light-accent underline hover:font-bold" title="Member State data protection authority">Member State data protection authority</a> or <a href="https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/" className="dark:text-light-accent underline hover:font-bold" title="UK data protection authority">UK data protection authority</a>.
            </p>
            <p className="paragraph">
              If you are located in Switzerland, you may contact the <a href="https://www.edoeb.admin.ch/edoeb/en/home.html" className="dark:text-light-accent underline hover:font-bold" title="Federal Data Protection and Information Commissioner">Federal Data Protection and Information Commissioner</a>.
            </p>
            <div className='tab'>
              <h3 className="h3-heading font-bold">Withdrawing your consent:</h3>
              <p className="paragraph">
                If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time.
                You can withdraw your consent at any time by contacting us by using the contact details provided in the section "<LinkToID url="#how-can-you-contact-us-about-this-notice" urlTitle="HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"></LinkToID>" below or updating your preferences.
              </p>
              <p className="paragraph">
                However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.
              </p>
              <h3 className="h3-heading">Account Information</h3>
              <p className="paragraph">
                If you would at any time like to review or change the information in your account or terminate your account, you can:
                <ul className="list">
                  <li className="list-element">Log in to your account settings and update your user account.\nUpon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.</li>
                </ul>
              </p>
              <p className="paragraph">
                Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases.
                However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.
              </p>

              <h3 className="h3-heading font-bold">Cookies and similar technologies:</h3>
              <p className="paragraph">
                Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies.
                If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services. You may also <a href="https://optout.aboutads.info/?c=2&lang=EN" className="dark:text-light-accent underline hover:font-bold" title="opt out of interest-based advertising by advertisers">opt out of interest-based advertising by advertisers</a> on our Services.
              </p>
              <p className="paragraph">
                If you have questions or comments about your privacy rights, you may email us at dev@vulpine.ai.
              </p>
            </div>

            <h2 id="controls-for-do-not-track-features" className="h2-heading">11. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
            <p className="paragraph">
              Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.
              At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.
              If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.
            </p>

            <h2 id="do-california-residents-have-specific-privacy-rights" className="h2-heading">12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
            <p className="paragraph">
              In Short: Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.
            </p>
            <p className="paragraph">
              California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year.
              If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.
            </p>
            <p className="paragraph">
              If you are under 18 years of age, reside in California, and have a registered account with Services, you have the right to request removal of unwanted data that you publicly post on the Services.
              To request removal of such data, please contact us using the contact information provided below and include the email address associated with your account and a statement that you reside in California.
              We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g., backups, etc.).
            </p>

            <div className='tab'>
              <h3 className="h3-heading font-bold">CCPA Privacy Notice</h3>
              <p className="paragraph">
                The California Code of Regulations defines a "resident" as:
                <ul className="list">
                  <li className="list-element">(1) every individual who is in the State of California for other than a temporary or transitory purpose and</li>
                  <li className="list-element">(2) every individual who is domiciled in the State of California who is outside the State of California for a temporary or transitory purpose</li>
                </ul>
              </p>

              <p className="paragraph">
                All other individuals are defined as "non-residents."
              </p>
              <p className="paragraph">
                If this definition of "resident" applies to you, we must adhere to certain rights and obligations regarding your personal information.
              </p>
              <h3 className="h3-heading font-bold tab">What categories of personal information do we collect?</h3>
              <p className="paragraph">
                We have collected the following categories of personal information in the past twelve (12) months:
              </p>

              <Table columns={['Category', 'Examples', 'Collected']}>
                <Row columns={['A. Identifiers', 'Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name', 'YES']} />
                <Row columns={['B. Personal information categories listed in the California Customer Records statute', 'Name, contact information, education, employment, employment history, and financial information', 'YES']} />
                <Row columns={['C. Protected classification characteristics under California or federal law', 'Gender and date of birth', 'YES']} />
                <Row columns={['D. Commercial information', 'Transaction information, purchase history, financial details, and payment information', 'YES']} />
                <Row columns={['E. Biometric information', 'Fingerprints and voiceprints', 'NO']} />
                <Row columns={['F. Internet or other similar network activity', 'Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements', 'NO']} />
                <Row columns={['G. Geolocation data', 'Device location', 'YES']} />
                <Row columns={['H. Audio, electronic, visual, thermal, olfactory, or similar information', 'Images and audio, video or call recordings created in connection with our business activities', 'YES']} />
                <Row columns={['I. Professional or employment-related information', 'Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us', 'NO']} />
                <Row columns={['J. Education Information', 'Student records and directory information', 'NO']} />
                <Row columns={['K. Inferences drawn from other personal information', 'Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual’s preferences and characteristics', 'NO']} />
                <Row columns={['L. Sensitive Personal Information', 'Age, fitness data, health data and religion', 'NO']} />
              </Table>

              <p className="paragraph">
                We will use and retain the collected personal information as needed to provide the Services or for:
              </p>
              <ul className="list">
                <li className="list-element">Category A - As long as the user has an account with us</li>
                <li className="list-element">Category B - As long as the user has an account with us</li>
                <li className="list-element">Category C - As long as the user has an account with us</li>
                <li className="list-element">Category D - As long as the user has an account with us</li>
                <li className="list-element">Category G - As long as the user has an account with us</li>
                <li className="list-element">Category H - As long as the user has an account with us</li>
              </ul>
              <p className="paragraph">
                We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:
              </p>
              <ul className="list">
                <li className="list-element">Receiving help through our customer support channels;</li>
                <li className="list-element">Participation in customer surveys or contests; and</li>
                <li className="list-element">Facilitation in the delivery of our Services and to respond to your inquiries.</li>
              </ul>

              <h3 className="h3-heading font-bold">How do we use and share your personal information?</h3>
              <p className="paragraph">
                More information about our data collection and sharing practices can be found in this privacy notice.
              </p>
              <p className="paragraph">
                You may contact us by email at dev@vulpine.ai, or by referring to the contact details at the bottom of this document.
              </p>
              <p className="paragraph">
                If you are using an authorized agent to exercise your right to opt out we may deny a request if the authorized agent does not submit proof that they have been validly authorized to act on your behalf.
              </p>

              <h3 className="h3-heading font-bold">Will your information be shared with anyone else?</h3>
              <p className="paragraph">
                We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Each service provider is a for-profit entity that processes the information on our behalf, following the same strict privacy protection obligations mandated by the CCPA.
              </p>
              <p className="paragraph">
                We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be "selling" of your personal information.
              </p>
              <p className="paragraph">
                We have not sold or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months.
                We have disclosed the following categories of personal information to third parties for a business or commercial purpose in the preceding twelve (12) months:
              </p>
              <ul className="list">
                <li className="list-element">Category A. Identifiers, such as contact details like your real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name.</li>
                <li className="list-element">Category B. Personal Information, as defined in the California Customer Records law, such as your name, contact information, education, employment, employment history, and financial information.</li>
                <li className="list-element">Category C. Characteristics of protected classifications under California or federal law, such as gender or date of birth.</li>
                <li className="list-element">Category D. Commercial information, such as transaction information, purchase history, financial details, and payment information.</li>
                <li className="list-element">Category G. Geolocation data, such as device location.</li>
              </ul>
              <p className="paragraph">
                The categories of third parties to whom we disclosed personal information for a business or commercial purpose can be found under "<LinkToID url="#when-and-with-whom-do-we-share-your-information" urlTitle="4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?"></LinkToID>".
              </p>
              <p className="paragraph">
                We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be "selling" of your personal information.
              </p>

              <h3 className="h3-heading font-bold">Your rights with respect to your personal data</h3>
              <p className="paragraph">
                Right to request deletion of the data — Request to delete
              </p>
              <div className="tab">
                <p className="paragraph">
                  You can ask for the deletion of your personal information. If you ask us to delete your personal information, we will respect your request and delete your personal information, subject to certain exceptions provided by law, such as (but not limited to) the exercise by another consumer of his or her right to free speech, our compliance requirements resulting from a legal obligation, or any processing that may be required to protect against illegal activities.
                </p>
              </div>
              <p className="paragraph">
                Right to be informed — Request to know
              </p>
              <div className="tab">
                <p className="paragraph">
                  the specific pieces of personal information we collected about you.\nIn accordance with applicable law, we are not obligated to provide or delete consumer information that is de-identified in response to a consumer request or to re-identify individual data to verify a consumer request.
                </p>
                <ul className="list">
                  <li className="list-element">whether we collect and use your personal information;</li>
                  <li className="list-element">the categories of personal information that we collect;</li>
                  <li className="list-element">the purposes for which the collected personal information is used;</li>
                  <li className="list-element">whether we sell or share personal information to third parties;</li>
                  <li className="list-element">the categories of personal information that we sold, shared, or disclosed for a business purpose;</li>
                  <li className="list-element">the categories of third parties to whom the personal information was sold, shared, or disclosed for a business purpose;</li>
                  <li className="list-element">the business or commercial purpose for collecting, selling, or sharing personal information; and</li>
                  <li className="list-element">the specific pieces of personal information we collected about you.</li>
                </ul>
                <p className="paragraph">
                  In accordance with applicable law, we are not obligated to provide or delete consumer information that is de-identified in response to a consumer request or to re-identify individual data to verify a consumer request.
                </p>
              </div>
              <p className="paragraph">
                Right to Non-Discrimination for the Exercise of a Consumer’s Privacy Rights
              </p>
              <div className="tab">
                <p className="paragraph">
                  We will not discriminate against you if you exercise your privacy rights.
                </p>
              </div>
              <p className="paragraph">
                Right to Limit Use and Disclosure of Sensitive Personal Information
              </p>
              <div className="tab">
                <p className="paragraph">
                  We do not process consumer's sensitive personal information.
                </p>
              </div>
              <p className="paragraph">
                Verification process
              </p>
              <div className="tab">
                <p className="paragraph">
                  Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. These verification efforts require us to ask you to provide information so that we can match it with information you have previously provided us. For instance, depending on the type of request you submit, we may ask you to provide certain information so that we can match the information you provide with the information we already have on file, or we may contact you through a communication method (e.g., phone or email) that you have previously provided to us. We may also use other verification methods as the circumstances dictate.
                </p>
                <p className="paragraph">
                  We will only use personal information provided in your request to verify your identity or authority to make the request. To the extent possible, we will avoid requesting additional information from you for the purposes of verification. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes. We will delete such additionally provided information as soon as we finish verifying you.
                </p>
              </div>

              <p className="paragraph">
                Other privacy rights
              </p>
              <div className="tab">
                <ul className="list">
                  <li className="list-element">You may object to the processing of your personal information.</li>
                  <li className="list-element">You may request correction of your personal data if it is incorrect or no longer relevant, or ask to restrict the processing of the information.</li>
                  <li className="list-element">You can designate an authorized agent to make a request under the CCPA on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with the CCPA.</li>
                  <li className="list-element">You may request to opt out from future selling or sharing of your personal information to third parties. Upon receiving an opt-out request, we will act upon the request as soon as feasibly possible, but no later than fifteen (15) days from the date of the request submission.</li>
                </ul>
                <p className="paragraph">
                  To exercise these rights, you can contact us by email at dev@vulpine.ai, or by referring to the contact details at the bottom of this document. If you have a complaint about how we handle your data, we would like to hear from you.
                </p>
              </div>
            </div>

            <h2 id="do-virginia-residents-have-specific-privacy-rights" className="h2-heading">13. DO VIRGINIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
            <p className="paragraph">
              In Short: Yes, if you are a resident of Virginia, you may be granted specific rights regarding access to and use of your personal information.
            </p>
            <div className="tab">
              <h3 className="h3-heading font-bold">Virginia CDPA Privacy Notice</h3>
              <p className="paragraph">
                Under the Virginia Consumer Data Protection Act (CDPA):
              </p>
              <p className="paragraph">
                "Consumer" means a natural person who is a resident of the Commonwealth acting only in an individual or household context. It does not include a natural person acting in a commercial or employment context.
              </p>
              <p className="paragraph">
                "Personal data" means any information that is linked or reasonably linkable to an identified or identifiable natural person. "Personal data" does not include de-identified data or publicly available information.
              </p>
              <p className="paragraph">
                "Sale of personal data" means the exchange of personal data for monetary consideration.
              </p>
              <p className="paragraph">
                If this definition "consumer" applies to you, we must adhere to certain rights and obligations regarding your personal data.
              </p>
              <p className="paragraph">
                The information we collect, use, and disclose about you will vary depending on how you interact with us and our Services. To find out more, please visit the following links:
              </p>
              <ul className="list">
                <li className="list-element"><LinkToID url="#what-information-do-we-collect" urlTitle="Personal data we collect"></LinkToID></li>
                <li className="list-element"><LinkToID url="#how-do-we-process-your-information" urlTitle="How we use your personal data"></LinkToID></li>
                <li className="list-element"><LinkToID url="#when-and-with-whom-do-we-share-your-information" urlTitle="When and with whom we share your personal data"></LinkToID></li>
              </ul>
              <h3 className="h3-heading font-bold">Your rights with respect to your personal data</h3>
              <ul className="list">
                <li className="list-element">Right to be informed whether or not we are processing your personal data</li>
                <li className="list-element">Right to access your personal data</li>
                <li className="list-element">Right to correct inaccuracies in your personal data</li>
                <li className="list-element">Right to request deletion of your personal data</li>
                <li className="list-element">Right to obtain a copy of the personal data you previously shared with us</li>
                <li className="list-element">Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects ("profiling")</li>
              </ul>
              <p className="paragraph">
                We have not sold any personal data to third parties for business or commercial purposes. We will not sell personal data in the future belonging to website visitors, users, and other consumers.
              </p>
              <h3 className="h3-heading font-bold">Exercise your rights provided under the Virginia CDPA</h3>
              <p className="paragraph">
                More information about our data collection and sharing practices can be found in this privacy notice.
              </p>
              <p className="paragraph">
                You may contact us by email at dev@vulpine.ai, by visiting the <a href="/legal/data-request" className="dark:text-light-accent underline hover:font-bold" title="data request form">data request form</a>, or by referring to the contact details at the bottom of this document.
              </p>
              <p className="paragraph">
                If you are using an authorized agent to exercise your rights, we may deny a request if the authorized agent does not submit proof that they have been validly authorized to act on your behalf.
              </p>
              <h3 className="h3-heading font-bold">Verification process</h3>
              <p className="paragraph">
                We may request that you provide additional information reasonably necessary to verify you and your consumer's request. If you submit the request through an authorized agent, we may need to collect additional information to verify your identity before processing your request.
              </p>
              <p className="paragraph">
                Upon receiving your request, we will respond without undue delay, but in all cases, within forty-five (45) days of receipt. The response period may be extended once by forty-five (45) additional days when reasonably necessary.
                We will inform you of any such extension within the initial 45-day response period, together with the reason for the extension.
              </p>
              <h3 className="h3-heading font-bold">Right to appeal</h3>
              <p className="paragraph">
                If we decline to take action regarding your request, we will inform you of our decision and reasoning behind it. If you wish to appeal our decision, please email us at dev@vulpine.ai.
                Within sixty (60) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions.
                If your appeal if denied, you may contact the <a href="https://www.oag.state.va.us/consumer-protection/index.php/file-a-complaint" className="dark:text-light-accent underline hover:font-bold" title="Attorney General to submit a complaint">Attorney General to submit a complaint</a>
              </p>
            </div>

            <h2 id="do-we-make-updates-to-this-notice" className="h2-heading">14. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
            <p className="paragraph">
              In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.
            </p>
            <p className="paragraph">
              We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.
              If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
            </p>

            <h2 id="how-can-you-contact-us-about-this-notice" className="h2-heading">15. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
            <p className="paragraph">
              If you have questions or comments about this notice, you may email us at dev@vulpine.ai or contact us by post at:
            </p>
            <p className="tab">Vulpine AI LLC</p>
            <p className="tab">830 Spruce St</p>
            <p className="tab">Riverside, CA 92507</p>
            <p className="paragraph">United States</p>

            <h2 id="how-can-you-review-update-or-delete-the-data-we-collect-from-you" className="h2-heading">16. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
            <p className="paragraph">
              Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it.
              To request to review, update, or delete your personal information, please visit: https://vulpine.ai/request.`
            </p>
          </div>
        </Card>
      </div>
    </HomeLayout>
  );
};

export default SMSTermsAndConditions;
