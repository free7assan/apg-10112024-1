import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Users, Database, Settings } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      name: 'Manage Users',
      description: 'Add, edit, or remove user accounts',
      icon: Users,
      to: '/backoffice/users',
      color: 'bg-blue-500'
    },
    {
      name: 'Manage Admins',
      description: 'Control administrator access',
      icon: UserPlus,
      to: '/backoffice/admins',
      color: 'bg-purple-500'
    },
    {
      name: 'Database',
      description: 'Backup and manage database',
      icon: Database,
      to: '/backoffice/database',
      color: 'bg-green-500'
    },
    {
      name: 'Settings',
      description: 'Configure system settings',
      icon: Settings,
      to: '/backoffice/settings',
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="mt-6 grid grid-cols-1 gap-4">
          {actions.map((action) => (
            <Link
              key={action.name}
              to={action.to}
              className="group relative rounded-lg p-6 bg-white ring-1 ring-gray-200 hover:ring-2 hover:ring-indigo-500 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`${action.color} p-3 rounded-lg`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{action.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}