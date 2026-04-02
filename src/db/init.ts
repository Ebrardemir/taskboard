import fs from "fs";
import path from "path";

import { db } from "../config/db";

const getTableColumns = (tableName: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName})`, [], (err, rows: any[]) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(rows.map((row) => String(row.name)));
    });
  });
};

const exec = (sql: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};

const syncRevokedTokensTable = async (): Promise<void> => {
  const columns = await getTableColumns("revoked_tokens");

  if (columns.length === 0) {
    return;
  }

  const expectedColumns = ["id", "token_hash", "created_at"];
  const isAlreadySynced =
    columns.length === expectedColumns.length &&
    expectedColumns.every((column, index) => columns[index] === column);

  if (isAlreadySynced) {
    return;
  }

  await exec(`
    BEGIN TRANSACTION;

    CREATE TABLE IF NOT EXISTS revoked_tokens_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    INSERT OR IGNORE INTO revoked_tokens_new (id, token_hash, created_at)
    SELECT id, token_hash, created_at
    FROM revoked_tokens;

    DROP TABLE revoked_tokens;
    ALTER TABLE revoked_tokens_new RENAME TO revoked_tokens;

    COMMIT;
  `);
};

export const initializeDatabase = async (): Promise<void> => {
  const schemaPath = path.resolve(__dirname, "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");

  await exec(schema);
  await syncRevokedTokensTable();

  console.log("Database schema initialized.");
};