// ProtectedRoute.js
import React, { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '/src/Providers/Firebase';

const ProtectedRoute = () => {
  const { token, loading } = useAuth ();

  if (loading) {
    return null;
  }

  return token ? <Suspense fallback={<div>Loading...</div>}><Outlet /></Suspense> : <Navigate to="/login" />;
};

export default ProtectedRoute;
