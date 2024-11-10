import React, { useState, useEffect } from 'react';
import { Users, FileText, AlertCircle } from 'lucide-react';
import { UserModel } from '../../models/UserModel';
import { PlaybookModel } from '../../models/PlaybookModel';

export function DatabaseStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlaybooks: 0,
    playbooksByComplexity: {
      basic: 0,
      intermediate: 0,
      advanced: 0
    },
    loading: true,
    error: null as string | null
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [users, playbookStats] = await Promise.all([
          UserModel.findAll(),
          PlaybookModel.getStats()
        ]);
        
        setStats({
          totalUsers: users.length,
          totalPlaybooks: playbookStats.total,
          playbooksByComplexity: playbookStats.byComplexity,
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

    fetchStats();
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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                  {stats.totalUsers}
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
                  {stats.totalPlaybooks}
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
                  Basic Playbooks
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {stats.playbooksByComplexity.basic || 0}
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
                  Advanced Playbooks
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {stats.playbooksByComplexity.advanced || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}