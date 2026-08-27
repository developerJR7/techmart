import api from '@/lib/api';
import { uploadService } from './upload.service';
import { User } from '@/types/api.types';

export interface LoginResponse {
    user: User;
    accessToken: string;
}

export interface UpdateProfileData {
    name?: string;
    avatar?: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export const authService = {
    async login(email: string, password: string) {
        const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
        return data;
    },

    async register(userData: RegisterData) {
        const { data } = await api.post<LoginResponse>('/auth/register', userData);
        return data;
    },

    async logout() {
        await api.post('/auth/logout');
    },

    async forgotPassword(email: string) {
        await api.post('/auth/forgot-password', { email });
    },

    async resetPassword(token: string, newPassword: string) {
        await api.post('/auth/reset-password', { token, newPassword });
    },

    async updateProfile(updates: UpdateProfileData) {
        const { data } = await api.patch<User>('/users/me', updates);
        return data;
    },

    async uploadAvatar(file: File) {
        // Reaproveita o endpoint de upload existente (Cloudinary) — não
        // duplica essa lógica aqui — e só então persiste a URL no perfil.
        const avatarUrl = await uploadService.uploadAvatar(file);
        const user = await this.updateProfile({ avatar: avatarUrl });
        return { avatarUrl, user };
    },
};
