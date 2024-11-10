import React from 'react';
import { Key, AlertCircle } from 'lucide-react';

export function AdminCredentials() {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <Key className="h-5 w-5 mr-2 text-indigo-500" />
          Administrator Credentials
        </h3>
        
        <div className="mt-4">
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Default Admin Access
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Primary Admin: <code className="bg-yellow-100 px-1 py-0.5 rounded">free7assan@gmail.com</code></p>
                  <p className="mt-1">Secondary Admin: <code className="bg-yellow-100 px-1 py-0.5 rounded">admin@gmail.com</code></p>
                  <p className="mt-1">Password: <code className="bg-yellow-100 px-1 py-0.5 rounded">admin123</code></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>These are the default administrator credentials for accessing the backoffice portal. For security reasons, please change the password after your first login.</p>
        </div>
      </div>
    </div>
  );
}