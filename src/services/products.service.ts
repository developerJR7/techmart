import api from '@/lib/api';
import { Product, PaginatedResponse, CreateProductDto } from '@/types/api.types';

export type ProductSort = 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'rating_desc';

export interface ProductFilters {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
    search?: string;
    sort?: ProductSort;
    page?: number;
    limit?: number;
    featured?: boolean;
}

// Query keys do React Query pro domínio de produtos — mantidos junto do
// serviço porque espelham exatamente os parâmetros que ele recebe.
export const productKeys = {
    all: ['products'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
    detail: (slug: string) => [...productKeys.all, 'detail', slug] as const,
};

// price/averageRating chegam como string (Decimal do Prisma serializado via
// JSON) — normaliza pra number aqui, na borda de serviço, pra o resto do app
// poder confiar em Product.price/averageRating como number de verdade.
// averageRating vira null se vier ausente/inválido (nunca NaN): um `rating`
// não-null é o sinal que o ProductCard usa pra decidir se desenha estrelas.
function normalizeProduct(raw: Product): Product {
    const rating = Number(raw.averageRating);
    return {
        ...raw,
        price: Number(raw.price),
        averageRating: raw.averageRating != null && Number.isFinite(rating) ? rating : null,
    };
}

export const productsService = {
    async getProducts(filters: ProductFilters = {}, signal?: AbortSignal) {
        const { data } = await api.get<PaginatedResponse<Product>>('/products', { params: filters, signal });
        return {
            data: data.data.map(normalizeProduct),
            meta: data.meta,
        };
    },

    async getProductBySlug(slug: string, signal?: AbortSignal) {
        const { data } = await api.get<Product>(`/products/slug/${slug}`, { signal });
        return normalizeProduct(data);
    },

    async getProductById(id: string) {
        const { data } = await api.get<Product>(`/products/${id}`);
        return normalizeProduct(data);
    },

    async getRelatedProducts(productId: string) {
        const { data } = await api.get<Product[]>(`/products/${productId}/related`);
        return data.map(normalizeProduct);
    },

    async getFeaturedProducts() {
        const { data } = await api.get<Product[]>('/products/featured');
        return data.map(normalizeProduct);
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
