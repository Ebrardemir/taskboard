import { db } from "../config/db";
import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "../types/task.types";

const mapTaskRow = (row: any): Task => ({
  id: Number(row.id),
  title: String(row.title),
  description: String(row.description),
  status: row.status as TaskStatus,
  ownerId: Number(row.owner_id),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const getOne = <T>(sql: string, params: unknown[] = []): Promise<T | undefined> =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row as T | undefined);
    });
  });

const getAll = <T>(sql: string, params: unknown[] = []): Promise<T[]> =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve((rows as T[]) ?? []);
    });
  });

const run = (
  sql: string,
  params: unknown[] = [],
): Promise<{ lastID: number; changes: number }> =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });

export const taskRepository = {
  async findAllByOwnerId(ownerId: number): Promise<Task[]> {
    const rows = await getAll<any>(
      `SELECT id, title, description, status, owner_id, created_at, updated_at
       FROM tasks
       WHERE owner_id = ?
       ORDER BY id DESC`,
      [ownerId],
    );

    return rows.map(mapTaskRow);
  },

  async findById(id: number): Promise<Task | undefined> {
    const row = await getOne<any>(
      `SELECT id, title, description, status, owner_id, created_at, updated_at
       FROM tasks
       WHERE id = ?`,
      [id],
    );

    return row ? mapTaskRow(row) : undefined;
  },

  async create(ownerId: number, input: CreateTaskInput): Promise<Task> {
    const result = await run(
      `INSERT INTO tasks (title, description, status, owner_id)
       VALUES (?, ?, ?, ?)`,
      [input.title, input.description, input.status ?? "todo", ownerId],
    );

    const task = await this.findById(result.lastID);

    if (!task) {
      throw new Error("Task could not be created");
    }

    return task;
  },

  async update(id: number, input: UpdateTaskInput): Promise<Task | undefined> {
    const currentTask = await this.findById(id);

    if (!currentTask) {
      return undefined;
    }

    await run(
      `UPDATE tasks
       SET title = ?,
           description = ?,
           status = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        input.title ?? currentTask.title,
        input.description ?? currentTask.description,
        input.status ?? currentTask.status,
        id,
      ],
    );

    return this.findById(id);
  },

  async delete(id: number): Promise<boolean> {
    const result = await run("DELETE FROM tasks WHERE id = ?", [id]);

    return result.changes > 0;
  },
};