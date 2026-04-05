import api from './axios';
import type { Task, TaskStatus } from '../types';

export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const res = await api.get('/tasks');
    return res.data;
  },

  getById: async (id: number): Promise<Task> => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },

  create: async (data: { title: string; description: string; status?: TaskStatus }): Promise<Task> => {
    const res = await api.post('/tasks', data);
    return res.data;
  },

  update: async (id: number, data: Partial<{ title: string; description: string; status: TaskStatus }>): Promise<Task> => {
    const res = await api.patch(`/tasks/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
