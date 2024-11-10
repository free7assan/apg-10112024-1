import { getDB } from '../db';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  created_at: string;
  last_login?: string;
}

export class UserModel {
  static async findByEmail(email: string): Promise<User | undefined> {
    try {
      const db = await getDB();
      return db.getFromIndex('users', 'by-email', email);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async findById(id: number): Promise<User | undefined> {
    try {
      const db = await getDB();
      return db.get('users', id);
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  static async create(user: Omit<User, 'id' | 'created_at' | 'status'>): Promise<User> {
    try {
      const db = await getDB();
      const id = await db.add('users', {
        ...user,
        status: 'active',
        created_at: new Date().toISOString()
      });
      
      const createdUser = await this.findById(id as number);
      if (!createdUser) {
        throw new Error('Failed to create user');
      }
      
      return createdUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async update(id: number, updates: Partial<User>): Promise<void> {
    try {
      const db = await getDB();
      const user = await this.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      await db.put('users', { ...user, ...updates });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      const db = await getDB();
      await db.delete('users', id);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async findAll(): Promise<User[]> {
    try {
      const db = await getDB();
      return db.getAll('users');
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }

  static async updateLastLogin(id: number): Promise<void> {
    try {
      await this.update(id, {
        last_login: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }
}