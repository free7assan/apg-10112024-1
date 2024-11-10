import { getDB } from '../db';

export interface PlaybookVersion {
  id: number;
  playbook_id: number;
  content: string;
  version: number;
  created_at: string;
  created_by: number;
}

export class PlaybookVersionModel {
  static async create(version: Omit<PlaybookVersion, 'id' | 'created_at'>): Promise<PlaybookVersion> {
    try {
      const db = await getDB();
      const id = await db.add('playbook_versions', {
        ...version,
        created_at: new Date().toISOString()
      });
      
      const created = await db.get('playbook_versions', id);
      if (!created) throw new Error('Failed to create playbook version');
      return created;
    } catch (error) {
      console.error('Error creating playbook version:', error);
      throw error;
    }
  }

  static async findByPlaybook(playbookId: number): Promise<PlaybookVersion[]> {
    try {
      const db = await getDB();
      return db.getAllFromIndex('playbook_versions', 'by-playbook', playbookId);
    } catch (error) {
      console.error('Error finding playbook versions:', error);
      throw error;
    }
  }

  static async getLatestVersion(playbookId: number): Promise<PlaybookVersion | undefined> {
    try {
      const versions = await this.findByPlaybook(playbookId);
      return versions.sort((a, b) => b.version - a.version)[0];
    } catch (error) {
      console.error('Error getting latest playbook version:', error);
      throw error;
    }
  }
}