import React, { useState } from 'react';
import { Download, Upload, RefreshCw, AlertCircle } from 'lucide-react';
import { getDB } from '../../../database/db';

export function DatabaseBackup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleBackup = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const db = await getDB();
      
      // Get all data
      const [users, playbooks] = await Promise.all([
        db.getAll('users'),
        db.getAll('playbooks')
      ]);
      
      const backup = {
        users,
        playbooks,
        timestamp: new Date().toISOString()
      };

      // Create and download backup file
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ansible-generator-backup-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess('Backup created successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to create backup');
      console.error('Backup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Backup & Restore
        </h3>
        
        {error && (
          <div className="mt-4 bg-red-50 p-4 rounded-md">
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
          <div className="mt-4 bg-green-50 p-4 rounded-md">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={handleBackup}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Create Backup
          </button>

          <button
            type="button"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Restore from Backup
          </button>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Backup History</h4>
          <div className="mt-2 bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">No backup history available</p>
          </div>
        </div>
      </div>
    </div>
  );
}