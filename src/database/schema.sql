-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  settings TEXT -- JSON string for user settings
);

-- Playbooks table
CREATE TABLE IF NOT EXISTS playbooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL, -- YAML content
  complexity TEXT NOT NULL CHECK (complexity IN ('basic', 'intermediate', 'advanced')),
  structure TEXT NOT NULL CHECK (structure IN ('single', 'multi')),
  version INTEGER NOT NULL DEFAULT 1,
  is_template BOOLEAN DEFAULT 0,
  tags TEXT, -- JSON array of tags
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Playbook versions table
CREATE TABLE IF NOT EXISTS playbook_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  playbook_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  version INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER NOT NULL,
  FOREIGN KEY (playbook_id) REFERENCES playbooks(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  complexity TEXT NOT NULL CHECK (complexity IN ('basic', 'intermediate', 'advanced')),
  content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'login', 'logout')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('user', 'playbook', 'template', 'setting')),
  entity_id INTEGER NOT NULL,
  details TEXT, -- JSON string with additional details
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL, -- JSON string for complex values
  category TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER NOT NULL,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Admin roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions TEXT NOT NULL, -- JSON array of permission names
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admin permissions table
CREATE TABLE IF NOT EXISTS admin_permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User roles mapping
CREATE TABLE IF NOT EXISTS user_roles (
  user_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL,
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  assigned_by INTEGER NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES admin_roles(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_playbooks_user ON playbooks(user_id);
CREATE INDEX IF NOT EXISTS idx_playbook_versions_playbook ON playbook_versions(playbook_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);

-- Insert default admin role
INSERT OR IGNORE INTO admin_roles (name, description, permissions) VALUES 
('Super Admin', 'Full system access with all permissions', '["all"]');

-- Insert default permissions
INSERT OR IGNORE INTO admin_permissions (name, description, category) VALUES 
('manage_users', 'Create, update, and delete user accounts', 'User Management'),
('manage_playbooks', 'Manage all playbooks in the system', 'Content'),
('manage_templates', 'Create and manage playbook templates', 'Content'),
('manage_settings', 'Configure system settings', 'System'),
('view_analytics', 'Access analytics and reports', 'Reporting');

-- Insert default admin users
INSERT OR IGNORE INTO users (email, password_hash, role, status) VALUES 
('free7assan@gmail.com', '$2b$10$YourHashedAdminPassword123', 'admin', 'active'),
('admin@gmail.com', '$2b$10$YourHashedAdminPassword123', 'admin', 'active');

-- Assign Super Admin role to default admins
INSERT OR IGNORE INTO user_roles (user_id, role_id, assigned_by) 
SELECT u.id, r.id, u.id
FROM users u, admin_roles r
WHERE u.email IN ('free7assan@gmail.com', 'admin@gmail.com')
AND r.name = 'Super Admin';

-- Insert default system settings
INSERT OR IGNORE INTO system_settings (key, value, category, updated_by) VALUES 
('maintenance_mode', 'false', 'system', 1),
('backup_enabled', 'true', 'backup', 1),
('backup_frequency', '"daily"', 'backup', 1),
('smtp_config', '{"host":"smtp.example.com","port":587,"encryption":"tls"}', 'email', 1);