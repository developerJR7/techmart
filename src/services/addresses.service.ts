import api from '@/lib/api';

export interface Address {
    id: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
}

export interface CreateAddressDto {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}

export const addressesService = {
    async create(data: CreateAddressDto) {
        const response = await api.post<Address>('/addresses', data);
        return response.data;
    },

    async findAll() {
        const response = await api.get<Address[]>('/addresses');
        return response.data;
    },

    async update(id: string, data: Partial<CreateAddressDto>) {
        const response = await api.patch<Address>(`/addresses/${id}`, data);
        return response.data;
    },

    async remove(id: string) {
        await api.delete(`/addresses/${id}`);
    },

    async setDefault(addressId: string) {
        await api.post('/addresses/set-default', { addressId });
    }
};
