import React, { useRef, useState, useEffect } from 'react';
import HomeLayout from '/src/Components/Layouts/HomeLayout';
import RecaptchaV3 from '/src/Components/Security/RecaptchaV3';
import '/src/Assets/Home/home.css';

import { httpsCallable } from 'firebase/functions';

// Import the useFunctions hook instead of useFirebaseApp
import { useFunctions } from '/src/FirebaseContexts';

const useCurrentDate = () => {
  const [currentDate, setCurrentDate] = useState('');
  
  // Use useFunctions instead of useFirebaseApp
  const functions = useFunctions();

  useEffect(() => {
    const fetchCurrentDate = async () => {
      const getCurrentTimestamp = httpsCallable(functions, 'getCurrentTimestamp');
      try {
        const result = await getCurrentTimestamp();
        const timestamp = new Date(result.data?.timestamp);
        setCurrentDate(timestamp.toLocaleString());
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentDate();
  }, [functions]);

  return currentDate;
};

const Home = () => {
  const companyDetailsRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const currentDate = useCurrentDate();

  // Use useFunctions instead of useFirebaseApp
  const functions = useFunctions();
  
  const scrollToCompanyDetails = () => {
    companyDetailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleButtonClick = async () => {
    setResponseMessage('Generating response...'); // Add this line
    const result = await AskGPT(inputValue);
    setResponseMessage(result); // Add this line
  };

  const AskGPT = async (prompt) => {
    const AskGPTFunction = httpsCallable(functions, 'AskGPT');
    try {
      const result = await AskGPTFunction({ prompt });
      return result.data;
    } catch (error) {
      console.error(error);
      return "Error, function is currently unavailable.";
    }
  };

  const products = [
    {
      id: 1,
      name: 'Product 1',
      price: '\\$100',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 2,
      name: 'Product 2',
      price: '\\$200',
      description:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      image: 'https://via.placeholder.com/200',
    },
    {
      id: 3,
      name: 'Product 3',
      price: '\\$300',
      description:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      image: 'https://via.placeholder.com/200',
    },
  ];

  return (
    <HomeLayout>
      <div>
        <section className="search-container">
          <h1 className="home-title">Website Name</h1>
          <h1 className="date">{currentDate}</h1>
          <input
            type="text"
            className="search-bar"
            placeholder="Search for products..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <RecaptchaV3 />
          <button className="search-button" onClick={handleButtonClick}>
            Search
          </button>
          <p className="search-response">{responseMessage}</p>
        </section>
      </div>
    </HomeLayout>
  );
};

export default Home;
