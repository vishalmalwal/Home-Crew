import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';

const Router: React.FC = () => {
  const { currentUser, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* Public routes - only show if not logged in */}
      {!currentUser && (
        <>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </>
      )}
      
      {/* Customer routes */}
      {currentUser && currentUser.role === 'customer' && (
        <>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
        </>
      )}
      
      {/* Company routes */}
      {currentUser && currentUser.role === 'company' && (
        <Route path="/admin" element={<CompanyDashboard />} />
      )}

      {/* Redirect based on user role */}
      {currentUser && currentUser.role === 'customer' && (
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      )}
      
      {currentUser && currentUser.role === 'company' && (
        <Route path="*" element={<Navigate to="/admin" replace />} />
      )}

      {/* Fallback for non-logged in users */}
      {!currentUser && (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
};

export default Router;