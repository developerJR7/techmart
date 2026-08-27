"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, Heart, X } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

const categories = [
  { href: "/products", label: "Ofertas do dia" },
  { href: "/products?category=electronics", label: "Eletrônicos" },
  { href: "/products?category=fashion", label: "Moda" },
  { href: "/products?category=home", label: "Casa" },
];

export function Navbar() {
  const { user } = useAuthStore();
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
      <nav className="sticky top-0 z-50 bg-secondary shadow-[0_1px_0_0_hsl(var(--border))]">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3">
          <Link
            href="/"
            className="shrink-0 font-display text-xl font-bold tracking-tight text-primary-foreground"
          >
            Tech<span className="text-primary">Mart</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden max-w-2xl flex-1 md:flex">
            <div className="flex h-10 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary">
              <input
                type="text"
                placeholder="Buscar produtos, marcas e mais"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/50 outline-none"
              />
              <button
                type="submit"
                className="flex w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                aria-label="Buscar"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 text-white">
            <Link
              href={user ? "/profile" : "/login"}
              className="hidden flex-col rounded-lg px-3 py-1.5 text-left leading-tight transition-colors hover:bg-white/10 sm:flex"
            >
              <span className="text-[11px] text-white/60">
                Olá, {user ? user.name?.split(" ")[0] : "faça login"}
              </span>
              <span className="text-sm font-semibold">Conta</span>
            </Link>

            <Link
              href="/wishlist"
              className="relative rounded-lg p-2.5 transition-colors hover:bg-white/10"
              aria-label="Lista de desejos"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber px-1 text-[10px] font-bold text-amber-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/10"
            >
              <span className="relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber px-1 text-[10px] font-bold text-amber-foreground">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="hidden text-sm font-semibold sm:inline">Carrinho</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/20">
          <div className="mx-auto flex max-w-[1500px] items-center gap-1 px-4 py-2 text-sm text-white/90">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors hover:bg-white/10"
            >
              <Menu size={16} />
              Todos
            </button>

            <div className="hidden items-center gap-1 md:flex">
              {categories.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="rounded-lg px-3 py-1.5 transition-colors hover:bg-white/10"
                >
                  {c.label}
                </Link>
              ))}
            </div>

            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="ml-auto rounded-lg px-3 py-1.5 font-semibold text-primary transition-colors hover:bg-white/10"
              >
                Painel Admin
              </Link>
            )}
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-[999] bg-black/70"
          />
          <div className="fixed inset-y-0 left-0 z-[1000] w-72 overflow-y-auto border-r border-primary/40 bg-secondary p-5">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-4 top-4 text-white/70 hover:text-white"
              aria-label="Fechar menu"
            >
              <X size={22} />
            </button>

            <h3 className="mb-5 font-display text-lg font-semibold text-primary">
              Categorias
            </h3>

            <div className="flex flex-col">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "border-b border-white/10 py-3 text-sm text-white/90",
                  "hover:text-primary",
                )}
              >
                Todos os Produtos
              </Link>
              {categories.slice(1).map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-white/10 py-3 text-sm text-white/90 hover:text-primary"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
