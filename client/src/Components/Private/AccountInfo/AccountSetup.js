import React, { useEffect, useState } from 'react';
import { useAuth, useFirestore } from '/src/Providers/Firebase';
import { useNavigate } from 'react-router-dom';
import '/src/Assets/Private/Dashboard/Dashboard.css';

import AddressField from '../../Basic/Forms/AddressField';
import Card from '../../Basic/Card';
import Checkbox from '../../Basic/Forms/Checkbox';
import InputField from '../../Basic/Forms/InputField';
import FormLayout from '../../Basic/Layouts/FormLayout';

import { validateFirstName, validateLastName, validatePhoneNumber } from '../../Security/FirestoreValidation';

const AccountSetup = () => {
  const { user } = useAuth ();
  const { getData } = useFirestore ();

  const [hasPhoneNumber, setHasPhoneNumber] = useState (false);

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
    console.log ('You did it!', event);
    navigate ('/dashboard');
  };

  return (
    <FormLayout>
      {/* <div className="">
        None of this information is required, however it will provide a better experience.
        If you want to access your personal assistant through phone instead of just email, please provide it below.
      </div> */}
      <div className="theme-secondary flex flex-col items-center justify-center smooth-transition">
        <form onSubmit={handleSubmit} className="w-full max-w-6xl">
          <Card title="Personal Info">
            <div className='flex flex-col border rounded p-4 mb-4'>
              <div className="flex">
                <InputField type="text" name="firstName" id="firstName" autoComplete="given-name" label="First Name"/>
                <InputField type="text" name="lastName" id="lastName" autoComplete="family-name" label="Last Name"/>
              </div>
              <InputField label="Phone Number" type="tel" name="phone" id="phone" autoComplete="tel" onChange={(e) => setHasPhoneNumber (e.target.value.trim () !== '')}/>
              <Checkbox label="I agree to let Vulpine AI call my phone number. I understand that I can revoke this right at any time in the account settings."/>
              <Checkbox label="I agree to let Vulpine AI text my phone number. I understand that I can revoke this right at any time in the account settings."/>
              <Checkbox label="I agree to the " url="/legal/sms-terms-and-conditions" urlTitle="SMS Terms and Conditions"/>
            </div>
          </Card>
          {/* maybe for mobile
           <Card title="Personal Info">
            <div className="flex space-x-4">
              <InputField label="First Name" />
              <InputField label="Last Name" />
            </div>
            <InputField label="Phone Number" onChange={(e) => setHasPhoneNumber (e.target.value.trim () !== '')}/>
            <Checkbox label="I agree to the use of my phone number to recieve calls and texts. I understand that I can revoke this right by removing my phone number, or cancelling my account." />
          </Card> */}

          <Card title="Addresses">
            {addresses.map ((_, index) => (
              <AddressField key={index} onDelete={() => handleDeleteAddress (index)} />
            ))}
            <button onClick={handleAddAddress} className="self-end mt-2 text-blue-500">Add Address</button>
          </Card>

          <Checkbox label="I agree to the " url="/legal/privacy-policy" urlTitle="Privacy Policy" required />
          <Checkbox label="I agree to the " url="/legal/terms-and-conditions" urlTitle="Terms and Conditions" required />

          <button type="submit" className="my-4 px-4 py-2 p-6 m-4 bg-blue-500 text-white rounded">Submit</button>
        </form>
      </div>
    </FormLayout>
  );
};

export default AccountSetup;
