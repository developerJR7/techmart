import { NextRequest, NextResponse } from 'next/server';
import { sendCustomerMessage } from '@/lib/gemini';
import { CUSTOMER_CONTEXT, getQuickActionResponse, QUICK_ACTIONS } from '@/lib/ai/customer-context';

// Rate limiting simples (em produção, use Redis ou similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const limit = 20; // 20 requisições
    const window = 60000; // por minuto

    const record = requestCounts.get(ip);

    if (!record || now > record.resetTime) {
        requestCounts.set(ip, { count: 1, resetTime: now + window });
        return true;
    }

    if (record.count >= limit) {
        return false;
    }

    record.count++;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: 'Muitas requisições. Aguarde um momento.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { message, quickAction } = body;

        if (!message && !quickAction) {
            return NextResponse.json(
                { error: 'Mensagem ou ação rápida é obrigatória' },
                { status: 400 }
            );
        }

        // Se for uma ação rápida, retornar resposta predefinida
        if (quickAction && quickAction in QUICK_ACTIONS) {
            const response = getQuickActionResponse(quickAction as keyof typeof QUICK_ACTIONS);
            return NextResponse.json({ response });
        }

        // Processar mensagem com IA
        const response = await sendCustomerMessage(message, CUSTOMER_CONTEXT);

        return NextResponse.json({ response });

    } catch (error) {
        console.error('Erro no chat de clientes:', error);
        return NextResponse.json(
            {
                error: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
                fallback: 'Olá! Estou aqui para ajudar. Como posso auxiliá-lo hoje? 😊'
            },
            { status: 500 }
        );
    }
}
