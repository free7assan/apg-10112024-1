import React, { useState } from 'react';
import { Shield, Plus } from 'lucide-react';

const defaultRoles = [
  {
    id: 1,
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: ['all']
  },
  {
    id: 2,
    name: 'System Admin',
    description: 'System configuration and user management',
    permissions: ['manage_users', 'manage_settings', 'view_analytics']
  },
  {
    id: 3,
    name: 'Content Admin',
    description: 'Manage playbooks and templates',
    permissions: ['manage_playbooks', 'manage_templates', 'view_analytics']
  }
];

export function AdminRoles() {
  const [roles, setRoles] = useState(defaultRoles);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Admin Roles</h2>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {roles.map((role) => (
          <div key={role.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-indigo-500 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{role.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-sm text-indigo-600 hover:text-indigo-900">Edit</button>
                {role.name !== 'Super Admin' && (
                  <button className="text-sm text-red-600 hover:text-red-900">Delete</button>
                )}
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Permissions</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {permission.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}