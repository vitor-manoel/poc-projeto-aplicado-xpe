import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('poc.db');

export interface Message {
  id: number;
  payload: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
  created_at: string;
  updated_at: string;
}

export const initDB = (): void => {
  try {
    // Create messages table with timestamps
    db.execSync(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payload TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`
    );
    
    // Create trigger to update updated_at timestamp
    db.execSync(
      `CREATE TRIGGER IF NOT EXISTS messages_updated_at 
       AFTER UPDATE ON messages 
       BEGIN 
         UPDATE messages SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
       END;`
    );
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const enqueueMessage = async (payload: string): Promise<number> => {
  try {
    const result = db.runSync(
      "INSERT INTO messages (payload) VALUES (?)", 
      [payload]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error enqueueing message:', error);
    throw error;
  }
};

export const getAllMessages = (): Message[] => {
  try {
    return db.getAllSync("SELECT * FROM messages ORDER BY created_at DESC") as Message[];
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

export const updateMessageStatus = async (id: number, status: Message['status']): Promise<void> => {
  try {
    db.runSync(
      "UPDATE messages SET status = ? WHERE id = ?", 
      [status, id]
    );
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
};

export const deleteMessage = async (id: number): Promise<void> => {
  try {
    db.runSync(
      "DELETE FROM messages WHERE id = ?", 
      [id]
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

export const clearAllMessages = async (): Promise<void> => {
  try {
    db.runSync("DELETE FROM messages");
  } catch (error) {
    console.error('Error clearing messages:', error);
    throw error;
  }
};

export const getMessageStats = (): {pending: number, processing: number, done: number, failed: number, total: number} => {
  try {
    const result = db.getFirstSync(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
       FROM messages`
    ) as any;
    
    return {
      total: result?.total || 0,
      pending: result?.pending || 0,
      processing: result?.processing || 0,
      done: result?.done || 0,
      failed: result?.failed || 0
    };
  } catch (error) {
    console.error('Error getting message stats:', error);
    return {
      total: 0,
      pending: 0,
      processing: 0,
      done: 0,
      failed: 0
    };
  }
};

// Legacy function for backward compatibility
export const completeMessage = (id: number): Promise<void> => {
  return updateMessageStatus(id, 'done');
};
