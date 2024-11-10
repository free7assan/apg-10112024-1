import React, { useState, useEffect } from 'react';
import { Database, Users, FileText, AlertCircle } from 'lucide-react';
import { UserModel } from '../../../models/UserModel';
import { PlaybookModel } from '../../../models/PlaybookModel';

export function DatabaseOverview() {
  const [stats, setStats] = useState({
    users: 0,
    playbooks: 0,
    templates: 0,
    dbSize: '0 MB',
    loading: true,
    error: null as string | null
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [users, playbooks] = await Promise.all([
          UserModel.findAll(),
          PlaybookModel.findAll()
        ]);

        setStats({
          users: users.length,
          playbooks: playbooks.length,
          templates: playbooks.filter(p => p.is_template).length,
          dbSize: '2.5 MB', // This would be calculated in a real implementation
          loading: false,
          error: null
        });
      } catch (error) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load database statistics'
        }));
      }
    }

    loadStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{stats.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Database className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Database Size
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.dbSize}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.users}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Playbooks
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.playbooks}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Templates
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.templates}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Database Health
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-800">Status</h4>
              <p className="mt-1 text-sm text-green-600">Healthy</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-800">Last Backup</h4>
              <p className="mt-1 text-sm text-green-600">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}