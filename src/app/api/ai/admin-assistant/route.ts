import { NextRequest, NextResponse } from 'next/server';
import { sendAdminQuery } from '@/lib/gemini';
import { ADMIN_CONTEXT, formatAnalyticsForAI, type AnalyticsData } from '@/lib/ai/admin-context';

export async function POST(request: NextRequest) {
    try {
        // Em produção, adicionar autenticação admin aqui
        // const token = request.headers.get('authorization');
        // if (!isAdminAuthenticated(token)) {
        //   return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        // }

        const body = await request.json();
        const { message, analyticsData } = body;

        if (!message) {
            return NextResponse.json(
                { error: 'Mensagem é obrigatória' },
                { status: 400 }
            );
        }

        // Formatar dados de analytics se fornecidos
        let context = ADMIN_CONTEXT;
        if (analyticsData) {
            const formattedData = formatAnalyticsForAI(analyticsData as AnalyticsData);
            context = `${ADMIN_CONTEXT}\n\n${formattedData}`;
        }

        // Processar consulta com IA
        const response = await sendAdminQuery(message, context);

        return NextResponse.json({ response });

    } catch (error) {
        console.error('Erro no assistente admin:', error);
        return NextResponse.json(
            {
                error: 'Não foi possível processar sua consulta. Tente novamente.',
            },
            { status: 500 }
        );
    }
}
