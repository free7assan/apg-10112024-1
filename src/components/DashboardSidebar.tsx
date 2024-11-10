import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, History, Settings } from 'lucide-react';

export function DashboardSidebar() {
  return (
    <div className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)]">
      <nav className="mt-5 px-2">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <FileText className="mr-3 h-5 w-5" />
          New Playbook
        </NavLink>

        <NavLink
          to="/dashboard/history"
          className={({ isActive }) =>
            `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <History className="mr-3 h-5 w-5" />
          History
        </NavLink>

        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </NavLink>
      </nav>
    </div>
  );
}