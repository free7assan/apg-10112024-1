import { getDB, updateStats } from '../database/db';

export interface Playbook {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  content: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  structure: 'single' | 'multi';
  created_at: string;
  updated_at: string;
}

export class PlaybookModel {
  static async create(data: Omit<Playbook, 'id' | 'created_at' | 'updated_at'>): Promise<Playbook> {
    const db = await getDB();
    const tx = db.transaction(['playbooks', 'stats'], 'readwrite');
    
    const now = new Date().toISOString();
    const id = await tx.objectStore('playbooks').add({
      ...data,
      created_at: now,
      updated_at: now
    });

    await updateStats();
    await tx.done;

    return {
      id: id as number,
      ...data,
      created_at: now,
      updated_at: now
    };
  }

  static async findByUser(userId: number): Promise<Playbook[]> {
    const db = await getDB();
    return db.getAllFromIndex('playbooks', 'by-user', userId);
  }

  static async findAll(): Promise<Playbook[]> {
    const db = await getDB();
    return db.getAll('playbooks');
  }

  static async delete(id: number): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(['playbooks', 'stats'], 'readwrite');
    
    await tx.objectStore('playbooks').delete(id);
    await updateStats();
    await tx.done;
  }

  static async getStats(): Promise<{ total: number; byComplexity: Record<string, number> }> {
    const db = await getDB();
    const playbooks = await db.getAll('playbooks');
    
    const byComplexity = playbooks.reduce((acc, p) => {
      acc[p.complexity] = (acc[p.complexity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: playbooks.length,
      byComplexity
    };
  }
}