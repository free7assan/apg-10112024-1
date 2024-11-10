import { getDB } from '../db';

export interface SystemSetting {
  key: string;
  value: any;
  category: string;
  updated_at: string;
  updated_by: number;
}

export class SystemSettingModel {
  static async get(key: string): Promise<SystemSetting | undefined> {
    try {
      const db = await getDB();
      return db.get('system_settings', key);
    } catch (error) {
      console.error('Error getting system setting:', error);
      throw error;
    }
  }

  static async set(key: string, value: any, category: string, userId: number): Promise<void> {
    try {
      const db = await getDB();
      await db.put('system_settings', {
        key,
        value,
        category,
        updated_at: new Date().toISOString(),
        updated_by: userId
      });
    } catch (error) {
      console.error('Error setting system setting:', error);
      throw error;
    }
  }

  static async getByCategory(category: string): Promise<SystemSetting[]> {
    try {
      const db = await getDB();
      const all = await db.getAll('system_settings');
      return all.filter(setting => setting.category === category);
    } catch (error) {
      console.error('Error getting settings by category:', error);
      throw error;
    }
  }

  static async delete(key: string): Promise<void> {
    try {
      const db = await getDB();
      await db.delete('system_settings', key);
    } catch (error) {
      console.error('Error deleting system setting:', error);
      throw error;
    }
  }
}