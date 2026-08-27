import api from '@/lib/api';
import { Product } from '@/types/api.types';

export interface AIInsight {
    type: 'OPPORTUNITY' | 'WARNING' | 'INFO';
    title: string;
    description: string;
    actionable: boolean;
    suggestedAction?: string;
}

export interface AIAnalyticsResponse {
    response: string;
    insights: AIInsight[];
    data: any;
}

export interface GeneratedProduct {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    features: string[];
    specifications: Record<string, string>;
    suggestedTags: string[];
    imageUrl?: string;
}

export interface ImprovedDescription {
    improvedDescription: string;
    suggestions: Array<{
        type: 'SEO' | 'CLARITY' | 'ENGAGEMENT';
        suggestion: string;
    }>;
}

export const adminAIService = {
    // ============ ANALYTICS COM IA ============
    async queryAnalytics(query: string, timeRange: string = '7d') {
        const { data } = await api.post<AIAnalyticsResponse>('/admin/ai/analytics', {
            query,
            context: { timeRange, includeData: true },
        });
        return data;
    },

    async getQuickInsights(
        type: 'low-stock' | 'sales-analysis' | 'profitable-products' | 'customer-insights'
    ) {
        const { data } = await api.get(`/admin/ai/quick-insights/${type}`);
        return data;
    },

    // ============ GERAÇÃO DE PRODUTOS ============
    async generateProduct(
        prompt: string,
        options?: {
            category?: string;
            priceRange?: { min: number; max: number };
            generateImage?: boolean;
        }
    ) {
        const { data } = await api.post<{ product: GeneratedProduct; confidence: number }>(
            '/admin/ai/generate-product',
            {
                prompt,
                ...options,
            }
        );
        return data.product;
    },

    async generateProductsBulk(
        count: number,
        options?: {
            category?: string;
            priceRange?: { min: number; max: number };
        }
    ) {
        const { data } = await api.post<{ products: GeneratedProduct[] }>(
            '/admin/ai/generate-products-bulk',
            {
                count,
                ...options,
            }
        );
        return data.products;
    },

    async createProductFromAI(prompt: string, options?: any) {
        const { data } = await api.post<Product>('/admin/ai/create-product-from-ai', {
            prompt,
            ...options,
        });
        return data;
    },

    // ============ MELHORIAS DE CONTEÚDO ============
    async improveDescription(
        productId: string,
        currentDescription: string,
        options?: {
            tone?: 'professional' | 'casual' | 'technical';
            focus?: 'features' | 'benefits' | 'specifications';
        }
    ) {
        const { data } = await api.post<ImprovedDescription>('/admin/ai/improve-description', {
            productId,
            currentDescription,
            ...options,
        });
        return data;
    },

    async generateProductImage(productName: string, description: string, style?: string) {
        const { data } = await api.post<{ imageUrl: string; thumbnailUrl: string }>(
            '/admin/ai/generate-product-image',
            {
                productName,
                description,
                style: style || 'realistic',
            }
        );
        return data;
    },

    // ============ OTIMIZAÇÃO ============
    async optimizePrice(
        productId: string,
        currentPrice: number,
        targetMargin: number,
        competitorPrices?: number[]
    ) {
        const { data } = await api.post('/admin/ai/optimize-price', {
            productId,
            currentPrice,
            targetMargin,
            competitorPrices,
        });
        return data;
    },

    // ============ EMAIL MARKETING ============
    async generateEmail(
        type: 'PROMOTION' | 'NEWSLETTER' | 'ABANDONED_CART' | 'WELCOME',
        context: {
            products?: string[];
            discount?: number;
            targetAudience?: string;
        },
        tone?: string
    ) {
        const { data } = await api.post('/admin/ai/generate-email', {
            type,
            context,
            tone: tone || 'professional',
        });
        return data;
    },
};
