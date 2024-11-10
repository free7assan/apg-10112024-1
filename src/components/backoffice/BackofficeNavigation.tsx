import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart2, 
  Settings,
  Database,
  Shield
} from 'lucide-react';

export function BackofficeNavigation() {
  const navigation = [
    { name: 'Dashboard', href: '/backoffice/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/backoffice/users', icon: Users },
    { name: 'Admins', href: '/backoffice/admins', icon: Shield },
    { name: 'Subscriptions', href: '/backoffice/subscriptions', icon: CreditCard },
    { name: 'Analytics', href: '/backoffice/analytics', icon: BarChart2 },
    { name: 'Database', href: '/backoffice/database', icon: Database },
    { name: 'Settings', href: '/backoffice/settings', icon: Settings },
  ];

  return (
    <div className="w-64">
      <nav className="space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => `
              ${isActive
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-3 py-2 text-sm font-medium border-l-4
            `}
          >
            <item.icon
              className="flex-shrink-0 -ml-1 mr-3 h-6 w-6"
              aria-hidden="true"
            />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}