import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").optional(),
  description: z.string().trim().min(1, "Description cannot be empty").optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
});
