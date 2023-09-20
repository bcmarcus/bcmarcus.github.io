// react
import React, { useEffect, useState } from 'react';
import { getIdToken, onAuthStateChanged } from 'firebase/auth';
import { useAuth, useFirestore } from '/src/Providers/Firebase';
import { useNavigate, Link } from 'react-router-dom';
import DashboardTab from './DashboardTab';
import AccountSettingsTab from './AccountSettingsTab';
import logo from '/src/Assets/Public/Logo/logo-placeholder-image.png';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState ('dashboard');
  const { signout, auth, user } = useAuth ();
  const { getData } = useFirestore ();

  const navigate = useNavigate ();

  const handleLogout = async () => {
    try {
      await signout (auth);
      navigate ('/');
    } catch (error) {
      console.error ('Error signing out:', error);
    }
  };

  const [accessToken, setAccessToken] = useState ('');

  useEffect (() => {
    const fetchData = async () => {
      if (user) {
        console.log (user.uid);
        const data = await getData ('users', user.uid);
        console.log (data);
      }
    };

    fetchData ();
  }, [user]);

  useEffect (() => {
    const unsubscribe = onAuthStateChanged (auth, async (user) => {
      if (user) {
        const token = await getIdToken (user);
        setAccessToken (token);
      }
    });

    return () => {
      unsubscribe ();
    };
  }, []);

  return (
    <div className="theme-primary flex h-screen">
      <div className="w-48">
        <nav className="fixed h-screen overflow-y-auto bg-blue-500 p-0">
          <div className="flex flex-col h-full justify-between">
            <div>
              <Link to="/">
                <button className="flex justify-center w-full p-0 m-0 border-none bg-transparent cursor-pointer h-20 outline-none text-white mb-4">
                  <img src={logo} alt="Logo" className="w-24 cursor-pointer" />
                </button>
              </Link>
              <ul className="list-none p-0">
                <li>
                  <button className="flex items-center justify-between w-full px-5 py-4 m-0 border-none bg-transparent cursor-pointer text-lg text-left h-20 outline-none text-white hover:bg-black hover:bg-opacity-20 transition-colors duration-300" onClick={() => setActiveTab ('dashboard')}>
                    Dashboard
                    <span className="material-icons ml-2">dashboard</span>
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <ul className="list-none p-0 mb-0">
                <li>
                  <button className="flex items-center justify-between w-full px-5 py-4 m-0 border-none bg-transparent cursor-pointer text-lg text-left h-20 outline-none text-white hover:bg-black hover:bg-opacity-20 transition-colors duration-300" onClick={() => setActiveTab ('accountSettingsTab')}>
                    Settings
                    <span className="material-icons ml-2">settings</span>
                  </button>
                </li>
              </ul>
              <button className="flex items-center justify-between w-full px-5 py-4 m-0 border-none bg-transparent cursor-pointer text-lg text-left h-20 outline-none text-white hover:bg-black hover:bg-opacity-20 transition-colors duration-300" onClick={handleLogout}>
                Logout
                <span className="material-icons ml-2">logout</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
      <main className="flex-grow p-4">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'accountSettingsTab' && <AccountSettingsTab />}
      </main>
    </div>

  );
};

export default Dashboard;
