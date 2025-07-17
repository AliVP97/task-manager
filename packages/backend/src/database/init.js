import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DB_PATH || join(__dirname, '../../data/tasks.db');

// Create database connection
const db = new sqlite3.Database(dbPath);

export const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create tasks table
      db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          description TEXT NOT NULL CHECK(length(description) <= 500),
          status TEXT NOT NULL CHECK(status IN ('pending', 'complete')) DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('❌ Error creating tasks table:', err);
          reject(err);
        } else {
          console.log('✅ Database initialized successfully');
          resolve();
        }
      });

      // Create trigger to update updated_at timestamp
      db.run(`
        CREATE TRIGGER IF NOT EXISTS update_task_timestamp 
        AFTER UPDATE ON tasks
        BEGIN
          UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END
      `);
    });
  });
};

export default db;