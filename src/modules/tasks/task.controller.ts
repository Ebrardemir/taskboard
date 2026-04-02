import type { Request, Response } from "express";

import type { AuthUser } from "../../types/auth.types";
import { taskService } from "./task.service";
import { createTaskSchema, updateTaskSchema } from "./task.validation";

const getUser = (req: Request): AuthUser => req.user as AuthUser;

export const taskController = {
  async list(req: Request, res: Response) {
    const tasks = await taskService.list(getUser(req));
    return res.status(200).json(tasks);
  },

  async getSingle(req: Request, res: Response) {
    const taskId = Number(req.params.id);
    const task = await taskService.getById(getUser(req), taskId);

    return res.status(200).json(task);
  },

  async create(req: Request, res: Response) {
    const input = createTaskSchema.parse(req.body);
    const task = await taskService.create(getUser(req), input);

    return res.status(201).json(task);
  },

  async update(req: Request, res: Response) {
    const taskId = Number(req.params.id);
    const input = updateTaskSchema.parse(req.body);
    const task = await taskService.update(getUser(req), taskId, input);

    return res.status(200).json(task);
  },

  async remove(req: Request, res: Response) {
    const taskId = Number(req.params.id);
    await taskService.remove(getUser(req), taskId);

    return res.status(204).send();
  },
};
