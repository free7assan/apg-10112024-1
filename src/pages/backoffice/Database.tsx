import React from 'react';
import { Tabs } from '../../components/common/Tabs';
import { DatabaseOverview } from '../../components/backoffice/database/DatabaseOverview';
import { DatabaseBackup } from '../../components/backoffice/database/DatabaseBackup';
import { DatabaseMaintenance } from '../../components/backoffice/database/DatabaseMaintenance';
import { DatabaseLogs } from '../../components/backoffice/database/DatabaseLogs';

export function Database() {
  const tabs = [
    { id: 'overview', label: 'Overview', component: DatabaseOverview },
    { id: 'backup', label: 'Backup & Restore', component: DatabaseBackup },
    { id: 'maintenance', label: 'Maintenance', component: DatabaseMaintenance },
    { id: 'logs', label: 'Logs', component: DatabaseLogs }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Database Management</h1>
      <Tabs tabs={tabs} />
    </div>
  );
}