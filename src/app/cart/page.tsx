"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, Tag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";

import { useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, getSubtotal, syncWithBackend, applyCoupon, removeCoupon, discount, couponCode } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const total = getTotal();
  const shipping = subtotal > 200 ? 0 : 15;
  const finalTotal = total + shipping;

  useEffect(() => {
    if (isAuthenticated()) {
      syncWithBackend();
    }
  }, [isAuthenticated, syncWithBackend]);

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);

    const success = await applyCoupon(couponInput);

    if (success) {
      toast({
        title: "Cupom aplicado!",
        description: `O cupom ${couponInput} foi aplicado com sucesso.`,
        style: { backgroundColor: '#7F5AF0', color: 'white', border: 'none' }
      });
      setCouponInput("");
    } else {
      toast({
        variant: "error",
        title: "Cupom inválido",
        description: "O cupom informado não é válido ou expirou."
      });
    }
    setApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast({
      title: "Cupom removido",
      description: "O cupom de desconto foi removido.",
    });
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '40px 20px', textAlign: 'center' }}>
        <ShoppingBag size={80} style={{ color: '#ddd', margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '10px' }}>Seu carrinho está vazio</h2>
        <p style={{ color: '#565959', marginBottom: '20px' }}>Adicione produtos ao carrinho para continuar</p>
        <Link href="/products">
          <button style={{
            backgroundColor: '#ffd814',
            border: '1px solid #fcd200',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '13px'
          }}>
            Ver Produtos
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#eaeded', padding: '20px 0' }}>
      <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
          {/* Cart Items */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              Carrinho de compras
            </h1>

            {items.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                gap: '20px',
                padding: '20px 0',
                borderBottom: '1px solid #ddd'
              }}>
                {/* Image */}
                {item.image && (
                  <div style={{ width: '180px', height: '180px', position: 'relative', flexShrink: 0 }}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                )}

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '5px' }}>
                    <Link href={`/products/${item.slug}`} style={{ color: '#007185', textDecoration: 'none' }}>
                      {item.name}
                    </Link>
                  </h3>
                  <p style={{ color: '#007600', fontSize: '12px', marginBottom: '10px' }}>Em estoque</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#B12704', marginBottom: '15px' }}>
                    R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>

                  {/* Quantity Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <select
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      style={{
                        padding: '8px 30px 8px 10px',
                        border: '1px solid #d5d9d9',
                        borderRadius: '8px',
                        backgroundColor: '#f0f2f2',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Qtd: {i + 1}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#007185',
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#B12704' }}>
                    R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}

            {/* Subtotal */}
            <div style={{ textAlign: 'right', padding: '20px 0' }}>
              <p style={{ fontSize: '18px' }}>
                Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'itens'}):
                <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                  R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </p>
            </div>
          </div>

          {/* Checkout Summary */}
          <div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', position: 'sticky', top: '20px' }}>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'itens'}):
                <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                  R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </p>

              {/* Coupon Section */}
              <div style={{ marginBottom: '15px', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '15px 0' }}>
                {couponCode ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                    <div>
                      <p style={{ fontSize: '13px', color: '#166534', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Tag size={14} /> {couponCode}
                      </p>
                      <p style={{ fontSize: '12px', color: '#166534' }}>Desconto aplicado</p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Cupom de desconto"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon || !couponInput}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#fff',
                        border: '1px solid #d5d9d9',
                        borderRadius: '8px',
                        cursor: applyingCoupon || !couponInput ? 'not-allowed' : 'pointer',
                        fontSize: '13px',
                        boxShadow: '0 2px 5px rgba(213,217,217,.5)'
                      }}
                    >
                      {applyingCoupon ? '...' : 'Aplicar'}
                    </button>
                  </div>
                )}
              </div>

              {discount > 0 && (
                <p style={{ fontSize: '14px', color: '#16a34a', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Desconto:</span>
                  <span>- R$ {discount.toFixed(2)}</span>
                </p>
              )}

              {shipping > 0 && (
                <p style={{ fontSize: '14px', color: '#565959', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Frete:</span>
                  <span>R$ {shipping.toFixed(2)}</span>
                </p>
              )}

              {shipping === 0 && (
                <p style={{ fontSize: '14px', color: '#007600', marginBottom: '15px' }}>
                  ✓ Frete GRÁTIS
                </p>
              )}

              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginBottom: '15px' }}>
                <p style={{ fontSize: '18px', color: '#B12704', textAlign: 'right' }}>
                  Total: <strong>R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </p>
              </div>

              <button
                onClick={handleCheckout}
                style={{
                  width: '100%',
                  backgroundColor: '#ffd814',
                  border: '1px solid #fcd200',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '10px'
                }}
              >
                Fechar pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
