import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../API/axiosInstance';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // This hits your /api/auth/me route which uses the cookie
        await axiosInstance.get('/auth/me');
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Show nothing or a spinner while checking session
  if (isAuthenticated === null) return null; 

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;