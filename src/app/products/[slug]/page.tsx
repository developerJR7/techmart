"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Minus, Plus, Heart, Share2, Star, ChevronRight, Truck, Shield, RotateCcw } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { ProductCard } from "@/components/product-card";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  images?: string[];
  slug: string;
  category: {
    id: string;
    name: string;
  };
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await api.get(`/products/slug/${slug}`);
        setProduct(response.data);

        // Fetch related products (mock or real)
        try {
          const relatedRes = await api.get(`/products?limit=4`);
          setRelatedProducts(relatedRes.data.products.filter((p: Product) => p.id !== response.data.id).slice(0, 4));
        } catch (err) {
          console.error("Erro ao carregar produtos relacionados", err);
        }
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        slug: product.slug,
        quantity: quantity
      });
    }
  };

  const handleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          slug: product.slug
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Produto não encontrado</h1>
        <p className="text-gray-500 mb-8">O produto que você está procurando não existe ou foi removido.</p>
        <Link href="/products">
          <Button>Voltar para a loja</Button>
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/products" className="hover:text-blue-600 transition-colors">Produtos</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-8 hover:scale-105 transition-transform duration-500"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Sem imagem
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none px-3 py-1 text-sm">
                Novo
              </Badge>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                {product.category.name}
              </Badge>
              <div className="flex items-center text-yellow-400 text-sm">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-gray-600 dark:text-gray-400 font-medium">4.8 (120 avaliações)</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
              </span>
              <span className="text-lg text-gray-500 line-through">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price * 1.2)}
              </span>
              <span className="text-green-600 font-medium text-sm bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                20% OFF
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 rounded-l-xl hover:bg-white dark:hover:bg-gray-700"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="h-12 w-12 rounded-r-xl hover:bg-white dark:hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  className="flex-1 h-12 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.stock > 0 ? "Adicionar ao Carrinho" : "Esgotado"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-12 w-12 rounded-xl border-gray-200 dark:border-gray-700 ${inWishlist ? "text-red-500 border-red-200 bg-red-50" : "text-gray-500 hover:text-red-500"}`}
                  onClick={handleWishlist}
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span>Frete Grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Garantia de 1 ano</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-blue-600" />
                  <span>7 dias para troca</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 pt-16">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((related) => (
                <ProductCard
                  key={related.id}
                  id={related.id}
                  name={related.name}
                  price={related.price}
                  image={related.image}
                  slug={related.slug}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

