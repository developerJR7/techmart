"use client";

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, TrendingUp, Package, DollarSign, Users, X, Minimize2, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '@/lib/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AdminAIAssistantProps {
    analyticsData?: any;
}

export function AdminAIAssistant({ analyticsData }: AdminAIAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: '👋 Olá! Sou seu assistente de negócios com IA. Posso ajudá-lo a analisar métricas, identificar oportunidades e otimizar seu e-commerce. Como posso ajudar hoje?',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isMinimized]);

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
            const response = await api.post('/chatbot/conversations', {
                message: messageText,
                context: 'admin',
                data: analyticsData
            });

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.data.response || response.data.message || 'Desculpe, não consegui processar sua consulta.',
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

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: '#7F5AF0',
                    color: '#fff',
                    padding: '16px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 4px 12px rgba(127, 90, 240, 0.4)',
                    zIndex: 1000,
                    transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(127, 90, 240, 0.5)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(127, 90, 240, 0.4)';
                }}
            >
                <Sparkles size={24} />
                Assistente Admin IA
            </button>
        );
    }

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '400px',
                maxWidth: 'calc(100vw - 40px)',
                height: isMinimized ? 'auto' : '600px',
                maxHeight: 'calc(100vh - 40px)',
                backgroundColor: '#111',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1000,
                overflow: 'hidden',
                border: '1px solid #333',
            }}
        >
            {/* Header */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #7F5AF0 0%, #5a3fb8 100%)',
                    color: '#fff',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>
                            Assistente Admin
                        </h3>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            padding: '4px',
                        }}
                    >
                        <Minimize2 size={20} />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            padding: '4px',
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Quick Queries */}
                    <div
                        style={{
                            padding: '16px',
                            borderBottom: '1px solid #333',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '8px',
                            backgroundColor: '#1a1a1a',
                        }}
                    >
                        {quickQueries.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(item.query)}
                                disabled={isLoading}
                                style={{
                                    padding: '8px 10px',
                                    backgroundColor: '#222',
                                    border: '1px solid #333',
                                    borderRadius: '6px',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    fontSize: '11px',
                                    fontWeight: '500',
                                    color: '#ccc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s',
                                    opacity: isLoading ? 0.5 : 1,
                                    textAlign: 'left',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isLoading) {
                                        e.currentTarget.style.backgroundColor = '#7F5AF0';
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.borderColor = '#7F5AF0';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#222';
                                    e.currentTarget.style.color = '#ccc';
                                    e.currentTarget.style.borderColor = '#333';
                                }}
                            >
                                <item.icon size={12} />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            backgroundColor: '#111',
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
                                        backgroundColor: msg.role === 'user' ? '#7F5AF0' : '#222',
                                        color: msg.role === 'user' ? '#fff' : '#e5e5e5',
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                        border: msg.role === 'assistant' ? '1px solid #333' : 'none',
                                    }}
                                >
                                    {msg.role === 'assistant' ? (
                                        <div className="prose prose-invert prose-sm max-w-none">
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
                                        backgroundColor: '#222',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        border: '1px solid #333',
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
                                    <span style={{ marginLeft: '4px', color: '#888' }}>Analisando...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div
                        style={{
                            padding: '16px',
                            borderTop: '1px solid #333',
                            backgroundColor: '#1a1a1a',
                        }}
                    >
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Pergunte sobre seus dados..."
                                disabled={isLoading}
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    backgroundColor: '#222',
                                    color: '#fff',
                                }}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={isLoading || !input.trim()}
                                style={{
                                    padding: '12px',
                                    backgroundColor: '#7F5AF0',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                                    opacity: isLoading || !input.trim() ? 0.5 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <Send size={18} />
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
                </>
            )}
        </div>
    );
}
