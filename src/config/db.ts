import sqlite3 from "sqlite3";
import path from "path";

import { env } from "./env";

sqlite3.verbose();

const dbPath = path.resolve(process.cwd(), env.dbPath);

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
    return;
  }

  db.run("PRAGMA foreign_keys = ON");
  console.log(`Connected to SQLite database at ${dbPath}`);
});

export { dbPath };