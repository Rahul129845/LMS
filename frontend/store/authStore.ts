'use client';
import { create } from 'zustand';
import { loginApi, registerApi, logoutApi } from '@/lib/auth';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  initialize: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('lms_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, accessToken: token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('lms_user');
      }
    }
  },

  login: async (email, password) => {
    const data = await loginApi(email, password);
    localStorage.setItem('lms_user', JSON.stringify(data.user));
    set({ user: data.user, accessToken: data.accessToken, isAuthenticated: true });
  },

  register: async (name, email, password) => {
    const data = await registerApi(name, email, password);
    localStorage.setItem('lms_user', JSON.stringify(data.user));
    set({ user: data.user, accessToken: data.accessToken, isAuthenticated: true });
  },

  logout: async () => {
    await logoutApi();
    localStorage.removeItem('lms_user');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
