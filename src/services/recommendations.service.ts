import api from '@/lib/api';
import { Product } from '@/types/api.types';

export interface ProductRecommendation {
    product: Product;
    score: number;
    reason: string;
}

export interface SimilarProduct extends Product {
    similarityScore: number;
    matchedFeatures: string[];
}

export interface FrequentlyBoughtTogether {
    products: Array<Product & { confidence: number; discount?: number }>;
    bundleDiscount?: number;
    totalSavings?: number;
}

export const recommendationsService = {
    // Recomendações personalizadas
    async getPersonalizedRecommendations(context: string = 'homepage', limit: number = 10) {
        const { data } = await api.get<{ recommendations: ProductRecommendation[] }>(
            '/ai/recommendations/personalized',
            {
                params: { limit, context },
            }
        );
        return data.recommendations;
    },

    // Produtos similares
    async getSimilarProducts(productId: string, limit: number = 6) {
        const { data } = await api.get<{ similar: SimilarProduct[] }>(
            `/ai/recommendations/similar/${productId}`,
            {
                params: { limit },
            }
        );
        return data.similar;
    },

    // Frequentemente comprados juntos
    async getFrequentlyBoughtTogether(productId: string) {
        const { data } = await api.get<FrequentlyBoughtTogether>(
            `/ai/recommendations/frequently-bought-together/${productId}`
        );
        return data;
    },
};
