import api from '@/lib/api';
import { Product, PaginatedResponse, Order, User, CreateProductDto } from '@/types/api.types';

export const adminService = {
    // ============ PRODUTOS ============
    async createProduct(productData: CreateProductDto) {
        const { data } = await api.post<Product>('/admin/products', productData);
        return data;
    },

    async updateProduct(id: string, productData: Partial<Product>) {
        const { data } = await api.patch<Product>(`/admin/products/${id}`, productData);
        return data;
    },

    async deleteProduct(id: string) {
        await api.delete(`/admin/products/${id}`);
    },

    async uploadProductImage(productId: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await api.post<{ url: string }>(
            `/admin/products/${productId}/images`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
        return data.url;
    },

    // ============ PEDIDOS ============
    async getAllOrders(filters?: {
        page?: number;
        limit?: number;
        status?: string;
        startDate?: string;
        endDate?: string;
    }) {
        const { data } = await api.get<PaginatedResponse<Order>>('/admin/orders', {
            params: filters,
        });
        return data;
    },

    async updateOrderStatus(orderId: string, status: Order['status']) {
        const { data } = await api.patch<Order>(`/admin/orders/${orderId}/status`, {
            status,
        });
        return data;
    },

    // ============ CUPONS ============
    async getCoupons() {
        const { data } = await api.get('/admin/coupons');
        return data;
    },

    async createCoupon(couponData: {
        code: string;
        type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
        value: number;
        expiresAt?: string;
        usageLimit?: number;
        isActive?: boolean;
    }) {
        const { data } = await api.post('/admin/coupons', couponData);
        return data;
    },

    async updateCoupon(id: string, couponData: Partial<any>) {
        const { data } = await api.patch(`/admin/coupons/${id}`, couponData);
        return data;
    },

    async deleteCoupon(id: string) {
        await api.delete(`/admin/coupons/${id}`);
    },

    // ============ USUÁRIOS ============
    async getUsers(filters?: {
        page?: number;
        limit?: number;
        role?: string;
        search?: string;
    }) {
        const { data } = await api.get<PaginatedResponse<User>>('/admin/users', {
            params: filters,
        });
        return data;
    },

    async updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
        const { data } = await api.patch(`/admin/users/${userId}/role`, { role });
        return data;
    },

    async toggleUserBlock(userId: string, isBlocked: boolean) {
        const { data } = await api.patch(`/admin/users/${userId}/block`, { isBlocked });
        return data;
    },

    // ============ ANALYTICS ============
    async getDashboardMetrics() {
        const { data } = await api.get('/admin/analytics/dashboard');
        return data;
    },

    async getSalesReport(params?: {
        startDate?: string;
        endDate?: string;
        groupBy?: 'day' | 'week' | 'month';
    }) {
        const { data } = await api.get('/admin/analytics/sales', { params });
        return data;
    },
};
