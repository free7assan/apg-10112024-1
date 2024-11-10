import React, { useState } from 'react';
import { Save, AlertCircle, Mail, Bell, Lock, Database, Globe } from 'lucide-react';

interface BackofficeSettings {
  email: {
    notifications: boolean;
    weeklyReport: boolean;
    userSignups: boolean;
    smtp: {
      host: string;
      port: number;
      username: string;
      encryption: 'none' | 'tls' | 'ssl';
    };
  };
  security: {
    twoFactorAuth: boolean;
    passwordExpiration: number;
    sessionTimeout: number;
    ipWhitelist: string[];
  };
  system: {
    maintenance: boolean;
    maintenanceMessage: string;
    debugMode: boolean;
    logRetention: number;
  };
  localization: {
    defaultLanguage: string;
    timezone: string;
    dateFormat: string;
  };
}

export function Settings() {
  const [settings, setSettings] = useState<BackofficeSettings>({
    email: {
      notifications: true,
      weeklyReport: true,
      userSignups: true,
      smtp: {
        host: 'smtp.example.com',
        port: 587,
        username: 'notifications@example.com',
        encryption: 'tls',
      },
    },
    security: {
      twoFactorAuth: true,
      passwordExpiration: 90,
      sessionTimeout: 30,
      ipWhitelist: ['127.0.0.1'],
    },
    system: {
      maintenance: false,
      maintenanceMessage: 'System is under maintenance. Please try again later.',
      debugMode: false,
      logRetention: 30,
    },
    localization: {
      defaultLanguage: 'en',
      timezone: 'UTC',
      dateFormat: 'YYYY-MM-DD',
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = <K extends keyof BackofficeSettings>(
    section: K,
    updates: Partial<BackofficeSettings[K]>
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">System Settings</h1>

      <div className="space-y-6">
        {/* Email Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Email Settings</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">SMTP Host</label>
                <input
                  type="text"
                  value={settings.email.smtp.host}
                  onChange={e => updateSettings('email', { 
                    smtp: { ...settings.email.smtp, host: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SMTP Port</label>
                <input
                  type="number"
                  value={settings.email.smtp.port}
                  onChange={e => updateSettings('email', {
                    smtp: { ...settings.email.smtp, port: parseInt(e.target.value) }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.email.notifications}
                  onChange={e => updateSettings('email', { notifications: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable email notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.email.weeklyReport}
                  onChange={e => updateSettings('email', { weeklyReport: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Send weekly reports</span>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password Expiration (days)</label>
                <input
                  type="number"
                  value={settings.security.passwordExpiration}
                  onChange={e => updateSettings('security', { passwordExpiration: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={e => updateSettings('security', { sessionTimeout: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={e => updateSettings('security', { twoFactorAuth: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Require two-factor authentication</span>
              </label>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Database className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">System Settings</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.system.maintenance}
                  onChange={e => updateSettings('system', { maintenance: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Maintenance Mode</span>
              </label>
            </div>
            {settings.system.maintenance && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Maintenance Message</label>
                <textarea
                  value={settings.system.maintenanceMessage}
                  onChange={e => updateSettings('system', { maintenanceMessage: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Log Retention (days)</label>
              <input
                type="number"
                value={settings.system.logRetention}
                onChange={e => updateSettings('system', { logRetention: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Localization Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Localization</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Default Language</label>
                <select
                  value={settings.localization.defaultLanguage}
                  onChange={e => updateSettings('localization', { defaultLanguage: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <select
                  value={settings.localization.timezone}
                  onChange={e => updateSettings('localization', { timezone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {saveError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{saveError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}