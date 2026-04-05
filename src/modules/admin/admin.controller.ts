import type { Request, Response } from "express";

import { taskRepository } from "../../repositories/task.repository";
import { getAllSafeUsers } from "../../repositories/user.repository";

export const adminController = {
  dashboard(_req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      message: "Admin access granted",
    });
  },

  async listUsers(_req: Request, res: Response) {
    const users = await getAllSafeUsers();

    return res.status(200).json({
      success: true,
      data: users,
    });
  },

  async listAllTasks(_req: Request, res: Response) {
    const tasks = await taskRepository.findAll();

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  },
};