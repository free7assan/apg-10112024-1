import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Users, CreditCard } from 'lucide-react';
import { UserModel } from '../../models/UserModel';
import { PlaybookModel } from '../../models/PlaybookModel';

interface AnalyticsData {
  totalUsers: number;
  totalPlaybooks: number;
  playbooksByComplexity: {
    basic: number;
    intermediate: number;
    advanced: number;
  };
  userGrowth: {
    current: number;
    previous: number;
  };
}

export function AnalyticsSummary() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [users, playbookStats] = await Promise.all([
          UserModel.findAll(),
          PlaybookModel.getStats()
        ]);

        // Calculate user growth
        const now = new Date();
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        
        const currentUsers = users.length;
        const previousUsers = users.filter(u => 
          new Date(u.created_at) < oneMonthAgo
        ).length;

        setData({
          totalUsers: users.length,
          totalPlaybooks: playbookStats.total,
          playbooksByComplexity: playbookStats.byComplexity,
          userGrowth: {
            current: currentUsers,
            previous: previousUsers
          }
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="animate-pulse grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg p-6 h-32"></div>
        ))}
      </div>
    );
  }

  const userGrowthRate = data.userGrowth.previous > 0
    ? ((data.userGrowth.current - data.userGrowth.previous) / data.userGrowth.previous) * 100
    : 100;

  const metrics = [
    {
      name: 'Total Users',
      value: data.totalUsers,
      change: `${userGrowthRate.toFixed(1)}%`,
      trend: userGrowthRate >= 0 ? 'up' : 'down',
      icon: Users,
    },
    {
      name: 'Total Playbooks',
      value: data.totalPlaybooks,
      change: '+0%',
      trend: 'neutral',
      icon: BarChart2,
    },
    {
      name: 'Basic Playbooks',
      value: data.playbooksByComplexity.basic || 0,
      change: '+0%',
      trend: 'neutral',
      icon: TrendingUp,
    },
    {
      name: 'Advanced Playbooks',
      value: data.playbooksByComplexity.advanced || 0,
      change: '+0%',
      trend: 'neutral',
      icon: CreditCard,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
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
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      metric.trend === 'up' ? 'text-green-600' :
                      metric.trend === 'down' ? 'text-red-600' :
                      'text-gray-500'
                    }`}>
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
  );
}