import React, { useEffect, useState } from 'react';
import { getIdToken, onAuthStateChanged } from 'firebase/auth';
import { useAuth, useFirestore } from '/src/Providers/Firebase';
import { useNavigate, Link } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import AccountSettingsTab from './AccountSettingsTab';
import logo from '/src/Assets/Public/Logo/logo-placeholder-image.png';
import '/src/Assets/Private/Dashboard/Dashboard.css';

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
      <div id="navigationDiv">
        <nav id="navigation">
          <div className="flex flex-col h-full justify-between">
            <div>
              <Link to="/">
                <button className="dashboard-logo mb-4">
                  <img src={logo} alt="Logo" className="w-24 cursor-pointer" />
                </button>
              </Link>
              <ul className="list-none p-0">
                <li>
                  <button className="tab" onClick={() => setActiveTab ('dashboard')}>
                Dashboard
                    <span className="material-icons ml-2">dashboard</span>
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <ul className="list-none p-0 mb-0">
                <li>
                  <button className="tab" onClick={() => setActiveTab ('accountSettingsTab')}>
                Settings
                    <span className="material-icons ml-2">settings</span>
                  </button>
                </li>
              </ul>
              <button className="tab" onClick={handleLogout}>
            Logout
                <span className="material-icons ml-2">logout</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
      <main className="flex-grow p-4">
        {activeTab === 'dashboard' && <DashboardHome />}
        {activeTab === 'accountSettingsTab' && <AccountSettingsTab />}
      </main>
    </div>

  );
};

export default Dashboard;
