import { db } from "../config/db";
import { hashPassword } from "../utils/hash";

const seedUsers = [
  {
    username: "ebrar",
    email: "ebrar@example.com",
    password: "ebrar1",
    role: "user",
  },
  {
    username: "bengu",
    email: "bengu@example.com",
    password: "bengu1",
    role: "user",
  },
  {
    username: "gizem",
    email: "gizem@example.com",
    password: "gizem1",
    role: "user",
  },
  {
    username: "oya",
    email: "oya@example.com",
    password: "oya1",
    role: "user",
  },
  {
    username: "admin",
    email: "admin@example.com",
    password: "admin1",
    role: "admin",
  },
] as const;

const run = (sql: string, params: unknown[] = []): Promise<void> =>
  new Promise((resolve, reject) => {
    db.run(sql, params, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

export const seedDatabase = async (): Promise<void> => {
  await run("BEGIN TRANSACTION");

  try {
    for (const user of seedUsers) {
      const passwordHash = await hashPassword(user.password);

      await run(
        `INSERT OR IGNORE INTO users (username, email, password_hash, role)
         VALUES (?, ?, ?, ?)`,
        [user.username, user.email, passwordHash, user.role],
      );
    }

    await run("COMMIT");
    console.log("Database seeded successfully.");
  } catch (error) {
    await run("ROLLBACK");
    throw error;
  }
};