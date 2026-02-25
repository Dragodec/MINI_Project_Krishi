import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage from './Pages/LandingPage';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import ForgotPassword from './Pages/ForgotPassword';
import Dashboard from './Pages/Dashboard';
import Weather from './Pages/Weather';
import Profile from './Pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/weather" 
        element={
          <ProtectedRoute>
            <Weather />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;