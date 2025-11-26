"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, Menu, Heart, User } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <nav style={{ backgroundColor: '#0A0A0A', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 8px rgba(127, 90, 240, 0.3)' }}>
        {/* Main Header */}
        <div style={{ backgroundColor: '#0A0A0A', padding: '10px 0' }}>
          <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '0 15px', display: 'flex', alignItems: 'center', gap: '15px' }}>

            {/* Logo */}
            <Link href="/" style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#7F5AF0',
              textDecoration: 'none',
              padding: '8px 10px',
              whiteSpace: 'nowrap'
            }}>
              TechMart
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '900px' }}>
              <div style={{ display: 'flex', height: '40px' }}>
                <input
                  type="text"
                  placeholder="Pesquisar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0 15px',
                    border: '1px solid #333',
                    borderRadius: '4px 0 0 4px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#1a1a1a',
                    color: '#fff'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: '45px',
                    backgroundColor: '#7F5AF0',
                    border: 'none',
                    borderRadius: '0 4px 4px 0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Search size={20} color="#fff" />
                </button>
              </div>
            </form>

            {/* Right Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* User */}
              <Link href={user ? "/profile" : "/login"} style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '12px',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
                <span style={{ fontSize: '12px' }}>Olá, {user ? user.name?.split(' ')[0] : 'Faça login'}</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Conta</span>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist" style={{
                color: '#fff',
                textDecoration: 'none',
                position: 'relative',
                padding: '8px 10px'
              }}>
                <Heart size={24} />
                {wishlistCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    backgroundColor: '#7F5AF0',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '10px'
                  }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" style={{
                color: '#fff',
                textDecoration: 'none',
                position: 'relative',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'flex-end',
                gap: '5px'
              }}>
                <div style={{ position: 'relative' }}>
                  <ShoppingCart size={32} />
                  {cartCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      backgroundColor: '#7F5AF0',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      padding: '2px 7px',
                      borderRadius: '10px'
                    }}>
                      {cartCount}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Carrinho</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Category Bar */}
        <div style={{ backgroundColor: '#1a1a1a', padding: '8px 0', borderTop: '1px solid #333' }}>
          <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '0 15px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '14px',
                fontWeight: 'bold',
                padding: '8px 10px'
              }}
            >
              <Menu size={20} />
              Todos
            </button>

            <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
              <Link href="/products" style={{ color: '#fff', textDecoration: 'none', padding: '8px 10px' }}>
                Ofertas do dia
              </Link>
              <Link href="/products?category=electronics" style={{ color: '#fff', textDecoration: 'none', padding: '8px 10px' }}>
                Eletrônicos
              </Link>
              <Link href="/products?category=fashion" style={{ color: '#fff', textDecoration: 'none', padding: '8px 10px' }}>
                Moda
              </Link>
              <Link href="/products?category=home" style={{ color: '#fff', textDecoration: 'none', padding: '8px 10px' }}>
                Casa
              </Link>
              {user?.role === 'ADMIN' && (
                <Link href="/admin" style={{ color: '#7F5AF0', textDecoration: 'none', padding: '8px 10px', fontWeight: 'bold' }}>
                  📊 Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 999
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '300px',
              height: '100vh',
              backgroundColor: '#1a1a1a',
              zIndex: 1000,
              overflowY: 'auto',
              padding: '20px',
              borderRight: '2px solid #7F5AF0'
            }}
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <h3 style={{ color: '#7F5AF0', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>Categorias</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/products" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', padding: '10px', borderBottom: '1px solid #333' }}>
                Todos os Produtos
              </Link>
              <Link href="/products?category=electronics" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', padding: '10px', borderBottom: '1px solid #333' }}>
                Eletrônicos
              </Link>
              <Link href="/products?category=fashion" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', padding: '10px', borderBottom: '1px solid #333' }}>
                Moda
              </Link>
              <Link href="/products?category=home" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', padding: '10px', borderBottom: '1px solid #333' }}>
                Casa
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
