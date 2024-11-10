import React from 'react';
import { DatabaseStats } from '../../components/backoffice/DatabaseStats';
import { QuickActions } from '../../components/backoffice/QuickActions';
import { RecentActivity } from '../../components/backoffice/RecentActivity';
import { AnalyticsSummary } from '../../components/backoffice/AnalyticsSummary';

export function BackofficeDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      
      <DatabaseStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        <RecentActivity />
      </div>

      <AnalyticsSummary />
    </div>
  );
}