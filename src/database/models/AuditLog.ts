import { getDB } from '../db';

export interface AuditLog {
  id: number;
  user_id: number;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  entity_type: 'user' | 'playbook' | 'template' | 'setting';
  entity_id: number;
  details: string;
  created_at: string;
  ip_address?: string;
}

export class AuditLogModel {
  static async create(log: Omit<AuditLog, 'id' | 'created_at'>): Promise<void> {
    try {
      const db = await getDB();
      await db.add('audit_logs', {
        ...log,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating audit log:', error);
      throw error;
    }
  }

  static async findByUser(userId: number): Promise<AuditLog[]> {
    try {
      const db = await getDB();
      return db.getAllFromIndex('audit_logs', 'by-user', userId);
    } catch (error) {
      console.error('Error finding audit logs by user:', error);
      throw error;
    }
  }

  static async findAll(): Promise<AuditLog[]> {
    try {
      const db = await getDB();
      return db.getAll('audit_logs');
    } catch (error) {
      console.error('Error finding all audit logs:', error);
      throw error;
    }
  }

  static async findRecent(limit: number = 50): Promise<AuditLog[]> {
    try {
      const logs = await this.findAll();
      return logs
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error finding recent audit logs:', error);
      throw error;
    }
  }
}