import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'fandom-and.db';
const DATABASE_VERSION = 1;

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;
let migrationPromise: Promise<void> | null = null;
let pragmasPromise: Promise<void> | null = null;

export async function getAppDb() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  const db = await databasePromise;

  if (!pragmasPromise) {
    pragmasPromise = enableDbPragmas(db);
  }

  await pragmasPromise;

  if (!migrationPromise) {
    migrationPromise = migrateDb(db);
  }

  await migrationPromise;

  return db;
}

async function enableDbPragmas(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);
}

async function migrateDb(db: SQLite.SQLiteDatabase) {
  const versionRow = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = versionRow?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentVersion === 0) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cart_lines (
        id TEXT PRIMARY KEY NOT NULL,
        product_id TEXT NOT NULL,
        option_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY NOT NULL,
        order_number TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        payment_approved_at TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        payment_key TEXT,
        total_amount INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY NOT NULL,
        order_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      );
    `);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
