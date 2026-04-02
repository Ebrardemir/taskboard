import { db } from "../config/db";
import { SafeUser, User, UserRole } from "../types/auth.types";

const toSafeUser = (user: User): SafeUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  created_at: user.created_at,
  updated_at: user.updated_at,
});

export const findUserByEmail = (email: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, row: User | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      }
    );
  });
};

export const findUserById = (id: number): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE id = ?",
      [id],
      (err, row: User | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      }
    );
  });
};

export const createUser = (
  username: string,
  email: string,
  passwordHash: string,
  role: UserRole = "user"
): Promise<User> => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;

    db.run(query, [username, email, passwordHash, role], function (err) {
      if (err) {
        reject(err);
        return;
      }

      db.get(
        "SELECT * FROM users WHERE id = ?",
        [this.lastID],
        (selectErr, row: User | undefined) => {
          if (selectErr) {
            reject(selectErr);
          } else if (!row) {
            reject(new Error("Created user could not be found"));
          } else {
            resolve(row);
          }
        }
      );
    });
  });
};

export const getAllUsers = (): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users ORDER BY id ASC", [], (err, rows: User[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export const getAllSafeUsers = async (): Promise<SafeUser[]> => {
  const users = await getAllUsers();
  return users.map(toSafeUser);
};