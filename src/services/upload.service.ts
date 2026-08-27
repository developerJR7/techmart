import api from '@/lib/api';

export const uploadService = {
    // Upload de avatar de usuário
    async uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await api.post<{ url: string }>('/upload/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data.url;
    },

    // Upload de imagem de produto
    async uploadProductImage(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await api.post<{ url: string }>('/upload/product', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data.url;
    },

    // Upload múltiplo de imagens
    async uploadMultipleImages(files: File[], type: 'avatar' | 'product' = 'product') {
        const uploadPromises = files.map((file) => {
            if (type === 'avatar') {
                return this.uploadAvatar(file);
            }
            return this.uploadProductImage(file);
        });

        return Promise.all(uploadPromises);
    },
};
