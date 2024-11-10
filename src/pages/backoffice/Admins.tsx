import React from 'react';
import { Tabs } from '../../components/common/Tabs';
import { AdminsList } from '../../components/backoffice/admins/AdminsList';
import { AdminRoles } from '../../components/backoffice/admins/AdminRoles';
import { AdminPermissions } from '../../components/backoffice/admins/AdminPermissions';
import { AdminLogs } from '../../components/backoffice/admins/AdminLogs';

export function Admins() {
  const tabs = [
    { id: 'list', label: 'Administrators', component: AdminsList },
    { id: 'roles', label: 'Roles', component: AdminRoles },
    { id: 'permissions', label: 'Permissions', component: AdminPermissions },
    { id: 'logs', label: 'Activity Logs', component: AdminLogs }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Management</h1>
      <Tabs tabs={tabs} />
    </div>
  );
}