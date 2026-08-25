"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, Check, MapPin } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import { ordersService } from "@/services/orders.service";
import { paymentsService } from "@/services/payments.service";
import { useToast } from "@/hooks/use-toast";

export default function PixPaymentPage() {
    const router = useRouter();
    const { items, getTotal, clearCart, couponCode } = useCartStore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [orderCreated, setOrderCreated] = useState(false);
    const [orderId, setOrderId] = useState("");

    const [pixCode, setPixCode] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [copied, setCopied] = useState(false);

    const [address, setAddress] = useState({
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        complement: ''
    });

    const total = getTotal();
    const shipping = total > 200 ? 0 : 15;
    const finalTotal = total + shipping;

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Criar pedido
            const order = await ordersService.createOrder({
                items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
                shippingAddress: address,
                paymentMethod: 'PIX',
                couponCode: couponCode || undefined
            });

            setOrderId(order.id);

            // 2. Criar pagamento PIX
            const pixPayment = await paymentsService.createPixPayment(order.id, finalTotal);

            setPixCode(pixPayment.pixCode);
            setQrCodeUrl(pixPayment.pixQrCode);
            setOrderCreated(true);
            clearCart();

            toast({
                title: "Pedido criado!",
                description: "Realize o pagamento via PIX para confirmar.",
                style: { backgroundColor: '#7F5AF0', color: 'white', border: 'none' }
            });

            // 3. Iniciar polling para verificar pagamento
            startPaymentPolling(order.id);

        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            toast({
                variant: "error",
                title: "Erro ao criar pedido",
                description: "Verifique os dados e tente novamente."
            });
        } finally {
            setLoading(false);
        }
    };

    const startPaymentPolling = (orderId: string) => {
        const interval = setInterval(async () => {
            try {
                const status = await paymentsService.getPaymentStatus(orderId);

                if (status.status === 'PAID') {
                    clearInterval(interval);
                    toast({
                        title: "Pagamento confirmado!",
                        description: "Seu pedido está sendo processado.",
                        style: { backgroundColor: '#10b981', color: 'white', border: 'none' }
                    });
                    router.push(`/orders/${orderId}`);
                } else if (status.status === 'FAILED' || status.status === 'EXPIRED') {
                    clearInterval(interval);
                    toast({
                        variant: "error",
                        title: "Pagamento não confirmado",
                        description: "O pagamento falhou ou expirou."
                    });
                }
            } catch (error) {
                console.error('Erro ao verificar status:', error);
            }
        }, 5000); // Verificar a cada 5 segundos

        // Limpar após 30 minutos
        setTimeout(() => clearInterval(interval), 30 * 60 * 1000);
    };

    const copyPixCode = () => {
        navigator.clipboard.writeText(pixCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatZipCode = (value: string) => {
        return value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
    };

    if (orderCreated) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#eaeded', padding: '20px 0' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ marginBottom: '20px', color: '#007600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <Check size={32} />
                            <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Pedido Realizado!</h1>
                        </div>

                        <p style={{ fontSize: '16px', color: '#565959', marginBottom: '30px' }}>
                            Total a pagar: <strong style={{ fontSize: '24px', color: '#B12704' }}>R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
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
                        <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', marginTop: '20px', marginBottom: '30px' }}>
                            <p style={{ fontSize: '13px', color: '#856404' }}>
                                ⏱️ Este código PIX expira em <strong>30 minutos</strong>.
                            </p>
                        </div>

                        <Link href="/orders">
                            <button style={{
                                backgroundColor: '#ffd814',
                                border: '1px solid #fcd200',
                                borderRadius: '8px',
                                padding: '12px 30px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                Ver meus pedidos
                            </button>
                        </Link>
                    </div>
                </div>
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
                    <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '10px' }}>Pagamento via PIX</h1>
                    <p style={{ fontSize: '16px', color: '#565959', marginBottom: '30px' }}>
                        Total: <strong style={{ fontSize: '24px', color: '#B12704' }}>R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                    </p>

                    <form onSubmit={handleCreateOrder}>
                        {/* Address Section */}
                        <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={20} /> Endereço de Entrega
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>CEP</label>
                                    <input
                                        type="text"
                                        value={address.zipCode}
                                        onChange={(e) => setAddress({ ...address, zipCode: formatZipCode(e.target.value) })}
                                        placeholder="00000-000"
                                        required
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Estado (UF)</label>
                                    <input
                                        type="text"
                                        value={address.state}
                                        onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase().slice(0, 2) })}
                                        placeholder="SP"
                                        required
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Cidade</label>
                                <input
                                    type="text"
                                    value={address.city}
                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Rua</label>
                                    <input
                                        type="text"
                                        value={address.street}
                                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Número</label>
                                    <input
                                        type="text"
                                        value={address.number}
                                        onChange={(e) => setAddress({ ...address, number: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Bairro</label>
                                    <input
                                        type="text"
                                        value={address.neighborhood}
                                        onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Complemento</label>
                                    <input
                                        type="text"
                                        value={address.complement}
                                        onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>
                        </div>

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
                            {loading ? 'Gerando PIX...' : 'Gerar PIX e Finalizar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
