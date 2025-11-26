import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

import api from '@/lib/api';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  updateTokens: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken });
      },
      updateTokens: (accessToken, refreshToken) => {
        set((state) => ({
          accessToken,
          refreshToken: refreshToken ?? state.refreshToken,
        }));
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },
      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, accessToken, refreshToken } = response.data;
          set({ user, accessToken, refreshToken });

          // Sync with localStorage for api interceptor
          localStorage.setItem('token', accessToken);
          localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          throw error;
        }
      },
      isAuthenticated: () => {
        return !!get().user && !!get().accessToken;
      },
      isAdmin: () => {
        return get().user?.role === 'ADMIN';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

