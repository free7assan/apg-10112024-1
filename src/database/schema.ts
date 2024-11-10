export interface AppDatabase {
  users: {
    key: number;
    value: {
      id: number;
      email: string;
      password_hash: string;
      role: 'admin' | 'user';
      status: 'active' | 'inactive';
      created_at: string;
      last_login?: string;
      settings?: {
        default_complexity: 'basic' | 'intermediate' | 'advanced';
        default_structure: 'single' | 'multi';
        notifications_enabled: boolean;
      };
    };
    indexes: { 'by-email': string };
  };
  playbooks: {
    key: number;
    value: {
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
    };
    indexes: { 'by-user': number };
  };
  playbook_versions: {
    key: number;
    value: {
      id: number;
      playbook_id: number;
      content: string;
      version: number;
      created_at: string;
      created_by: number;
    };
    indexes: { 'by-playbook': number };
  };
  templates: {
    key: number;
    value: {
      id: number;
      name: string;
      description: string;
      category: string;
      complexity: 'basic' | 'intermediate' | 'advanced';
      content: string;
      created_at: string;
      updated_at: string;
      is_public: boolean;
    };
  };
  audit_logs: {
    key: number;
    value: {
      id: number;
      user_id: number;
      action: 'create' | 'update' | 'delete' | 'login' | 'logout';
      entity_type: 'user' | 'playbook' | 'template' | 'setting';
      entity_id: number;
      details: string;
      created_at: string;
      ip_address?: string;
    };
    indexes: { 'by-user': number };
  };
  system_settings: {
    key: string;
    value: {
      key: string;
      value: any;
      category: string;
      updated_at: string;
      updated_by: number;
    };
  };
  stats: {
    key: string;
    value: {
      key: string;
      total_users: number;
      active_users: number;
      total_playbooks: number;
      total_templates: number;
      playbooks_by_complexity: {
        basic: number;
        intermediate: number;
        advanced: number;
      };
      last_updated: string;
    };
  };
}