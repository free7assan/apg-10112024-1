import { UserModel } from '../models/UserModel';
import { SubscriptionModel } from '../models/SubscriptionModel';
import { PlaybookModel } from '../models/PlaybookModel';

export class AnalyticsService {
  static async getDashboardStats() {
    const [userStats, subscriptionStats, playbookStats] = await Promise.all([
      UserModel.getStats(),
      SubscriptionModel.getStats(),
      PlaybookModel.getStats()
    ]);

    // Calculate growth rates
    const userGrowthRate = ((userStats.active - userStats.inactive) / userStats.total) * 100;
    const revenueGrowthRate = 12.3; // This would be calculated from historical data

    return {
      users: {
        total: userStats.total,
        active: userStats.active,
        inactive: userStats.inactive,
        growthRate: userGrowthRate
      },
      subscriptions: {
        active: subscriptionStats.activeSubscriptions,
        byPlan: subscriptionStats.byPlan,
        revenue: subscriptionStats.totalRevenue,
        revenueGrowth: revenueGrowthRate
      },
      playbooks: {
        total: playbookStats.total,
        byComplexity: playbookStats.byComplexity
      },
      recentActivity: {
        payments: subscriptionStats.recentPayments,
        // Add other recent activity types here
      }
    };
  }

  static async getUserAnalytics() {
    const users = await UserModel.list();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    const newUsers = users.filter(u => 
      new Date(u.created_at) >= thirtyDaysAgo
    ).length;

    const activeUsers = users.filter(u => 
      u.last_login && new Date(u.last_login) >= thirtyDaysAgo
    ).length;

    return {
      newUsers,
      activeUsers,
      retentionRate: (activeUsers / users.length) * 100,
      usersByRole: users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  static async getSubscriptionAnalytics() {
    const subscriptionStats = await SubscriptionModel.getStats();
    const users = await UserModel.list();

    const subscriptionRate = (subscriptionStats.activeSubscriptions / users.length) * 100;

    return {
      totalRevenue: subscriptionStats.totalRevenue,
      activeSubscriptions: subscriptionStats.activeSubscriptions,
      subscriptionRate,
      revenueByPlan: subscriptionStats.byPlan,
      recentPayments: subscriptionStats.recentPayments
    };
  }

  static async getPlaybookAnalytics() {
    const playbooks = await PlaybookModel.findAll();
    const users = await UserModel.list();

    const playbooksPerUser = playbooks.length / users.length;

    return {
      totalPlaybooks: playbooks.length,
      playbooksPerUser,
      byComplexity: playbooks.reduce((acc, playbook) => {
        acc[playbook.complexity] = (acc[playbook.complexity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}