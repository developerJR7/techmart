"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";

export default function PixPaymentPage() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const [pixCode, setPixCode] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    const total = getTotal();
    const shipping = total > 200 ? 0 : 15;
    const finalTotal = total + shipping;

    useEffect(() => {
        createPixPayment();
    }, []);

    const createPixPayment = async () => {
        try {
            // Simulating PIX payment creation
            // In production, this would call your backend API
            const mockPixCode = "00020126580014br.gov.bcb.pix0136" + Math.random().toString(36).substring(2, 15);
            const mockQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(mockPixCode)}`;

            setPixCode(mockPixCode);
            setQrCodeUrl(mockQrCode);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao criar pagamento PIX:', error);
            setLoading(false);
        }
    };

    const copyPixCode = () => {
        navigator.clipboard.writeText(pixCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '40px 20px', textAlign: 'center' }}>
                <p>Gerando código PIX...</p>
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

                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '10px' }}>Pagamento via PIX</h1>
                    <p style={{ fontSize: '16px', color: '#565959', marginBottom: '30px' }}>
                        Total: <strong style={{ fontSize: '24px', color: '#B12704' }}>R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                    </p>

                    {/* QR Code */}
                    <div style={{ marginBottom: '30px' }}>
                        {qrCodeUrl && (
                            <Image
                                src={qrCodeUrl}
                                alt="QR Code PIX"
                                width={300}
                                height={300}
                                style={{ margin: '0 auto', border: '2px solid #ddd', borderRadius: '8px' }}
                            />
                        )}
                    </div>

                    {/* Instructions */}
                    <div style={{ backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>Como pagar:</h3>
                        <ol style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                            <li>Abra o app do seu banco</li>
                            <li>Escolha pagar com PIX</li>
                            <li>Escaneie o QR Code ou copie o código abaixo</li>
                            <li>Confirme o pagamento</li>
                        </ol>
                    </div>

                    {/* PIX Code */}
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Ou copie o código PIX:</p>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={pixCode}
                                readOnly
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    backgroundColor: '#f5f5f5'
                                }}
                            />
                            <button
                                onClick={copyPixCode}
                                style={{
                                    padding: '12px 20px',
                                    backgroundColor: copied ? '#16a34a' : '#0066c0',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                {copied ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar</>}
                            </button>
                        </div>
                    </div>

                    {/* Warning */}
                    <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
                        <p style={{ fontSize: '13px', color: '#856404' }}>
                            ⏱️ Este código PIX expira em <strong>30 minutos</strong>. Após o pagamento, seu pedido será confirmado automaticamente.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
