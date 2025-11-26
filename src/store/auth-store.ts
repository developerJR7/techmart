import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  updateTokens: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
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

