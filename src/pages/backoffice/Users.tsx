import React, { useState } from 'react';
import { Tabs } from '../../components/common/Tabs';
import { UsersList } from '../../components/backoffice/users/UsersList';
import { AdminsList } from '../../components/backoffice/users/AdminsList';
import { UserRoles } from '../../components/backoffice/users/UserRoles';
import { UserPermissions } from '../../components/backoffice/users/UserPermissions';

export function Users() {
  const tabs = [
    { id: 'users', label: 'Users', component: UsersList },
    { id: 'admins', label: 'Administrators', component: AdminsList },
    { id: 'roles', label: 'Roles', component: UserRoles },
    { id: 'permissions', label: 'Permissions', component: UserPermissions }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
      <Tabs tabs={tabs} />
    </div>
  );
}