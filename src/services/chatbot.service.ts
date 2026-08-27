import api from '@/lib/api';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}

export interface ChatConversation {
    conversationId: string;
    response: string;
    suggestions?: string[];
}

export interface QuickActionData {
    action: 'TRACK_ORDER' | 'CONTACT_REPRESENTATIVE' | 'SCHEDULE_CALL' | 'VIEW_PRODUCTS';
    data?: {
        orderId?: string;
        productQuery?: string;
        preferredTime?: string;
    };
}

export const chatbotService = {
    // Iniciar ou continuar conversa
    async sendMessage(message: string, conversationId?: string) {
        let currentConversationId = conversationId;

        // Se não tiver ID, cria uma nova conversa
        if (!currentConversationId) {
            const { data: conversation } = await api.post('/chatbot/conversations');
            currentConversationId = conversation.id;
        }

        // Envia a mensagem
        const { data } = await api.post(`/chatbot/conversations/${currentConversationId}/messages`, {
            message,
        });

        // Retorna no formato que o componente espera
        return {
            response: data.message.content,
            conversationId: currentConversationId,
            actions: data.actions
        };
    },

    // Obter histórico de conversa
    async getConversationHistory(conversationId: string) {
        const { data } = await api.get(`/chatbot/conversations/${conversationId}`);
        return data;
    },

    // Executar ação rápida
    async executeQuickAction(actionData: QuickActionData) {
        const { data } = await api.post('/chatbot/quick-actions', actionData);
        return data;
    },

    // Listar conversas do usuário
    async getConversations() {
        const { data } = await api.get('/chatbot/conversations');
        return data;
    },

    // Deletar conversa
    async deleteConversation(conversationId: string) {
        await api.delete(`/chatbot/conversations/${conversationId}`);
    },

    // Enviar feedback
    async sendFeedback(conversationId: string, rating: number, comment?: string) {
        const { data } = await api.post('/chatbot/feedback', {
            conversationId,
            rating,
            comment,
        });
        return data;
    },
};
