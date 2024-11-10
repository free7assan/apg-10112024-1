import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { hashPassword } from '../utils/password';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
  try {
    // Create database connection
    const db = new Database('playbooks.db');

    // Enable foreign keys
    db.pragma('foreign_keys = ON');

    // Read and execute schema
    console.log('Reading schema file...');
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute each statement
    console.log('Executing schema statements...');
    for (const statement of statements) {
      db.exec(statement + ';');
    }

    // Update admin passwords with proper hashes
    console.log('Updating admin passwords...');
    const adminHash = await hashPassword('admin123');
    db.prepare(
      'UPDATE users SET password_hash = ? WHERE email IN (?, ?)'
    ).run(adminHash, 'free7assan@gmail.com', 'admin@gmail.com');

    console.log('Database migration completed successfully!');
    db.close();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();