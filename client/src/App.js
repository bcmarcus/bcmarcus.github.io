// App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { app } from './firebaseConfig';
import { ThemeProvider } from './Providers/Theme';
import { FirestoreProvider, StorageProvider, DatabaseProvider, FunctionsProvider, AuthProvider } from './Providers/Firebase';

import Login from './Components/Security/Auth/Login';
import Logout from './Components/Security/Auth/Logout';
import Register from './Components/Security/Auth/Register';
import Home from './Components/Public/Home/Home';
import PasswordReset from './Components/Security/Auth/PasswordReset';
import ProtectedRoute from './Components/Security/Routing/ProtectedRoute';

import Disclaimer from './Components/Public/Legal/Disclaimer';
import SMSTermsAndConditions from './Components/Public/Legal/SMSTermsAndConditions';
import DataProcessingAgreement from './Components/Public/Legal/DataProcessingAgreement';
import TermsAndConditions from './Components/Public/Legal/TermsAndConditions';
import PrivacyPolicy from './Components/Public/Legal/PrivacyPolicy';

const Dashboard = lazy (() => import ('./Components/Private/Dashboard/Dashboard').then ((module) => ({ default: module.default })));
const AccountSetup = lazy (() => import ('./Components/Private/AccountInfo/AccountSetup').then ((module) => ({ default: module.default })));

const FirebaseApp = ({ children }) => {
  return (
    <React.StrictMode>
      <AuthProvider app={app}>
        <FunctionsProvider app={app}>
          <DatabaseProvider app={app}>
            <StorageProvider app={app}>
              <FirestoreProvider app={app}>
                {children}
              </FirestoreProvider>
            </StorageProvider>
          </DatabaseProvider>
        </FunctionsProvider>
      </AuthProvider>
    </React.StrictMode>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/legal/sms-terms-and-conditions" element={<SMSTermsAndConditions />} />
            <Route path="/legal/dpa" element={<DataProcessingAgreement />} />
            <Route path="/legal/disclaimer" element={<Disclaimer />} />
            <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal/terms-and-conditions" element={<TermsAndConditions />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/accountSetup" element={<AccountSetup />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </Router>
      </Suspense>
    </ThemeProvider>
  );
};

export {
  App,
  FirebaseApp,
};
