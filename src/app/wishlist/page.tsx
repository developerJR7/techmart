"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";

export default function WishlistPage() {
    const router = useRouter();
    const { items, removeItem } = useWishlistStore();
    const { addItem } = useCartStore();

    const handleAddToCart = (item: any) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.image,
            slug: item.slug
        });
        removeItem(item.id);
        alert('Produto adicionado ao carrinho!');
    };

    if (items.length === 0) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '40px 20px', textAlign: 'center' }}>
                <Heart size={80} style={{ color: '#ddd', margin: '0 auto 20px' }} />
                <h2 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '10px' }}>Sua lista de desejos está vazia</h2>
                <p style={{ color: '#565959', marginBottom: '20px' }}>Adicione produtos aos favoritos para vê-los aqui</p>
                <Link href="/products">
                    <button style={{
                        backgroundColor: '#7F5AF0',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        Ver Produtos
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#eaeded', padding: '20px 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '20px' }}>
                    Sua lista de desejos ({items.length} {items.length === 1 ? 'item' : 'itens'})
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {items.map((item) => (
                        <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '15px', position: 'relative' }}>
                            {/* Remove Button */}
                            <button
                                onClick={() => removeItem(item.id)}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    backgroundColor: '#fff',
                                    border: '1px solid #ddd',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    zIndex: 10
                                }}
                            >
                                <Trash2 size={16} color="#666" />
                            </button>

                            {/* Product Image */}
                            {item.image && (
                                <Link href={`/products/${item.slug}`}>
                                    <div style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '15px', cursor: 'pointer' }}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                </Link>
                            )}

                            {/* Product Info */}
                            <Link href={`/products/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', minHeight: '40px', lineHeight: '1.4' }}>
                                    {item.name}
                                </h3>
                            </Link>

                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#B12704', marginBottom: '15px' }}>
                                R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => handleAddToCart(item)}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#7F5AF0',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    color: '#fff'
                                }}
                            >
                                Adicionar ao carrinho
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
