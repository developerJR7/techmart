import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar o cliente Gemini
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

if (!apiKey) {
    console.warn('⚠️ NEXT_PUBLIC_GEMINI_API_KEY não configurada');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Modelo para chatbot de clientes (rápido e eficiente)
export const customerChatModel = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
    },
});

// Modelo para assistente admin (mais analítico)
export const adminAssistantModel = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        topK: 20,
        maxOutputTokens: 2048,
    },
});

// Função helper para chat de clientes
export async function sendCustomerMessage(
    message: string,
    context?: string
): Promise<string> {
    try {
        const prompt = context
            ? `${context}\n\nCliente: ${message}\n\nAssistente:`
            : message;

        const result = await customerChatModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        throw new Error('Não foi possível processar sua mensagem. Tente novamente.');
    }
}

// Função helper para assistente admin
export async function sendAdminQuery(
    query: string,
    analyticsData?: any
): Promise<string> {
    try {
        const dataContext = analyticsData
            ? `\n\nDados disponíveis:\n${JSON.stringify(analyticsData, null, 2)}`
            : '';

        const prompt = `Você é um assistente de negócios especializado em e-commerce. Analise os dados e forneça insights estratégicos.${dataContext}\n\nPergunta do admin: ${query}\n\nResposta:`;

        const result = await adminAssistantModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Erro ao processar consulta admin:', error);
        throw new Error('Não foi possível processar sua consulta. Tente novamente.');
    }
}

// Verificar se a API está configurada
export function isGeminiConfigured(): boolean {
    return !!apiKey;
}
