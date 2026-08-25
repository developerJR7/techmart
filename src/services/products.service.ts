import api from '@/lib/api';
import { Product, PaginatedResponse, CreateProductDto } from '@/types/api.types';

export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
    featured?: boolean;
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
}

export const productsService = {
    async getProducts(filters: ProductFilters = {}) {
        const { data } = await api.get<PaginatedResponse<Product>>('/products', { params: filters });
        // Backend returns { data: [...], meta: ... }
        // The component expects { data: Product[], meta: ... } structure now
        return {
            data: data.data,
            meta: data.meta
        };
    },

    async getProductBySlug(slug: string) {
        const { data } = await api.get<Product>(`/products/slug/${slug}`);
        return data;
    },

    async getProductById(id: string) {
        const { data } = await api.get<Product>(`/products/id/${id}`);
        return data;
    },

    async getRelatedProducts(productId: string) {
        const { data } = await api.get<Product[]>(`/products/${productId}/related`);
        return data;
    },

    async getFeaturedProducts() {
        const { data } = await api.get<Product[]>('/products/featured');
        return data;
    },

    // Admin
    async createProduct(productData: CreateProductDto) {
        const { data } = await api.post<Product>('/admin/products', productData);
        return data;
    },

    async updateProduct(id: string, updates: Partial<Product>) {
        const { data } = await api.patch<Product>(`/admin/products/${id}`, updates);
        return data;
    },

    async deleteProduct(id: string) {
        await api.delete(`/admin/products/${id}`);
    },

    async uploadProductImage(productId: string, file: File) {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await api.post<{ url: string }>(`/admin/products/${productId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },
};
