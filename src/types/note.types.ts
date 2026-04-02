import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from "./task.types";

export type Note = Task;

export interface CreateNoteInput extends CreateTaskInput {}

export interface UpdateNoteInput extends UpdateTaskInput {}