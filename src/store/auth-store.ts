import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, RegisterData, UpdateProfileData } from '@/services/auth.service';
import { refreshSession } from '@/lib/api';
import { setAccessToken } from '@/lib/auth-token';
import { User } from '@/types/api.types';
import { useCartStore } from './cart-store';
import { useWishlistStore } from './wishlist-store';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isInitialized: boolean;
  setSession: (user: User, accessToken: string) => void;
  clearSession: () => void;
  /** Tenta restaurar a sessão a partir do cookie httpOnly ao carregar o app. */
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      // accessToken só existe em memória (nunca é persistido no localStorage);
      // o espelho síncrono para o interceptor do axios fica em lib/auth-token.
      accessToken: null,
      isInitialized: false,

      setSession: (user, accessToken) => {
        setAccessToken(accessToken);
        set({ user, accessToken });
      },

      clearSession: () => {
        setAccessToken(null);
        set({ user: null, accessToken: null });
      },

      initialize: async () => {
        if (get().isInitialized) return;
        const result = await refreshSession();
        if (result?.user) {
          get().setSession(result.user as User, result.accessToken);
        } else {
          get().clearSession();
        }
        set({ isInitialized: true });
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Erro ao encerrar sessão no servidor', error);
        } finally {
          get().clearSession();
          useCartStore.getState().clearCart();
          useWishlistStore.getState().clearWishlist();
        }
      },

      login: async (email, password) => {
        const response = await authService.login(email, password);
        get().setSession(response.user, response.accessToken);
        useCartStore.getState().syncWithBackend();
        useWishlistStore.getState().syncWithBackend();
      },

      register: async (data) => {
        const response = await authService.register(data);
        get().setSession(response.user, response.accessToken);
        useCartStore.getState().syncWithBackend();
        useWishlistStore.getState().syncWithBackend();
      },

      updateProfile: async (data) => {
        const updatedUser = await authService.updateProfile(data);
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : updatedUser,
        }));
      },

      uploadAvatar: async (file: File) => {
        const { user: updatedUser } = await authService.uploadAvatar(file);
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : updatedUser,
        }));
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
      // Persistimos só os dados de exibição do usuário (não sensíveis), para
      // a UI não "piscar" deslogada antes do initialize() confirmar a sessão.
      // accessToken/refreshToken nunca tocam localStorage.
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
