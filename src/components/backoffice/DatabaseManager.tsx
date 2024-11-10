import React, { useState } from 'react';
import { Download, Upload, RefreshCw, AlertCircle } from 'lucide-react';
import { getDB, updateStats } from '../../database/db';

export function DatabaseManager() {
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

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset the database? This will delete all data except the default admin user.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const db = await getDB();
      const tx = db.transaction(['users', 'playbooks', 'stats'], 'readwrite');

      // Clear all stores
      await Promise.all([
        tx.objectStore('playbooks').clear(),
        tx.objectStore('users').clear()
      ]);

      // Re-add default admin user
      await tx.objectStore('users').add({
        email: 'free7assan@gmail.com',
        password_hash: await hashPassword('admin123'),
        role: 'admin',
        created_at: new Date().toISOString()
      });

      await updateStats();
      await tx.done;

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
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Database Management
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

        <div className="mt-5 space-y-3 sm:space-y-0 sm:space-x-3 sm:flex">
          <button
            type="button"
            onClick={handleBackup}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Backup Database
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Database
          </button>
        </div>
      </div>
    </div>
  );
}