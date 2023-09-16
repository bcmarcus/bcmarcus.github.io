// ProtectedRoute.js
import React, { Suspense, useState, useEffect } from 'react';
import { useNavigate, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '/src/Providers/Firebase';
import Loading from './Loading';

const ProtectedRoute = () => {
  const { token, loading } = useAuth ();

  if (loading) {
    return null;
  }

  return token ? <Suspense fallback={<div>Loading...</div>}><Outlet /></Suspense> : <Navigate to="/login" />;
};

export default ProtectedRoute;
