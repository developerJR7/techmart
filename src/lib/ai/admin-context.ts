// Contexto para o assistente de negócios admin

export const ADMIN_CONTEXT = `
Você é um assistente de negócios especializado em e-commerce, focado em análise de dados e insights estratégicos.

SEU PAPEL:
- Analisar métricas de vendas, estoque e clientes
- Identificar tendências e padrões
- Fornecer recomendações estratégicas
- Alertar sobre problemas (estoque baixo, produtos parados)
- Sugerir oportunidades de crescimento

ÁREAS DE EXPERTISE:
1. GESTÃO DE ESTOQUE
   - Identificar produtos com estoque baixo
   - Sugerir reposições baseadas em demanda
   - Detectar produtos parados (sem vendas)
   - Otimizar níveis de estoque

2. ANÁLISE DE VENDAS
   - Identificar produtos mais lucrativos
   - Analisar tendências de vendas
   - Calcular métricas (ticket médio, conversão)
   - Comparar períodos

3. INSIGHTS DE CLIENTES
   - Segmentação de clientes
   - Padrões de comportamento
   - Taxa de recompra
   - Produtos favoritos por segmento

4. ESTRATÉGIAS DE CRESCIMENTO
   - Sugestões de novos produtos
   - Otimização de preços
   - Melhores horários para promoções
   - Categorias promissoras

5. TENDÊNCIAS DE MERCADO
   - Produtos em alta
   - Sazonalidade
   - Comportamento do consumidor
   - Oportunidades emergentes

TOM DE VOZ:
- Profissional e direto
- Baseado em dados
- Proativo com sugestões
- Use números e métricas
- Formate respostas com bullet points

FORMATO DE RESPOSTA:
1. Resumo executivo (1-2 linhas)
2. Análise detalhada com dados
3. Insights principais (3-5 pontos)
4. Recomendações acionáveis
5. Próximos passos sugeridos

QUANDO ANALISAR DADOS:
- Sempre cite números específicos
- Compare com períodos anteriores quando possível
- Identifique tendências (crescimento/queda)
- Destaque outliers (muito bom ou muito ruim)
- Seja específico nas recomendações
`;

export interface AnalyticsData {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    salesByMonth?: Array<{ month: string; revenue: number; orders: number }>;
    topProducts?: Array<{ name: string; sold: number; revenue: number }>;
    lowStock?: Array<{ name: string; stock: number }>;
    stagnantProducts?: Array<{ name: string; lastSale: string }>;
}

export function formatAnalyticsForAI(data: AnalyticsData): string {
    return `
MÉTRICAS ATUAIS:
- Receita Total: R$ ${data.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Total de Pedidos: ${data.totalOrders}
- Produtos Ativos: ${data.totalProducts}
- Total de Clientes: ${data.totalCustomers}
- Ticket Médio: R$ ${(data.totalRevenue / data.totalOrders).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

${data.topProducts ? `
TOP PRODUTOS:
${data.topProducts.map((p, i) => `${i + 1}. ${p.name} - ${p.sold} vendas - R$ ${p.revenue.toLocaleString('pt-BR')}`).join('\n')}
` : ''}

${data.salesByMonth ? `
VENDAS POR MÊS (últimos 3 meses):
${data.salesByMonth.slice(-3).map(m => `${m.month}: R$ ${m.revenue.toLocaleString('pt-BR')} (${m.orders} pedidos)`).join('\n')}
` : ''}

${data.lowStock ? `
ALERTA - ESTOQUE BAIXO:
${data.lowStock.map(p => `- ${p.name}: ${p.stock} unidades`).join('\n')}
` : ''}

${data.stagnantProducts ? `
PRODUTOS SEM VENDAS RECENTES:
${data.stagnantProducts.map(p => `- ${p.name} (última venda: ${p.lastSale})`).join('\n')}
` : ''}
`.trim();
}

export const COMMON_ADMIN_QUERIES = {
    LOW_STOCK: 'Quais produtos estão com estoque baixo e precisam de reposição urgente?',
    SALES_ANALYSIS: 'Analise as vendas do último mês e identifique tendências.',
    TOP_PERFORMERS: 'Quais são os produtos mais lucrativos e por quê?',
    GROWTH_OPPORTUNITIES: 'Quais oportunidades de crescimento você identifica?',
    PRICING_OPTIMIZATION: 'Como posso otimizar os preços para aumentar a margem?',
    CUSTOMER_INSIGHTS: 'Qual o perfil dos meus melhores clientes?',
    MARKET_TRENDS: 'Quais são as tendências atuais no mercado de e-commerce?',
};
