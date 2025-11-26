"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, QrCode, FileText, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

type PaymentMethod = 'pix' | 'boleto' | 'credit_card' | null;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [loading, setLoading] = useState(false);

  const total = getTotal();
  const shipping = total > 200 ? 0 : 15;
  const finalTotal = total + shipping;

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Selecione um método de pagamento');
      return;
    }

    setLoading(true);

    try {
      // Redirect to specific payment page
      router.push(`/checkout/${paymentMethod}`);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Carrinho vazio</h2>
        <Link href="/products">
          <button style={{
            backgroundColor: '#ffd814',
            border: '1px solid #fcd200',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer'
          }}>
            Ver Produtos
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#eaeded', padding: '20px 0' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        <Link href="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#007185', textDecoration: 'none', marginBottom: '20px' }}>
          <ArrowLeft size={20} />
          Voltar ao carrinho
        </Link>

        <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '30px' }}>Finalizar compra</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px' }}>
          {/* Payment Methods */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '21px', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              Selecione o método de pagamento
            </h2>

            {/* PIX */}
            <div
              onClick={() => setPaymentMethod('pix')}
              style={{
                border: paymentMethod === 'pix' ? '2px solid #FF9900' : '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '15px',
                cursor: 'pointer',
                backgroundColor: paymentMethod === 'pix' ? '#fff8f0' : '#fff',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <QrCode size={32} color="#00bcb4" />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>PIX</h3>
                  <p style={{ fontSize: '13px', color: '#565959' }}>Aprovação imediata - Pague com QR Code</p>
                </div>
              </div>
            </div>

            {/* Boleto */}
            <div
              onClick={() => setPaymentMethod('boleto')}
              style={{
                border: paymentMethod === 'boleto' ? '2px solid #FF9900' : '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '15px',
                cursor: 'pointer',
                backgroundColor: paymentMethod === 'boleto' ? '#fff8f0' : '#fff',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <FileText size={32} color="#0066c0" />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Boleto Bancário</h3>
                  <p style={{ fontSize: '13px', color: '#565959' }}>Vencimento em 3 dias úteis</p>
                </div>
              </div>
            </div>

            {/* Credit Card */}
            <div
              onClick={() => setPaymentMethod('credit_card')}
              style={{
                border: paymentMethod === 'credit_card' ? '2px solid #FF9900' : '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                cursor: 'pointer',
                backgroundColor: paymentMethod === 'credit_card' ? '#fff8f0' : '#fff',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <CreditCard size={32} color="#16a34a" />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>Cartão de Crédito</h3>
                  <p style={{ fontSize: '13px', color: '#565959' }}>Parcelamento em até 12x sem juros</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>Resumo do pedido</h2>

              <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '15px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px' }}>Subtotal ({items.length} itens)</span>
                  <span style={{ fontSize: '14px' }}>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px' }}>Frete</span>
                  <span style={{ fontSize: '14px', color: shipping === 0 ? '#007600' : '#000' }}>
                    {shipping === 0 ? 'GRÁTIS' : `R$ ${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#B12704' }}>
                  R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <button
                onClick={handlePayment}
                disabled={!paymentMethod || loading}
                style={{
                  width: '100%',
                  backgroundColor: paymentMethod ? '#ffd814' : '#ddd',
                  border: paymentMethod ? '1px solid #fcd200' : '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: paymentMethod && !loading ? 'pointer' : 'not-allowed',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                {loading ? 'Processando...' : 'Continuar para pagamento'}
              </button>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', fontSize: '12px', color: '#565959' }}>
              <p style={{ marginBottom: '10px' }}>🔒 Pagamento 100% seguro</p>
              <p>Seus dados estão protegidos com criptografia SSL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
