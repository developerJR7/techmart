"use client";

import { useState } from 'react';
import { Sparkles, Send, TrendingUp, Package, DollarSign, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AdminAIAssistantProps {
    analyticsData?: any;
}

export function AdminAIAssistant({ analyticsData }: AdminAIAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: '👋 Olá! Sou seu assistente de negócios com IA. Posso ajudá-lo a analisar métricas, identificar oportunidades e otimizar seu e-commerce. Como posso ajudar hoje?',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const quickQueries = [
        { icon: Package, label: 'Estoque baixo', query: 'Quais produtos estão com estoque baixo?' },
        { icon: TrendingUp, label: 'Análise de vendas', query: 'Analise as vendas do último mês' },
        { icon: DollarSign, label: 'Produtos lucrativos', query: 'Quais são os produtos mais lucrativos?' },
        { icon: Users, label: 'Insights de clientes', query: 'Qual o perfil dos meus melhores clientes?' },
    ];

    const handleSend = async (queryText?: string) => {
        const messageText = queryText || input;
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: messageText,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/admin-assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageText,
                    analyticsData,
                }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response || 'Desculpe, não consegui processar sua consulta.',
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Erro:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Desculpe, ocorreu um erro ao processar sua consulta. Tente novamente.',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div
            style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #7F5AF0 0%, #5a3fb8 100%)',
                    color: '#fff',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}
            >
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Sparkles size={24} />
                </div>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                        Assistente de Negócios com IA
                    </h3>
                    <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>
                        Análises, insights e recomendações estratégicas
                    </p>
                </div>
            </div>

            {/* Quick Queries */}
            <div
                style={{
                    padding: '16px',
                    borderBottom: '1px solid #e5e5e5',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '8px',
                }}
            >
                {quickQueries.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSend(item.query)}
                        disabled={isLoading}
                        style={{
                            padding: '10px 12px',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s',
                            opacity: isLoading ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading) {
                                e.currentTarget.style.backgroundColor = '#7F5AF0';
                                e.currentTarget.style.color = '#fff';
                                e.currentTarget.style.borderColor = '#7F5AF0';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                            e.currentTarget.style.color = '#333';
                            e.currentTarget.style.borderColor = '#e0e0e0';
                        }}
                    >
                        <item.icon size={14} />
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div
                style={{
                    height: '400px',
                    overflowY: 'auto',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        }}
                    >
                        <div
                            style={{
                                maxWidth: '85%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                backgroundColor: msg.role === 'user' ? '#7F5AF0' : '#f5f5f5',
                                color: msg.role === 'user' ? '#fff' : '#333',
                                fontSize: '14px',
                                lineHeight: '1.6',
                            }}
                        >
                            {msg.role === 'assistant' ? (
                                <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <div
                            style={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                backgroundColor: '#f5f5f5',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <div
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#7F5AF0',
                                    animation: 'pulse 1.5s ease-in-out infinite',
                                }}
                            />
                            <div
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#7F5AF0',
                                    animation: 'pulse 1.5s ease-in-out 0.2s infinite',
                                }}
                            />
                            <div
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#7F5AF0',
                                    animation: 'pulse 1.5s ease-in-out 0.4s infinite',
                                }}
                            />
                            <span style={{ marginLeft: '4px', color: '#666' }}>Analisando...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div
                style={{
                    padding: '16px',
                    borderTop: '1px solid #e5e5e5',
                    backgroundColor: '#fafafa',
                }}
            >
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Faça uma pergunta sobre seu negócio..."
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            backgroundColor: '#fff',
                        }}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={isLoading || !input.trim()}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#7F5AF0',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                            opacity: isLoading || !input.trim() ? 0.5 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: 'all 0.2s',
                        }}
                    >
                        <Send size={16} />
                        Enviar
                    </button>
                </div>
            </div>

            <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
        </div>
    );
}
