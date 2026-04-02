import { db } from "../config/db";

export interface RevokedToken {
  id: number;
  token_hash: string;
  created_at: string;
}

export const addRevokedToken = (tokenHash: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT OR IGNORE INTO revoked_tokens (token_hash)
      VALUES (?)
    `;

    db.run(query, [tokenHash], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const findRevokedTokenByHash = (
  tokenHash: string,
): Promise<RevokedToken | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, token_hash, created_at FROM revoked_tokens WHERE token_hash = ?",
      [tokenHash],
      (err, row: RevokedToken | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      },
    );
  });
};