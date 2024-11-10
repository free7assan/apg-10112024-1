import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BackofficeLayout } from '../components/backoffice/BackofficeLayout';
import { BackofficeDashboard } from './backoffice/Dashboard';
import { Users } from './backoffice/Users';
import { Subscriptions } from './backoffice/Subscriptions';
import { Analytics } from './backoffice/Analytics';
import { Settings } from './backoffice/Settings';
import { Database } from './backoffice/Database';

export function Backoffice() {
  return (
    <BackofficeLayout>
      <Routes>
        <Route path="/" element={<BackofficeDashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/database" element={<Database />} />
      </Routes>
    </BackofficeLayout>
  );
}