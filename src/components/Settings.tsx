import React, { useState } from 'react';
import { Save, AlertCircle, Terminal, FileText, Bell, Shield, Database } from 'lucide-react';

interface SettingsState {
  playbook: {
    defaultComplexity: 'basic' | 'intermediate' | 'advanced';
    defaultStructure: 'single' | 'multi';
    inventoryPath: string;
    sshKeyPath: string;
    validateBeforeGeneration: boolean;
  };
  export: {
    yaml: boolean;
    json: boolean;
    includeComments: boolean;
    includeDocumentation: boolean;
  };
  notifications: {
    onSuccess: boolean;
    onError: boolean;
    desktop: boolean;
    sound: boolean;
  };
  security: {
    encryptSensitiveData: boolean;
    useVault: boolean;
    vaultPath: string;
  };
  backup: {
    enabled: boolean;
    location: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    keepVersions: number;
  };
}

export function Settings() {
  const [settings, setSettings] = useState<SettingsState>({
    playbook: {
      defaultComplexity: 'basic',
      defaultStructure: 'single',
      inventoryPath: '/etc/ansible/hosts',
      sshKeyPath: '~/.ssh/id_rsa',
      validateBeforeGeneration: true,
    },
    export: {
      yaml: true,
      json: false,
      includeComments: true,
      includeDocumentation: true,
    },
    notifications: {
      onSuccess: true,
      onError: true,
      desktop: false,
      sound: false,
    },
    security: {
      encryptSensitiveData: true,
      useVault: false,
      vaultPath: '~/.ansible-vault',
    },
    backup: {
      enabled: true,
      location: '~/ansible-backups',
      frequency: 'daily',
      keepVersions: 5,
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

  const updateSettings = <K extends keyof SettingsState>(
    section: K,
    updates: Partial<SettingsState[K]>
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      </div>

      <div className="p-6 space-y-8">
        {/* Playbook Settings */}
        <section>
          <div className="flex items-center mb-4">
            <Terminal className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Playbook Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Complexity
              </label>
              <select
                value={settings.playbook.defaultComplexity}
                onChange={e => updateSettings('playbook', { defaultComplexity: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Structure
              </label>
              <select
                value={settings.playbook.defaultStructure}
                onChange={e => updateSettings('playbook', { defaultStructure: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="single">Single File</option>
                <option value="multi">Multiple Files</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Inventory File Path
              </label>
              <input
                type="text"
                value={settings.playbook.inventoryPath}
                onChange={e => updateSettings('playbook', { inventoryPath: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SSH Key Path
              </label>
              <input
                type="text"
                value={settings.playbook.sshKeyPath}
                onChange={e => updateSettings('playbook', { sshKeyPath: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.playbook.validateBeforeGeneration}
                  onChange={e => updateSettings('playbook', { validateBeforeGeneration: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Validate playbooks before generation
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* Export Settings */}
        <section>
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Export Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.export.yaml}
                  onChange={e => updateSettings('export', { yaml: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">YAML</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.export.json}
                  onChange={e => updateSettings('export', { json: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">JSON</span>
              </label>
            </div>
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.export.includeComments}
                  onChange={e => updateSettings('export', { includeComments: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include Comments</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.export.includeDocumentation}
                  onChange={e => updateSettings('export', { includeDocumentation: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include Documentation</span>
              </label>
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section>
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.onSuccess}
                onChange={e => updateSettings('notifications', { onSuccess: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">On Success</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.onError}
                onChange={e => updateSettings('notifications', { onError: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">On Error</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.desktop}
                onChange={e => updateSettings('notifications', { desktop: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Desktop Notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.sound}
                onChange={e => updateSettings('notifications', { sound: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Sound Notifications</span>
            </label>
          </div>
        </section>

        {/* Security Settings */}
        <section>
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Security</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.encryptSensitiveData}
                onChange={e => updateSettings('security', { encryptSensitiveData: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Encrypt Sensitive Data</span>
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.useVault}
                onChange={e => updateSettings('security', { useVault: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Use Ansible Vault</span>
            </div>
            {settings.security.useVault && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vault Path
                </label>
                <input
                  type="text"
                  value={settings.security.vaultPath}
                  onChange={e => updateSettings('security', { vaultPath: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        </section>

        {/* Backup Settings */}
        <section>
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Backup</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.backup.enabled}
                onChange={e => updateSettings('backup', { enabled: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Automatic Backups</span>
            </label>
            {settings.backup.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Backup Location
                  </label>
                  <input
                    type="text"
                    value={settings.backup.location}
                    onChange={e => updateSettings('backup', { location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.backup.frequency}
                    onChange={e => updateSettings('backup', { frequency: e.target.value as any })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Keep Versions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.backup.keepVersions}
                    onChange={e => updateSettings('backup', { keepVersions: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

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

        <div className="pt-4">
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