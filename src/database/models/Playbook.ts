import { getDB } from '../db';
import { PlaybookVersionModel } from './PlaybookVersion';

export interface Playbook {
  id: number;
  user_id: number;
  name: string;
  description: string;
  content: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  structure: 'single' | 'multi';
  tags: string[];
  created_at: string;
  updated_at: string;
  version: number;
  is_template: boolean;
}

export class PlaybookModel {
  static async findById(id: number): Promise<Playbook | undefined> {
    try {
      const db = await getDB();
      return db.get('playbooks', id);
    } catch (error) {
      console.error('Error finding playbook:', error);
      throw error;
    }
  }

  static async findByUser(userId: number): Promise<Playbook[]> {
    try {
      const db = await getDB();
      return db.getAllFromIndex('playbooks', 'by-user', userId);
    } catch (error) {
      console.error('Error finding playbooks by user:', error);
      throw error;
    }
  }

  static async create(playbook: Omit<Playbook, 'id' | 'created_at' | 'updated_at' | 'version'>): Promise<Playbook> {
    try {
      const db = await getDB();
      const now = new Date().toISOString();
      
      const id = await db.add('playbooks', {
        ...playbook,
        version: 1,
        created_at: now,
        updated_at: now
      });

      const created = await this.findById(id as number);
      if (!created) throw new Error('Failed to create playbook');

      // Create initial version
      await PlaybookVersionModel.create({
        playbook_id: created.id,
        content: playbook.content,
        version: 1,
        created_by: playbook.user_id
      });

      return created;
    } catch (error) {
      console.error('Error creating playbook:', error);
      throw error;
    }
  }

  static async update(id: number, updates: Partial<Playbook>, userId: number): Promise<void> {
    try {
      const db = await getDB();
      const playbook = await this.findById(id);
      if (!playbook) throw new Error('Playbook not found');

      const updatedPlaybook = {
        ...playbook,
        ...updates,
        version: playbook.version + 1,
        updated_at: new Date().toISOString()
      };

      await db.put('playbooks', updatedPlaybook);

      // Create new version if content changed
      if (updates.content) {
        await PlaybookVersionModel.create({
          playbook_id: id,
          content: updates.content,
          version: updatedPlaybook.version,
          created_by: userId
        });
      }
    } catch (error) {
      console.error('Error updating playbook:', error);
      throw error;
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      const db = await getDB();
      await db.delete('playbooks', id);
    } catch (error) {
      console.error('Error deleting playbook:', error);
      throw error;
    }
  }

  static async findTemplates(): Promise<Playbook[]> {
    try {
      const db = await getDB();
      const playbooks = await db.getAll('playbooks');
      return playbooks.filter(p => p.is_template);
    } catch (error) {
      console.error('Error finding template playbooks:', error);
      throw error;
    }
  }
}