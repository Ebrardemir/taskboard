import type { NextFunction,Request, Response } from "express";

import type { AuthUser } from "../../types/auth.types";
import { taskService } from "./task.service";
import { createTaskSchema, updateTaskSchema } from "./task.validation";

const getUser = (req: Request): AuthUser => req.user as AuthUser;

export const taskController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await taskService.list(getUser(req));
      return res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  },

  async getSingle(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = Number(req.params.id);
      const task = await taskService.getById(getUser(req), taskId);
      return res.status(200).json(task);
    } catch (error: any) {
      if (error.message === "Task not found") {
        return res.status(404).json({ message: "Task not found" });
      }
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createTaskSchema.parse(req.body);
      const task = await taskService.create(getUser(req), input);
      return res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = Number(req.params.id);
      const input = updateTaskSchema.parse(req.body);
      const task = await taskService.update(getUser(req), taskId, input);
      return res.status(200).json(task);
    } catch (error: any) {
      if (error.message === "Task not found") {
        return res.status(404).json({ message: "Task not found" });
      }
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = Number(req.params.id);
      await taskService.remove(getUser(req), taskId);
      return res.status(204).send();
    } catch (error: any) {
      if (error.message === "Task not found") {
        return res.status(404).json({ message: "Task not found" });
      }
      next(error);
    }
  },
};
