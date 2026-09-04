import api from '@/lib/api';
import { Order, PaginatedResponse } from '@/types/api.types';

// total/subtotal/discount/shippingCost e o price de cada item chegam como
// string (Decimal do Prisma) — normaliza pra number na borda do serviço,
// mesmo padrão do products.service.ts. Cai em 0 (não NaN) se o campo vier
// ausente/null, pra nunca propagar NaN pra `formatPrice`/comparações de UI.
function toNumberOrZero(value: unknown): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
}

function normalizeOrder(raw: Order): Order {
    return {
        ...raw,
        total: toNumberOrZero(raw.total),
        subtotal: toNumberOrZero(raw.subtotal),
        discount: toNumberOrZero(raw.discount),
        shippingCost: toNumberOrZero(raw.shippingCost),
        orderItems: raw.orderItems.map((item) => ({ ...item, price: toNumberOrZero(item.price) })),
    };
}

// Contrato real de POST /orders (backend/src/modules/orders/dto/create-order.dto.ts):
// addressId de um endereço já existente do usuário, os itens e o frete.
// Método de pagamento não entra aqui — ele só importa na chamada seguinte,
// a /payments/checkout ou /payments/pix, feita depois que o pedido existe.
export interface CreateOrderData {
    items: { productId: string; quantity: number }[];
    addressId: string;
    shippingCost: number;
}

export const ordersService = {
    async createOrder(orderData: CreateOrderData) {
        const { data } = await api.post<Order>('/orders', orderData);
        return normalizeOrder(data);
    },

    async getOrders(page: number = 1, limit: number = 10) {
        const { data } = await api.get<PaginatedResponse<Order>>('/orders', { params: { page, limit } });
        return { data: data.data.map(normalizeOrder), meta: data.meta };
    },

    async getOrderById(id: string) {
        const { data } = await api.get<Order>(`/orders/${id}`);
        return normalizeOrder(data);
    },

    async cancelOrder(id: string) {
        const { data } = await api.patch<Order>(`/orders/${id}/cancel`);
        return normalizeOrder(data);
    },

    // Admin
    async getAllOrders(filters?: { status?: string; page?: number; limit?: number }) {
        const { data } = await api.get<PaginatedResponse<Order>>('/admin/orders', { params: filters });
        return { data: data.data.map(normalizeOrder), meta: data.meta };
    },

    async updateOrderStatus(id: string, status: Order['status']) {
        const { data } = await api.patch<Order>(`/admin/orders/${id}/status`, { status });
        return normalizeOrder(data);
    },
};
