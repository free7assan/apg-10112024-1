import React, { useState, useEffect } from 'react';
import { UserModel } from '../../models/UserModel';
import { PlaybookModel } from '../../models/PlaybookModel';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'user_created' | 'playbook_created';
  description: string;
  timestamp: Date;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      try {
        const [users, playbooks] = await Promise.all([
          UserModel.findAll(),
          PlaybookModel.findAll()
        ]);

        const userActivities = users.map(user => ({
          id: `user-${user.id}`,
          type: 'user_created' as const,
          description: `New user registered: ${user.email}`,
          timestamp: new Date(user.created_at)
        }));

        const playbookActivities = playbooks.map(playbook => ({
          id: `playbook-${playbook.id}`,
          type: 'playbook_created' as const,
          description: `New playbook created: ${playbook.name}`,
          timestamp: new Date(playbook.created_at)
        }));

        const allActivities = [...userActivities, ...playbookActivities]
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 10);

        setActivities(allActivities);
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-6 flow-root">
          <ul className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                        activity.type === 'user_created' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        <span className="text-white text-sm font-medium">
                          {activity.type === 'user_created' ? 'U' : 'P'}
                        </span>
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}