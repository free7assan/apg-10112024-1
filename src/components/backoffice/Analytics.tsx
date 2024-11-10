import React from 'react';
import { BarChart2, TrendingUp, Users, CreditCard } from 'lucide-react';

export function Analytics() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { name: 'Total Revenue', value: '$124,592', change: '+12.3%', icon: TrendingUp },
          { name: 'Active Users', value: '2,543', change: '+8.1%', icon: Users },
          { name: 'Conversion Rate', value: '3.2%', change: '+2.4%', icon: BarChart2 },
          { name: 'Avg. Subscription', value: '$49.99', change: '+5.7%', icon: CreditCard },
        ].map((metric) => (
          <div
            key={metric.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <metric.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {metric.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {metric.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        {metric.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Revenue chart will be displayed here</p>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">User growth chart will be displayed here</p>
          </div>
        </div>

        {/* Subscription Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Distribution</h3>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Subscription distribution chart will be displayed here</p>
          </div>
        </div>

        {/* Churn Analysis */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Churn Analysis</h3>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Churn analysis chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">New subscription purchased</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <div className="mt-1">
                <p className="text-sm text-gray-500">
                  User upgraded to Pro plan ($19.99/month)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}