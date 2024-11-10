import React, { useState } from 'react';
import { RefreshCw, AlertCircle, Database, Trash2 } from 'lucide-react';
import { resetDB } from '../../../database/db';

export function DatabaseMaintenance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset the database? This will delete all data except the default admin user.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await resetDB();
      setSuccess('Database reset successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to reset database');
      console.error('Reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Database Maintenance */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance Tasks</h3>
          
          {error && (
            <div className="mb-4 bg-red-50 p-4 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 p-4 rounded-md">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => {}}
              disabled={loading}
              className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                <Database className="h-5 w-5 text-gray-400 mr-3" />
                <div className="text-left">
                  <h4 className="text-sm font-medium text-gray-900">Optimize Database</h4>
                  <p className="text-sm text-gray-500">Clean up unused space and optimize indexes</p>
                </div>
              </div>
              <RefreshCw className="h-5 w-5 text-gray-400" />
            </button>

            <button
              onClick={() => {}}
              disabled={loading}
              className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                <Database className="h-5 w-5 text-gray-400 mr-3" />
                <div className="text-left">
                  <h4 className="text-sm font-medium text-gray-900">Clear Cache</h4>
                  <p className="text-sm text-gray-500">Remove temporary data and cached items</p>
                </div>
              </div>
              <RefreshCw className="h-5 w-5 text-gray-400" />
            </button>

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full flex justify-between items-center px-4 py-3 border border-red-300 rounded-lg hover:bg-red-50"
            >
              <div className="flex items-center">
                <Trash2 className="h-5 w-5 text-red-400 mr-3" />
                <div className="text-left">
                  <h4 className="text-sm font-medium text-red-600">Reset Database</h4>
                  <p className="text-sm text-red-500">Delete all data and restore defaults</p>
                </div>
              </div>
              <RefreshCw className="h-5 w-5 text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance Schedule</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Automatic Optimization</h4>
                <p className="text-sm text-gray-500">Run optimization tasks weekly</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Automatic Backup</h4>
                <p className="text-sm text-gray-500">Create backups daily</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}