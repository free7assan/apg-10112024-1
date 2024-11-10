import { getDB } from '../database/db';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  created_at: string;
  last_login?: string;
  subscription?: {
    plan: 'basic' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    start_date: string;
    end_date: string;
  };
}

export class UserModel {
  static async findByEmail(email: string): Promise<User | undefined> {
    const db = await getDB();
    return db.getFromIndex('users', 'by-email', email);
  }

  static async create(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const db = await getDB();
    const id = await db.add('users', {
      ...user,
      created_at: new Date().toISOString(),
      status: 'active'
    });
    return {
      id: id as number,
      ...user,
      created_at: new Date().toISOString(),
      status: 'active'
    };
  }

  static async update(id: number, updates: Partial<User>): Promise<void> {
    const db = await getDB();
    const user = await db.get('users', id);
    if (!user) {
      throw new Error('User not found');
    }
    await db.put('users', { ...user, ...updates });
  }

  static async delete(id: number): Promise<void> {
    const db = await getDB();
    await db.delete('users', id);
  }

  static async list(): Promise<User[]> {
    const db = await getDB();
    return db.getAll('users');
  }

  static async updateStatus(id: number, status: 'active' | 'inactive'): Promise<void> {
    const db = await getDB();
    const user = await db.get('users', id);
    if (!user) {
      throw new Error('User not found');
    }
    await db.put('users', { ...user, status });
  }

  static async updateSubscription(
    id: number,
    subscription: User['subscription']
  ): Promise<void> {
    const db = await getDB();
    const user = await db.get('users', id);
    if (!user) {
      throw new Error('User not found');
    }
    await db.put('users', { ...user, subscription });
  }

  static async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
    bySubscription: Record<string, number>;
  }> {
    const users = await this.list();
    
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      byRole: users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      bySubscription: users.reduce((acc, user) => {
        if (user.subscription) {
          acc[user.subscription.plan] = (acc[user.subscription.plan] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    };
  }
}