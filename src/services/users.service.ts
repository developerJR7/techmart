import api from '@/lib/api';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export const usersService = {
    async getProfile() {
        const response = await api.get<UserProfile>('/users/me');
        return response.data;
    }
};
