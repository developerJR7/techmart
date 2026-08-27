import api from '@/lib/api';
import { UserRole } from '@/types/api.types';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
}

export const usersService = {
    async getProfile() {
        const response = await api.get<UserProfile>('/users/me');
        return response.data;
    }
};
