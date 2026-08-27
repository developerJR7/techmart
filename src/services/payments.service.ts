import api from '@/lib/api';
import { Order } from '@/types/api.types';

export interface CreatePixPaymentData {
    orderId: string;
    amount: number;
}

export interface PixPaymentResponse {
    pixCode: string;
    pixQrCode: string;
    expiresAt: string;
}

export interface PaymentStatusResponse {
    status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';
    paidAt?: string;
}

export const paymentsService = {
    // Criar checkout Stripe
    async createStripeCheckout(orderId: string) {
        const { data } = await api.post<{ url: string }>(`/payments/checkout/${orderId}`);
        return data;
    },

    // Criar pagamento PIX
    async createPixPayment(orderId: string, amount: number) {
        const { data } = await api.post<PixPaymentResponse>('/payments/pix', {
            orderId,
            amount,
        });
        return data;
    },

    // Verificar status do pagamento
    async getPaymentStatus(orderId: string) {
        const { data } = await api.get<PaymentStatusResponse>(`/payments/${orderId}/status`);
        return data;
    },

    // Webhook (não usado diretamente no frontend, mas documentado)
    // POST /webhooks/payment - Recebe notificações de pagamento
};
