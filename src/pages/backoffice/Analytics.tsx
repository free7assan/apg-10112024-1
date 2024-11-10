import React from 'react';
import { Analytics as AnalyticsComponent } from '../../components/backoffice/Analytics';

export function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
      <AnalyticsComponent />
    </div>
  );
}