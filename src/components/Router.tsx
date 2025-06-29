import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import CustomerDashboard from './pages/CustomerDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';

const Router: React.FC = () => {
  const { currentUser } = useApp();

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
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </>
      )}
      
      {/* Customer routes */}
      {currentUser?.role === 'customer' && (
        <>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
        </>
      )}
      
      {/* Company routes */}
      {currentUser?.role === 'company' && (
        <Route path="/admin" element={<CompanyDashboard />} />
      )}

      {/* Redirect based on user role */}
      {currentUser?.role === 'customer' && (
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      )}
      
      {currentUser?.role === 'company' && (
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