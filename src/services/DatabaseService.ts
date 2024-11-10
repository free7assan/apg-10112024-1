import initSqlJs, { Database } from 'sql.js';

export class DatabaseService {
  private static instance: DatabaseService;
  private db: Database | null = null;

  private constructor() {}

  static async getInstance(): Promise<DatabaseService> {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
      await DatabaseService.instance.initialize();
    }
    return DatabaseService.instance;
  }

  private async initialize() {
    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      
      this.db = new SQL.Database();
      
      // Create tables
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      this.db.run(`
        CREATE TABLE IF NOT EXISTS playbooks (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          content TEXT NOT NULL,
          type TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        );
      `);

      // Insert default users if they don't exist
      this.db.run(`
        INSERT OR IGNORE INTO users (id, email, password, role)
        VALUES 
          ('admin1', 'free7assan@gmail.com', '123456', 'admin'),
          ('user1', 'user@gmail.com', '123456', 'user');
      `);

    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<{ id: string; email: string; role: string } | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(
      'SELECT id, email, role FROM users WHERE email = ? AND password = ?'
    );
    stmt.bind([email, password]);
    
    const result = stmt.step();
    if (!result) return null;

    const row = stmt.getAsObject();
    return {
      id: row.id as string,
      email: row.email as string,
      role: row.role as string
    };
  }

  async savePlaybook(userId: string, name: string, content: string, type: string): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = crypto.randomUUID();
    const stmt = this.db.prepare(
      'INSERT INTO playbooks (id, user_id, name, content, type) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run([id, userId, name, content, type]);
    
    return id;
  }

  async getUserPlaybooks(userId: string): Promise<Array<{
    id: string;
    name: string;
    content: string;
    type: string;
    created_at: string;
  }>> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(
      'SELECT id, name, content, type, created_at FROM playbooks WHERE user_id = ? ORDER BY created_at DESC'
    );
    stmt.bind([userId]);
    
    const playbooks = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      playbooks.push({
        id: row.id as string,
        name: row.name as string,
        content: row.content as string,
        type: row.type as string,
        created_at: row.created_at as string
      });
    }
    
    return playbooks;
  }

  async deletePlaybook(id: string, userId: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(
      'DELETE FROM playbooks WHERE id = ? AND user_id = ?'
    );
    stmt.run([id, userId]);
    
    return true;
  }
}