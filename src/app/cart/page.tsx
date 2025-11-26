"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const total = getTotal();
  const shipping = total > 200 ? 0 : 15;
  const finalTotal = total + shipping;

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    router.push("/checkout");
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
                  R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                  R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </p>

              {shipping > 0 && (
                <p style={{ fontSize: '14px', color: '#565959', marginBottom: '15px' }}>
                  Frete: R$ {shipping.toFixed(2)}
                </p>
              )}

              {shipping === 0 && (
                <p style={{ fontSize: '14px', color: '#007600', marginBottom: '15px' }}>
                  ✓ Frete GRÁTIS
                </p>
              )}

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

              <p style={{ fontSize: '12px', color: '#565959', textAlign: 'center' }}>
                Total: <strong>R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
