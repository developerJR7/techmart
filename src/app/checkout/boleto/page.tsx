"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function BoletoPaymentPage() {
    const { getTotal } = useCartStore();
    const [boletoUrl, setBoletoUrl] = useState("");
    const [boletoCode, setBoletoCode] = useState("");
    const [loading, setLoading] = useState(true);

    const total = getTotal();
    const shipping = total > 200 ? 0 : 15;
    const finalTotal = total + shipping;

    useEffect(() => {
        createBoletoPayment();
    }, []);

    const createBoletoPayment = async () => {
        try {
            // Simulating Boleto creation
            const mockBoletoCode = "23793.38128 60000.000001 00000.000000 1 99990000" + Math.floor(finalTotal * 100);
            const mockBoletoUrl = "#"; // In production, this would be the actual boleto PDF URL

            setBoletoCode(mockBoletoCode);
            setBoletoUrl(mockBoletoUrl);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao criar boleto:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '40px 20px', textAlign: 'center' }}>
                <p>Gerando boleto...</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#eaeded', padding: '20px 0' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}>
                <Link href="/checkout" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#007185', textDecoration: 'none', marginBottom: '20px' }}>
                    <ArrowLeft size={20} />
                    Voltar
                </Link>

                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '10px', textAlign: 'center' }}>Boleto Bancário</h1>
                    <p style={{ fontSize: '16px', color: '#565959', marginBottom: '30px', textAlign: 'center' }}>
                        Total: <strong style={{ fontSize: '24px', color: '#B12704' }}>R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                    </p>

                    {/* Success Message */}
                    <div style={{ backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#155724', marginBottom: '10px' }}>✓ Boleto gerado com sucesso!</h3>
                        <p style={{ fontSize: '14px', color: '#155724' }}>
                            Seu boleto foi gerado. Você pode imprimir ou salvar o PDF para pagar em qualquer banco ou casa lotérica.
                        </p>
                    </div>

                    {/* Boleto Code */}
                    <div style={{ marginBottom: '30px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Código de barras:</p>
                        <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px', border: '1px solid #ddd' }}>
                            <p style={{ fontSize: '16px', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '2px' }}>
                                {boletoCode}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                        <button
                            onClick={() => window.print()}
                            style={{
                                padding: '15px',
                                backgroundColor: '#0066c0',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <Printer size={20} />
                            Imprimir Boleto
                        </button>
                        <button
                            onClick={() => alert('Download iniciado')}
                            style={{
                                padding: '15px',
                                backgroundColor: '#16a34a',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <Download size={20} />
                            Baixar PDF
                        </button>
                    </div>

                    {/* Instructions */}
                    <div style={{ backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>Como pagar:</h3>
                        <ol style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                            <li>Imprima o boleto ou salve o PDF</li>
                            <li>Pague em qualquer banco, casa lotérica ou app bancário</li>
                            <li>O pagamento pode levar até 3 dias úteis para ser confirmado</li>
                            <li>Após a confirmação, você receberá um e-mail</li>
                        </ol>
                    </div>

                    {/* Warning */}
                    <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
                        <p style={{ fontSize: '13px', color: '#856404' }}>
                            ⏱️ <strong>Vencimento:</strong> {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                            <br />
                            Após o vencimento, o boleto não poderá mais ser pago.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
