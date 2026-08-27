import api from '@/lib/api';

export interface LoyaltyProfile {
    points: number;
    lifetimePoints: number;
    tier: string;
    history: LoyaltyTransaction[];
}

export interface LoyaltyTransaction {
    id: string;
    amount: number;
    type: 'EARN' | 'REDEEM' | 'ADJUSTMENT';
    description: string;
    createdAt: string;
}

export const loyaltyService = {
    async getProfile() {
        const response = await api.get<LoyaltyProfile>('/loyalty/profile');
        return response.data;
    },

    async calculateEarn(amount: number) {
        const response = await api.get<{ points: number }>('/loyalty/calculate-earn', {
            params: { amount }
        });
        return response.data;
    },

    async calculateValue(points: number) {
        const response = await api.get<{ value: number }>('/loyalty/calculate-value', {
            params: { points }
        });
        return response.data;
    }
};
