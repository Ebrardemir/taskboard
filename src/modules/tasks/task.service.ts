import { taskRepository } from "../../repositories/task.repository";
import type { AuthUser } from "../../types/auth.types";
import type { CreateTaskInput, UpdateTaskInput } from "../../types/task.types";

export const taskService = {
  async list(user: AuthUser) {
    return taskRepository.findAllByOwnerId(user.id);
  },

  async getById(user: AuthUser, taskId: number) {
    const task = await taskRepository.findById(taskId);

    if (!task || task.ownerId !== user.id) {
      throw new Error("Task not found");
    }

    return task;
  },

  async create(user: AuthUser, input: CreateTaskInput) {
    return taskRepository.create(user.id, input);
  },

  async update(user: AuthUser, taskId: number, input: UpdateTaskInput) {
    const task = await taskRepository.findById(taskId);

    if (!task || task.ownerId !== user.id) {
      throw new Error("Task not found");
    }

    return taskRepository.update(taskId, input);
  },

  async remove(user: AuthUser, taskId: number) {
    const task = await taskRepository.findById(taskId);

    if (!task || task.ownerId !== user.id) {
      throw new Error("Task not found");
    }

    await taskRepository.delete(taskId);
  },
};
