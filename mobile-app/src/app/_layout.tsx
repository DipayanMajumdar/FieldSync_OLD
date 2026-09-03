import { Stack } from 'expo-router';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="fieldsync.db" onInit={initializeDatabase}>
      <Stack />
    </SQLiteProvider>
  );
}

// Added the strict SQLiteDatabase type here
async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      wbs_id TEXT, 
      progress TEXT, 
      uri TEXT, 
      type TEXT
    );
  `);
}