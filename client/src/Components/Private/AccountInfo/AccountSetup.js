import React, { useEffect, useState } from 'react';
import { useAuth, useFirestore } from '/src/Providers/Firebase';
import { useNavigate } from 'react-router-dom';
import '/src/Assets/Private/Dashboard/Dashboard.css';

import AddressField from '../../Basic/Forms/AddressField';
import Card from '../../Basic/Card';
import Checkbox from '../../Basic/Forms/Checkbox';
import InputField from '../../Basic/Forms/InputField';
import FormLayout from '../../Basic/Layouts/FormLayout';

import { validateFirstName, validateLastName, validatePhoneNumber, validatePhoneNumberAgreements, validateAll } from '../../Security/InputValidation';

const AccountSetup = () => {
  const { user } = useAuth ();
  const { getData } = useFirestore ();

  const [hasPhoneNumber, setHasPhoneNumber] = useState (false);
  const [error, setError] = useState (false);

  const navigate = useNavigate ();

  useEffect (() => {
    const fetchData = async () => {
      if (user) {
        console.log (user.uid);
        const data = await getData ('users', user.uid);
        console.log (data);
      }
    };

    fetchData ();
  }, [user, getData]);

  const [addresses, setAddresses] = useState ([{}]);

  const handleAddAddress = () => {
    setAddresses ([...addresses, {}]);
  };

  const handleDeleteAddress = (index) => {
    setAddresses (addresses.filter ((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault ();
    event.preventDefault ();
    const formData = new FormData (event.target);

    if (!validatePhoneNumberAgreements (formData.get ('phone'), formData.get ('agree-to-calls'), formData.get ('agree-to-text'), formData.get ('agree-to-text-conditions'))) {
      setError ('A phone number has been set, but you have not accepted the conditions. You may either accept just the phone calling agreement, just the texting agreements, or both the calling and the text agreements.');
      return;
    }
    for (const pair of formData.entries ()) {
      console.log (pair[0] + ', ' + pair[1]);
    }
    const allErrors = validateAll (formData);
    if (allErrors) {
      setError (allErrors);
      return;
    }

    navigate ('/dashboard');
  };

  return (
    <FormLayout>
      <div className="theme-secondary flex flex-col items-center justify-center smooth-transition">
        <div className="max-w-6xl font-bold text-2xl">
          None of this information is required, however it will provide a better experience.
          If you want to access your personal assistant through phone instead of just email, please provide it below.
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-6xl">
          <Card title="Personal Info">
            <div className='flex flex-col border rounded p-4 mb-4'>
              <div className="flex flex-wrap">
                <InputField className="mb-4 mx-6" type="text" name="firstName" id="firstName" autoComplete="given-name" validation={validateFirstName} label="First Name"/>
                <InputField className="mb-4 mx-6" type="text" name="lastName" id="lastName" autoComplete="family-name" validation={validateLastName} label="Last Name"/>
              </div>
              <InputField className="mb-4 mx-6" label="Phone Number" type="tel" name="phone" id="phone" autoComplete="tel" validation={validatePhoneNumber} onChange={(e) => setHasPhoneNumber (e.target.value.trim () !== '')}/>
              <Checkbox name="agree-to-calls" label="I agree to let Vulpine AI call my phone number. I understand that I can revoke this right at any time in the account settings."/>
              <Checkbox name="agree-to-text" label="I agree to let Vulpine AI text my phone number. I understand that I can revoke this right at any time in the account settings."/>
              <Checkbox name="agree-to-text-conditions" label="I agree to the " url="/legal/sms-terms-and-conditions" urlTitle="SMS Terms and Conditions"/>
            </div>
          </Card>
          <Card title="Addresses">
            {addresses.map ((_, index) => (
              <AddressField key={index} onDelete={() => handleDeleteAddress (index)} />
            ))}
            <button onClick={handleAddAddress} className="self-end mt-2 text-blue-500">Add Address</button>
          </Card>

          <Checkbox label="I agree to the " url="/legal/privacy-policy" urlTitle="Privacy Policy" required />
          <Checkbox label="I agree to the " url="/legal/terms-and-conditions" urlTitle="Terms and Conditions" required />

          {error && error.map ((errorMsg, index) => (
            <p key={index} className="error-message mb-2 mx-6">{errorMsg}</p>
          ))}
          <button type="submit" className="my-4 px-4 py-2 p-6 m-4 bg-blue-500 text-white rounded">Submit</button>
        </form>
      </div>
    </FormLayout>
  );
};

export default AccountSetup;
