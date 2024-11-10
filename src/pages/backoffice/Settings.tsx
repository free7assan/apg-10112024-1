import React from 'react';
import { Settings as SettingsComponent } from '../../components/backoffice/Settings';

export function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
      <SettingsComponent />
    </div>
  );
}