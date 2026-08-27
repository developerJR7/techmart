import api from '@/lib/api';

export interface CreateReviewDto {
    productId: string;
    rating: number;
    title?: string;
    comment: string;
}

export interface Review {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    title?: string;
    comment: string;
    isVerifiedPurchase: boolean;
    createdAt: string;
    user: {
        id: string;
        name: string;
    };
}

export const reviewsService = {
    async create(data: CreateReviewDto) {
        const response = await api.post<Review>('/reviews', data);
        return response.data;
    },

    async getByProduct(productId: string, page = 1, limit = 10) {
        const response = await api.get<{ data: Review[], meta: any }>(`/reviews/product/${productId}`, {
            params: { page, limit }
        });
        return response.data;
    },

    async update(id: string, data: Partial<CreateReviewDto>) {
        const response = await api.patch<Review>(`/reviews/${id}`, data);
        return response.data;
    },

    async remove(id: string) {
        await api.delete(`/reviews/${id}`);
    }
};
