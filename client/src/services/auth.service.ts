import api from './api';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post<{ user: User; token: string; refreshToken: string }>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await api.post<{ user: User; token: string; refreshToken: string }>(
      '/auth/register',
      data
    );
    return response.data;
  },

  async getMe() {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await api.post<{ token: string }>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
};

