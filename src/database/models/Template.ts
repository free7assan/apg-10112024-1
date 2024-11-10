import { getDB } from '../db';

export interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  content: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

export class TemplateModel {
  static async findById(id: number): Promise<Template | undefined> {
    try {
      const db = await getDB();
      return db.get('templates', id);
    } catch (error) {
      console.error('Error finding template:', error);
      throw error;
    }
  }

  static async findAll(): Promise<Template[]> {
    try {
      const db = await getDB();
      return db.getAll('templates');
    } catch (error) {
      console.error('Error finding all templates:', error);
      throw error;
    }
  }

  static async create(template: Omit<Template, 'id' | 'created_at' | 'updated_at'>): Promise<Template> {
    try {
      const db = await getDB();
      const now = new Date().toISOString();
      const id = await db.add('templates', {
        ...template,
        created_at: now,
        updated_at: now
      });
      
      const created = await this.findById(id as number);
      if (!created) throw new Error('Failed to create template');
      return created;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  static async update(id: number, updates: Partial<Template>): Promise<void> {
    try {
      const db = await getDB();
      const template = await this.findById(id);
      if (!template) throw new Error('Template not found');
      
      await db.put('templates', {
        ...template,
        ...updates,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      const db = await getDB();
      await db.delete('templates', id);
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  static async findByCategory(category: string): Promise<Template[]> {
    try {
      const templates = await this.findAll();
      return templates.filter(t => t.category === category);
    } catch (error) {
      console.error('Error finding templates by category:', error);
      throw error;
    }
  }
}