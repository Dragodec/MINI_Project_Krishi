import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import ForgotPassword from './Pages/ForgotPassword';
import Dashboard from './Pages/Dashboard';
import Weather from './Pages/Weather';
import Profile from './Pages/Profile';
import AIQueries from './Pages/AIQueries';
import ProtectedRoute from './Components/ProtectedRoute';
import Layout from './Components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route 
        path="*" 
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/queries" element={<AIQueries />} />
                <Route path="/queries/:chatId" element={<AIQueries />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;