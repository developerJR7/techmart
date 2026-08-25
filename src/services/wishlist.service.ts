import api from '@/lib/api';
import { Product } from '@/types/api.types';

export const wishlistService = {
    async getWishlist() {
        const { data } = await api.get('/wishlist');
        return data.items.map((item: any) => item.product);
    },

    async addToWishlist(productId: string) {
        await api.post('/wishlist/items', { productId });
    },

    async removeFromWishlist(productId: string) {
        await api.delete(`/wishlist/items/${productId}`);
    },

    async syncWishlist(productIds: string[]) {
        // Backend doesn't have a bulk sync endpoint yet, implementing item-by-item for now
        await Promise.all(productIds.map(id => api.post('/wishlist/items', { productId: id })));
        return this.getWishlist();
    },
};
