// App.js
import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { app } from './firebaseConfig';
import { FirestoreProvider, StorageProvider, DatabaseProvider, FunctionsProvider, AuthProvider } from './FirebaseContexts';

import Login from './Components/Auth/Login';
import Logout from './Components/Auth/Logout';
import Register from './Components/Auth/Register';
import Home from './Components/Home/Home';
import PasswordReset from './Components/Security/PasswordReset';
import ProtectedRoute from './Components/Security/ProtectedRoute';
import Loading from './Components/Security/Loading';

const Dashboard = lazy(() => import('./Components/Dashboard/Dashboard').then((module) => ({ default: module.default })));

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
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/loading" element={<Loading />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </Suspense>
  );
}

export {
  App,
  FirebaseApp
};