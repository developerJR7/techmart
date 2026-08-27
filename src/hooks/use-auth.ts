import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
    const store = useAuthStore();
    return {
        user: store.user,
        accessToken: store.accessToken,
        isInitialized: store.isInitialized,
        login: store.login,
        logout: store.logout,
        register: store.register,
        isAuthenticated: store.isAuthenticated,
        isAdmin: store.isAdmin,
        updateProfile: store.updateProfile,
        uploadAvatar: store.uploadAvatar,
    };
}
