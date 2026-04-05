import api from './axios';
import type { Task, User } from '../types';

export const adminApi = {
  getDashboard: async (): Promise<{ message: string }> => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  getUsers: async (): Promise<User[]> => {
    const res = await api.get('/admin/users');
    return res.data.data;
  },

  getAllTasks: async (): Promise<Task[]> => {
    const res = await api.get('/admin/tasks');
    return res.data.data;
  },
};
