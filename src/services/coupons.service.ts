import api from '@/lib/api';
import { Coupon, PaginatedResponse } from '@/types/api.types';

export const couponsService = {
    async validateCoupon(code: string) {
        const { data } = await api.post<Coupon>('/coupons/validate', { code });
        return data;
    },

    // Admin
    async getCoupons(page: number = 1, limit: number = 10) {
        const { data } = await api.get<PaginatedResponse<Coupon>>('/admin/coupons', { params: { page, limit } });
        return data;
    },

    async createCoupon(couponData: Partial<Coupon>) {
        const { data } = await api.post<Coupon>('/admin/coupons', couponData);
        return data;
    },

    async updateCoupon(id: string, updates: Partial<Coupon>) {
        const { data } = await api.patch<Coupon>(`/admin/coupons/${id}`, updates);
        return data;
    },

    async deleteCoupon(id: string) {
        await api.delete(`/admin/coupons/${id}`);
    },
};
