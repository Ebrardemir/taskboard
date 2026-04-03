import api from './axios';
import type { User } from '../types';

export interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data;
  },

  register: async (username: string, email: string, password: string): Promise<User> => {
    const res = await api.post('/auth/register', { username, email, password });
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};
