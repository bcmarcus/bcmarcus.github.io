import React, { useEffect, useState } from 'react';
import { getIdToken, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '/src/FirebaseContexts';
import { useNavigate, Link } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import Ingredients from './Ingredients/IngredientsTab';
import Instructions from './Instructions/InstructionsTab';
import Account from './AccountSettingsTab';
import logo from '/src/Assets/Logo/logo-placeholder-image.png';
import '/src/Assets/Dashboard/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { signout, auth } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signout(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user);
        setAccessToken(token);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div id="navigationDiv">
        <nav id="navigation">
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div>
              <Link to="/">
                <button className="dashboard-logo" style={{ marginBottom: '1rem' }}>
                  <img src={logo} alt="Logo" style={{ width: '100px', cursor: 'pointer' }} />
                </button>
              </Link>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li>
                  <button className="tab" onClick={() => setActiveTab('dashboard')}>
                    Dashboard
                    <span className="material-icons" style={{ marginLeft: '10px' }}>dashboard</span>
                  </button>
                </li>
                <li>
                  <button className="tab" onClick={() => setActiveTab('ingredients')}>
                    Ingredients
                    <span className="material-icons" style={{ marginLeft: '10px' }}>restaurant</span>
                  </button>
                </li>
                <li>
                  <button className="tab" onClick={() => setActiveTab('instructions')}>
                    Instructions
                    <span className="material-icons" style={{ marginLeft: '10px' }}>article</span>
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <ul style={{ listStyleType: 'none', padding: 0, marginBottom: 0}}>
                <li>
                  <button className="tab" onClick={() => setActiveTab('account')}>
                    Settings
                    <span className="material-icons" style={{ marginLeft: '10px' }}>settings</span>
                  </button>
                </li>
              </ul>
              <button className="tab" onClick={handleLogout}>
                Logout
                <span className="material-icons" style={{ marginLeft: '10px' }}>logout</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
      <main style={{ flex: 1, padding: '1rem' }}>
        {activeTab === 'dashboard' && <DashboardHome />}
        {activeTab === 'ingredients' && <Ingredients />}
        {activeTab === 'instructions' && <Instructions />}
        {activeTab === 'account' && <Account />}
      </main>
    </div>
  );
}

export default Dashboard;