import { PlaybookModel, CreatePlaybook } from '../database/models/Playbook';
import type { PlaybookHistory } from '../types/playbook';

export class PlaybookService {
  static async savePlaybook(
    userId: number,
    name: string,
    content: string | Record<string, string>,
    complexity: 'basic' | 'intermediate' | 'advanced',
    structure: 'single' | 'multi'
  ): Promise<PlaybookHistory> {
    try {
      const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
      
      const playbook = await PlaybookModel.create({
        user_id: userId,
        name,
        content: contentStr,
        complexity,
        structure,
        description: null
      });

      return {
        id: playbook.id.toString(),
        name: playbook.name,
        complexity: playbook.complexity,
        structure: playbook.structure,
        createdAt: new Date(playbook.created_at),
        content: content
      };
    } catch (error) {
      console.error('Save playbook error:', error);
      throw new Error('Failed to save playbook');
    }
  }

  static async getUserPlaybooks(userId: number): Promise<PlaybookHistory[]> {
    try {
      const playbooks = await PlaybookModel.findByUser(userId);
      
      return playbooks.map(p => ({
        id: p.id.toString(),
        name: p.name,
        complexity: p.complexity,
        structure: p.structure,
        createdAt: new Date(p.created_at),
        content: p.content.startsWith('{') ? JSON.parse(p.content) : p.content
      }));
    } catch (error) {
      console.error('Get playbooks error:', error);
      throw new Error('Failed to fetch playbooks');
    }
  }

  static async deletePlaybook(id: number): Promise<void> {
    try {
      await PlaybookModel.delete(id);
    } catch (error) {
      console.error('Delete playbook error:', error);
      throw new Error('Failed to delete playbook');
    }
  }
}