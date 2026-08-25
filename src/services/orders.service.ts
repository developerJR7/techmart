import api from '@/lib/api';
import { Order, PaginatedResponse } from '@/types/api.types';

export interface CreateOrderData {
    items: { productId: string; quantity: number }[];
    shippingAddress: {
        street: string;
        number: string;
        city: string;
        state: string;
        zipCode: string;
        complement?: string;
        neighborhood: string;
    };
    paymentMethod: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
    couponCode?: string;
}

export const ordersService = {
    async createOrder(orderData: CreateOrderData) {
        const { data } = await api.post<Order>('/orders', orderData);
        return data;
    },

    async getOrders(page: number = 1, limit: number = 10) {
        const { data } = await api.get<PaginatedResponse<Order>>('/orders', { params: { page, limit } });
        return data;
    },

    async getOrderById(id: string) {
        const { data } = await api.get<Order>(`/orders/${id}`);
        return data;
    },

    async cancelOrder(id: string) {
        const { data } = await api.patch<Order>(`/orders/${id}/cancel`);
        return data;
    },

    // Admin
    async getAllOrders(filters?: { status?: string; page?: number; limit?: number }) {
        const { data } = await api.get<PaginatedResponse<Order>>('/admin/orders', { params: filters });
        return data;
    },

    async updateOrderStatus(id: string, status: Order['status']) {
        const { data } = await api.patch<Order>(`/admin/orders/${id}/status`, { status });
        return data;
    },
};
