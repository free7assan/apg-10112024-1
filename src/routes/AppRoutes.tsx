import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { Dashboard } from '../pages/Dashboard';
import { Backoffice } from '../pages/Backoffice';
import { Users } from '../pages/backoffice/Users';
import { Admins } from '../pages/backoffice/Admins';
import { Subscriptions } from '../pages/backoffice/Subscriptions';
import { Analytics } from '../pages/backoffice/Analytics';
import { Database } from '../pages/backoffice/Database';
import { Settings } from '../pages/backoffice/Settings';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard/*" element={<Dashboard />} />

      {/* Admin Routes */}
      <Route path="/backoffice/*" element={<Backoffice />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Analytics />} />
        <Route path="users" element={<Users />} />
        <Route path="admins" element={<Admins />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="database" element={<Database />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}