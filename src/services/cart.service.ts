import api from '@/lib/api';
import { CartItem } from '@/types/api.types';

export const cartService = {
    async getCart() {
        const { data } = await api.get<CartItem[]>('/cart');
        return data;
    },

    async addToCart(productId: string, quantity: number = 1) {
        const { data } = await api.post<CartItem>('/cart', { productId, quantity });
        return data;
    },

    async updateCartItem(productId: string, quantity: number) {
        const { data } = await api.patch<CartItem>(`/cart/${productId}`, { quantity });
        return data;
    },

    async removeFromCart(productId: string) {
        await api.delete(`/cart/${productId}`);
    },

    async clearCart() {
        await api.delete('/cart');
    },

    async syncCart(items: { productId: string; quantity: number }[]) {
        const { data } = await api.post<CartItem[]>('/cart/merge', items);
        return data;
    },
};
