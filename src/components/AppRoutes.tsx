import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { Dashboard } from '../pages/Dashboard';
import { Backoffice } from '../pages/Backoffice';
import { BackofficeLogin } from '../pages/BackofficeLogin';
import { AuthModal } from './AuthModal';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { useAuth } from '../hooks/useAuth';

export function AppRoutes() {
  const { 
    showAuthModal, 
    setShowAuthModal,
    user,
    error,
    handleAuth,
    logout
  } = useAuth();

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={<LandingPage onSignIn={() => setShowAuthModal(true)} />} 
        />
        
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <Dashboard user={user} onLogout={logout} />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={<BackofficeLogin />} />
        
        <Route path="/backoffice/*" element={
          <AdminRoute>
            <Backoffice />
          </AdminRoute>
        } />
      </Routes>

      <AuthModal 
        show={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onAuth={(email, password) => handleAuth(email, password, false)}
        error={error}
        isWebapp={true}
      />
    </>
  );
}