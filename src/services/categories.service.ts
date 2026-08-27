import api from '@/lib/api';

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive?: boolean;
    // Presente em GET /categories e GET /categories/:id (categories.service.ts
    // no backend inclui `_count`); ausente nas respostas de criar/atualizar.
    _count?: { products: number };
}

export const categoriesService = {
    // Listar todas as categorias
    async getCategories() {
        const { data } = await api.get<Category[]>('/categories');
        return data;
    },

    // Criar categoria (Admin)
    async createCategory(categoryData: { name: string; slug?: string; image?: string }) {
        const { data } = await api.post<Category>('/admin/categories', categoryData);
        return data;
    },

    // Atualizar categoria (Admin)
    async updateCategory(id: string, categoryData: Partial<Category>) {
        const { data } = await api.patch<Category>(`/admin/categories/${id}`, categoryData);
        return data;
    },

    // Deletar categoria (Admin)
    async deleteCategory(id: string) {
        await api.delete(`/admin/categories/${id}`);
    },
};
