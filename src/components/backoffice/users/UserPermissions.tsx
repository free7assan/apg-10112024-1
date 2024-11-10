import React, { useState } from 'react';
import { Lock, Plus, AlertCircle } from 'lucide-react';

const defaultPermissions = [
  {
    id: 1,
    name: 'create_playbook',
    description: 'Create new Ansible playbooks',
    category: 'Playbooks'
  },
  {
    id: 2,
    name: 'read_playbook',
    description: 'View existing playbooks',
    category: 'Playbooks'
  },
  {
    id: 3,
    name: 'update_playbook',
    description: 'Modify existing playbooks',
    category: 'Playbooks'
  },
  {
    id: 4,
    name: 'delete_playbook',
    description: 'Delete playbooks',
    category: 'Playbooks'
  },
  {
    id: 5,
    name: 'manage_users',
    description: 'Manage user accounts',
    category: 'Administration'
  },
  {
    id: 6,
    name: 'view_analytics',
    description: 'Access analytics dashboard',
    category: 'Administration'
  }
];

export function UserPermissions() {
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(permissions.map(p => p.category))];
  
  const filteredPermissions = selectedCategory === 'all'
    ? permissions
    : permissions.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-medium text-gray-900">Permissions</h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Permission
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredPermissions.map((permission) => (
          <div key={permission.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-indigo-500 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {permission.name.replace(/_/g, ' ')}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{permission.description}</p>
                  <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {permission.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-sm text-indigo-600 hover:text-indigo-900">Edit</button>
                <button className="text-sm text-red-600 hover:text-red-900">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}