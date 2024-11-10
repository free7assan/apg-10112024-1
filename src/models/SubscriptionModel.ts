import { getDB } from '../database/db';

export interface Subscription {
  id: number;
  user_id: number;
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
  billing_cycle: 'monthly' | 'yearly';
  amount: number;
  last_payment_date?: string;
  next_payment_date?: string;
  payment_method?: {
    type: 'card' | 'paypal';
    last4?: string;
  };
}

export interface Payment {
  id: number;
  subscription_id: number;
  user_id: number;
  amount: number;
  status: 'successful' | 'failed' | 'pending';
  date: string;
  payment_method: {
    type: 'card' | 'paypal';
    last4?: string;
  };
}

export class SubscriptionModel {
  static async create(subscription: Omit<Subscription, 'id'>): Promise<Subscription> {
    const db = await getDB();
    const id = await db.add('subscriptions', subscription);
    return { id: id as number, ...subscription };
  }

  static async update(id: number, updates: Partial<Subscription>): Promise<void> {
    const db = await getDB();
    const subscription = await db.get('subscriptions', id);
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    await db.put('subscriptions', { ...subscription, ...updates });
  }

  static async cancel(id: number): Promise<void> {
    await this.update(id, {
      status: 'cancelled',
      end_date: new Date().toISOString()
    });
  }

  static async findByUser(userId: number): Promise<Subscription | undefined> {
    const db = await getDB();
    return db.getFromIndex('subscriptions', 'by-user', userId);
  }

  static async addPayment(payment: Omit<Payment, 'id'>): Promise<Payment> {
    const db = await getDB();
    const id = await db.add('payments', payment);
    return { id: id as number, ...payment };
  }

  static async getPaymentHistory(userId: number): Promise<Payment[]> {
    const db = await getDB();
    return db.getAllFromIndex('payments', 'by-user', userId);
  }

  static async getStats(): Promise<{
    totalRevenue: number;
    activeSubscriptions: number;
    byPlan: Record<string, number>;
    recentPayments: Payment[];
  }> {
    const db = await getDB();
    const [subscriptions, payments] = await Promise.all([
      db.getAll('subscriptions'),
      db.getAll('payments')
    ]);

    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
    const recentPayments = payments
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return {
      totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
      activeSubscriptions: activeSubscriptions.length,
      byPlan: activeSubscriptions.reduce((acc, sub) => {
        acc[sub.plan] = (acc[sub.plan] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentPayments
    };
  }
}