import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BackofficeNavigation } from '../../components/backoffice/BackofficeNavigation';
import { BackofficeDashboard } from './Dashboard';
import { Users } from './Users';
import { Subscriptions } from './Subscriptions';
import { Analytics } from './Analytics';
import { Settings } from './Settings';
import { Database } from './Database';
import { useAuth } from '../../context/AuthContext';

export function BackofficeLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">Admin Portal</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-full"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || '')}`}
                  alt=""
                />
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {/* Sidebar Navigation */}
            <BackofficeNavigation />

            {/* Main Content */}
            <div className="flex-1 ml-8">
              <Routes>
                <Route path="/dashboard" element={<BackofficeDashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/database" element={<Database />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}