"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function CreditCardPaymentPage() {
    const router = useRouter();
    const { getTotal, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: '',
        installments: '1'
    });

    const total = getTotal();
    const shipping = total > 200 ? 0 : 15;
    const finalTotal = total + shipping;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Clear cart and redirect to success
            clearCart();
            router.push('/success');
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            alert('Erro ao processar pagamento');
        } finally {
            setLoading(false);
        }
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.slice(0, 2) + '/' + v.slice(2, 4);
        }
        return v;
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#eaeded', padding: '20px 0' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
                <Link href="/checkout" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#007185', textDecoration: 'none', marginBottom: '20px' }}>
                    <ArrowLeft size={20} />
                    Voltar
                </Link>

                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '10px' }}>Pagamento com Cartão</h1>
                    <p style={{ fontSize: '16px', color: '#565959', marginBottom: '30px' }}>
                        Total: <strong style={{ fontSize: '24px', color: '#B12704' }}>R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Card Number */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                                Número do cartão
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={cardData.number}
                                    onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 40px 12px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <CreditCard size={20} style={{ position: 'absolute', right: '12px', top: '12px', color: '#999' }} />
                            </div>
                        </div>

                        {/* Cardholder Name */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                                Nome no cartão
                            </label>
                            <input
                                type="text"
                                value={cardData.name}
                                onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                                placeholder="NOME COMO ESTÁ NO CARTÃO"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Expiry and CVV */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                                    Validade
                                </label>
                                <input
                                    type="text"
                                    value={cardData.expiry}
                                    onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                                    placeholder="MM/AA"
                                    maxLength={5}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                                    CVV
                                </label>
                                <input
                                    type="text"
                                    value={cardData.cvv}
                                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                                    placeholder="123"
                                    maxLength={4}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Installments */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                                Parcelas
                            </label>
                            <select
                                value={cardData.installments}
                                onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <option value="1">1x de R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                                <option value="2">2x de R$ {(finalTotal / 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                                <option value="3">3x de R$ {(finalTotal / 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                                <option value="6">6x de R$ {(finalTotal / 6).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                                <option value="12">12x de R$ {(finalTotal / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</option>
                            </select>
                        </div>

                        {/* Security Notice */}
                        <div style={{ backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Lock size={20} color="#0066c0" />
                            <p style={{ fontSize: '13px', color: '#0066c0' }}>
                                Seus dados estão protegidos com criptografia SSL de 256 bits
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                backgroundColor: loading ? '#ddd' : '#ffd814',
                                border: loading ? '1px solid #ccc' : '1px solid #fcd200',
                                borderRadius: '8px',
                                padding: '15px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}
                        >
                            {loading ? 'Processando pagamento...' : 'Finalizar compra'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
