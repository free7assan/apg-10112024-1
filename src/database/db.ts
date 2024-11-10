import { openDB } from 'idb';
import type { AppDatabase } from './schema';
import { hashPassword } from '../utils/password';

let dbPromise: Promise<IDBPDatabase<AppDatabase>>;
let isInitializing = false;

export async function initDB() {
  if (isInitializing) {
    return dbPromise;
  }

  if (!dbPromise) {
    isInitializing = true;
    try {
      dbPromise = openDB<AppDatabase>('ansible-generator-db', 1, {
        async upgrade(db) {
          // Create stores if they don't exist
          if (!db.objectStoreNames.contains('users')) {
            const userStore = db.createObjectStore('users', { 
              keyPath: 'id', 
              autoIncrement: true 
            });
            userStore.createIndex('by-email', 'email', { unique: true });
          }

          if (!db.objectStoreNames.contains('playbooks')) {
            const playbookStore = db.createObjectStore('playbooks', {
              keyPath: 'id',
              autoIncrement: true
            });
            playbookStore.createIndex('by-user', 'user_id');
          }

          if (!db.objectStoreNames.contains('playbook_versions')) {
            const versionStore = db.createObjectStore('playbook_versions', {
              keyPath: 'id',
              autoIncrement: true
            });
            versionStore.createIndex('by-playbook', 'playbook_id');
          }

          if (!db.objectStoreNames.contains('templates')) {
            db.createObjectStore('templates', {
              keyPath: 'id',
              autoIncrement: true
            });
          }

          if (!db.objectStoreNames.contains('audit_logs')) {
            const auditStore = db.createObjectStore('audit_logs', {
              keyPath: 'id',
              autoIncrement: true
            });
            auditStore.createIndex('by-user', 'user_id');
          }

          if (!db.objectStoreNames.contains('system_settings')) {
            db.createObjectStore('system_settings', { keyPath: 'key' });
          }

          if (!db.objectStoreNames.contains('stats')) {
            db.createObjectStore('stats', { keyPath: 'key' });
          }

          // Initialize default data
          const tx = db.transaction(['users', 'stats'], 'readwrite');

          // Add default admin users if they don't exist
          const userStore = tx.objectStore('users');
          const adminHash = await hashPassword('admin123');

          const existingAdmin1 = await userStore.index('by-email').get('free7assan@gmail.com');
          if (!existingAdmin1) {
            await userStore.add({
              email: 'free7assan@gmail.com',
              password_hash: adminHash,
              role: 'admin',
              status: 'active',
              created_at: new Date().toISOString()
            });
          }

          const existingAdmin2 = await userStore.index('by-email').get('admin@gmail.com');
          if (!existingAdmin2) {
            await userStore.add({
              email: 'admin@gmail.com',
              password_hash: adminHash,
              role: 'admin',
              status: 'active',
              created_at: new Date().toISOString()
            });
          }

          // Initialize stats
          const statsStore = tx.objectStore('stats');
          const stats = await statsStore.get('global');
          if (!stats) {
            await statsStore.put({
              key: 'global',
              total_users: 2,
              active_users: 2,
              total_playbooks: 0,
              total_templates: 0,
              playbooks_by_complexity: {
                basic: 0,
                intermediate: 0,
                advanced: 0
              },
              last_updated: new Date().toISOString()
            });
          }

          await tx.done;
        }
      });
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    } finally {
      isInitializing = false;
    }
  }
  return dbPromise;
}

export async function getDB() {
  if (!dbPromise) {
    await initDB();
  }
  return dbPromise;
}

export async function updateStats() {
  const db = await getDB();
  const tx = db.transaction(['users', 'playbooks', 'stats'], 'readwrite');

  try {
    const [users, playbooks] = await Promise.all([
      tx.objectStore('users').getAll(),
      tx.objectStore('playbooks').getAll()
    ]);

    const activeUsers = users.filter(u => u.status === 'active').length;
    const playbooksByComplexity = playbooks.reduce((acc, p) => {
      acc[p.complexity] = (acc[p.complexity] || 0) + 1;
      return acc;
    }, { basic: 0, intermediate: 0, advanced: 0 });

    await tx.objectStore('stats').put({
      key: 'global',
      total_users: users.length,
      active_users: activeUsers,
      total_playbooks: playbooks.length,
      total_templates: playbooks.filter(p => p.is_template).length,
      playbooks_by_complexity: playbooksByComplexity,
      last_updated: new Date().toISOString()
    });

    await tx.done;
  } catch (error) {
    console.error('Error updating stats:', error);
    throw error;
  }
}

export async function resetDB() {
  const db = await getDB();
  const tx = db.transaction(
    ['users', 'playbooks', 'playbook_versions', 'templates', 'audit_logs', 'system_settings', 'stats'],
    'readwrite'
  );

  try {
    // Clear all stores
    await Promise.all([
      tx.objectStore('users').clear(),
      tx.objectStore('playbooks').clear(),
      tx.objectStore('playbook_versions').clear(),
      tx.objectStore('templates').clear(),
      tx.objectStore('audit_logs').clear(),
      tx.objectStore('system_settings').clear(),
      tx.objectStore('stats').clear()
    ]);

    // Re-add default admin users
    const adminHash = await hashPassword('admin123');
    const userStore = tx.objectStore('users');
    
    await userStore.add({
      email: 'free7assan@gmail.com',
      password_hash: adminHash,
      role: 'admin',
      status: 'active',
      created_at: new Date().toISOString()
    });

    await userStore.add({
      email: 'admin@gmail.com',
      password_hash: adminHash,
      role: 'admin',
      status: 'active',
      created_at: new Date().toISOString()
    });

    // Reset stats
    await tx.objectStore('stats').put({
      key: 'global',
      total_users: 2,
      active_users: 2,
      total_playbooks: 0,
      total_templates: 0,
      playbooks_by_complexity: {
        basic: 0,
        intermediate: 0,
        advanced: 0
      },
      last_updated: new Date().toISOString()
    });

    await tx.done;
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
}