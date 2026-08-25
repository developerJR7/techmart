"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Printer, MapPin, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { ordersService } from "@/services/orders.service";
import { useToast } from "@/hooks/use-toast";

export default function BoletoPaymentPage() {
    const { items, getTotal, clearCart, couponCode } = useCartStore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [orderCreated, setOrderCreated] = useState(false);

    const [boletoUrl, setBoletoUrl] = useState("");
    const [boletoCode, setBoletoCode] = useState("");

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
            await ordersService.createOrder({
                items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
                shippingAddress: address,
                paymentMethod: 'BOLETO',
                couponCode: couponCode || undefined
            });

            // Mock Boleto creation
            const mockBoletoCode = "23793.38128 60000.000001 00000.000000 1 99990000" + Math.floor(finalTotal * 100);
            const mockBoletoUrl = "#";

            setBoletoCode(mockBoletoCode);
            setBoletoUrl(mockBoletoUrl);
            setOrderCreated(true);
            clearCart();

            toast({
                title: "Pedido criado!",
                description: "Boleto gerado com sucesso.",
                style: { backgroundColor: '#7F5AF0', color: 'white', border: 'none' }
            });

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

    const formatZipCode = (value: string) => {
        return value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
    };

    if (orderCreated) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#eaeded', padding: '20px 0' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '20px', color: '#007600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <Check size={32} />
                            <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Pedido Realizado!</h1>
                        </div>

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
                        <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
                            <p style={{ fontSize: '13px', color: '#856404' }}>
                                ⏱️ <strong>Vencimento:</strong> {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                                <br />
                                Após o vencimento, o boleto não poderá mais ser pago.
                            </p>
                        </div>

                        <Link href="/orders">
                            <button style={{
                                width: '100%',
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
                    <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '10px', textAlign: 'center' }}>Boleto Bancário</h1>
                    <p style={{ fontSize: '16px', color: '#565959', marginBottom: '30px', textAlign: 'center' }}>
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
                            {loading ? 'Gerando Boleto...' : 'Gerar Boleto e Finalizar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
