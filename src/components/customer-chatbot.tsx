"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Phone, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export function CustomerChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Olá, como posso ajudar? 😊',
            timestamp: new Date(),
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
    }, [messages]);

    const handleQuickAction = async (action: string, label: string) => {
        // Adicionar mensagem do usuário
        const userMessage: Message = {
            role: 'user',
            content: label,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/customer-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quickAction: action }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response || data.fallback || 'Desculpe, não consegui processar sua solicitação.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Erro:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Desculpe, ocorreu um erro. Tente novamente.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/customer-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response || data.fallback || 'Desculpe, não consegui processar sua mensagem.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Erro:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Desculpe, ocorreu um erro. Tente novamente.',
                timestamp: new Date(),
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
                <MessageCircle size={24} />
                Faça uma pergunta
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
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1000,
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <div
                style={{
                    backgroundColor: '#2D2D2D',
                    color: '#fff',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
                    Faça uma pergunta
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
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
                    {/* Intro Message */}
                    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderBottom: '1px solid #e5e5e5' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                            Olá! Para dúvidas sobre serviços da TechMart e outros tópicos relacionados a vendas,
                            entre em contato com um representante abaixo. Para dúvidas sobre faturamento,
                            conta e suporte técnico, abra um chamado.
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div style={{ padding: '16px', borderBottom: '1px solid #e5e5e5' }}>
                        <button
                            onClick={() => handleQuickAction('CONTACT_REPRESENTATIVE', 'Conversar com um representante')}
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginBottom: '8px',
                                backgroundColor: '#fff',
                                border: '2px solid #7F5AF0',
                                borderRadius: '6px',
                                color: '#7F5AF0',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            Conversar com um representante da TechMart
                        </button>
                        <button
                            onClick={() => handleQuickAction('SCHEDULE_CALL', 'Agendar chamada com um representante')}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#fff',
                                border: '2px solid #7F5AF0',
                                borderRadius: '6px',
                                color: '#7F5AF0',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                        >
                            <Phone size={16} />
                            Agendar chamada com um representante
                        </button>
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
                        }}
                    >
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'flex-start',
                                }}
                            >
                                {msg.role === 'assistant' && (
                                    <div
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: '#7F5AF0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <MessageCircle size={18} color="#fff" />
                                    </div>
                                )}
                                <div
                                    style={{
                                        flex: 1,
                                        backgroundColor: msg.role === 'user' ? '#7F5AF0' : '#f5f5f5',
                                        color: msg.role === 'user' ? '#fff' : '#333',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        lineHeight: '1.5',
                                        marginLeft: msg.role === 'user' ? 'auto' : '0',
                                        maxWidth: '85%',
                                    }}
                                >
                                    {msg.role === 'assistant' ? (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: '#7F5AF0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <MessageCircle size={18} color="#fff" />
                                </div>
                                <div
                                    style={{
                                        backgroundColor: '#f5f5f5',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                >
                                    Digitando...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div
                        style={{
                            padding: '16px',
                            borderTop: '1px solid #e5e5e5',
                            backgroundColor: '#fff',
                        }}
                    >
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Digite sua mensagem..."
                                disabled={isLoading}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                style={{
                                    padding: '12px 20px',
                                    backgroundColor: '#7F5AF0',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                                    opacity: isLoading || !input.trim() ? 0.5 : 1,
                                }}
                            >
                                <Send size={18} />
                            </button>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}
