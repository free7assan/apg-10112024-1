import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface PlaybookDB extends DBSchema {
  users: {
    key: string;
    value: {
      id: string;
      email: string;
      password: string;
      role: 'admin' | 'user';
      created_at: string;
      last_login?: string;
    };
    indexes: { 'by-email': string };
  };
  playbooks: {
    key: string;
    value: {
      id: string;
      user_id: string;
      name: string;
      content: string;
      type: string;
      created_at: string;
    };
    indexes: { 'by-user': string };
  };
}

let dbPromise: Promise<IDBPDatabase<PlaybookDB>>;

export async function initDB() {
  if (!dbPromise) {
    dbPromise = openDB<PlaybookDB>('playbooks-db', 1, {
      upgrade(db) {
        // Users store
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by-email', 'email', { unique: true });

        // Playbooks store
        const playbookStore = db.createObjectStore('playbooks', { keyPath: 'id' });
        playbookStore.createIndex('by-user', 'user_id');

        // Add default users
        userStore.add({
          id: '1',
          email: 'free7assan@gmail.com',
          password: '123456',
          role: 'admin',
          created_at: new Date().toISOString()
        });

        userStore.add({
          id: '2',
          email: 'user@gmail.com',
          password: '123456',
          role: 'user',
          created_at: new Date().toISOString()
        });
      }
    });
  }
  return dbPromise;
}

// Database helper functions
export const db = {
  async run(sql: string, params: any[] = []): Promise<void> {
    const db = await initDB();
    // This is a simplified implementation - in a real app you'd need to parse the SQL
    // For now, we'll just use it as a pass-through for direct IndexedDB operations
    console.log('SQL operation:', sql, params);
  },

  async get(sql: string, params: any[] = []): Promise<any> {
    const db = await initDB();
    // This is a simplified implementation
    if (sql.includes('users')) {
      if (sql.includes('WHERE email =')) {
        return db.getFromIndex('users', 'by-email', params[0]);
      }
      if (sql.includes('WHERE id =')) {
        return db.get('users', params[0]);
      }
    }
    return null;
  },

  async all(sql: string, params: any[] = []): Promise<any[]> {
    const db = await initDB();
    // This is a simplified implementation
    if (sql.includes('users')) {
      return db.getAll('users');
    }
    if (sql.includes('playbooks')) {
      return db.getAll('playbooks');
    }
    return [];
  }
};