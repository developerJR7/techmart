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
import { productsService } from "@/services/products.service";
import { recommendationsService } from "@/services/recommendations.service";
import { Product } from "@/types/api.types";
import { ProductCard } from "@/components/product-card";
import { ReviewList } from "@/components/reviews/review-list";
import { ReviewForm } from "@/components/reviews/review-form";
import { useToast } from "@/hooks/use-toast";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [frequentlyBought, setFrequentlyBought] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await productsService.getProductBySlug(slug);
        setProduct(productData);

        // Fetch AI-powered similar products
        try {
          const similar = await recommendationsService.getSimilarProducts(productData.id, 4);
          setSimilarProducts(similar.map(s => s as unknown as Product));
        } catch (err) {
          console.error("Erro ao carregar produtos similares", err);
        }

        // Fetch frequently bought together
        try {
          const bought = await recommendationsService.getFrequentlyBoughtTogether(productData.id);
          setFrequentlyBought(bought);
        } catch (err) {
          console.error("Erro ao carregar produtos comprados juntos", err);
        }

        // Fallback to related products if AI fails
        try {
          const related = await productsService.getRelatedProducts(productData.id);
          setRelatedProducts(related.slice(0, 4));
        } catch (err) {
          console.error("Erro ao carregar produtos relacionados", err);
        }
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        toast({
          variant: "error",
          title: "Erro ao carregar produto",
          description: "Não foi possível carregar os detalhes do produto."
        });
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchProduct();
    }
  }, [slug, toast]);

  const handleAddToCart = async () => {
    if (product) {
      await addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0],
        slug: product.slug,
        quantity: quantity
      });

      toast({
        title: "Adicionado ao carrinho",
        description: `${quantity}x ${product.name} adicionado com sucesso.`,
        style: { backgroundColor: '#7F5AF0', color: 'white', border: 'none' }
      });
    }
  };

  const handleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
        toast({
          title: "Removido da lista de desejos",
          description: "Produto removido da sua lista."
        });
      } else {
        addToWishlist({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.images?.[0],
          slug: product.slug
        });
        toast({
          title: "Adicionado à lista de desejos",
          description: "Produto salvo na sua lista."
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
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
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
                  <span>Troca em 30 dias</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Avaliações dos Clientes</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ReviewList productId={product.id} />
            </div>
            <div>
              <ReviewForm productId={product.id} onSuccess={() => window.location.reload()} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <ProductCard
                  key={related.id}
                  id={related.id}
                  name={related.name}
                  price={related.price}
                  image={related.images?.[0]}
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

