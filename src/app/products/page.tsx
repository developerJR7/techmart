"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import api from "@/lib/api";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
}

import { Suspense } from "react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (selectedCategory) params.append("category", selectedCategory);
        params.append("page", currentPage.toString());
        params.append("limit", "20");

        const response = await api.get(`/products?${params.toString()}`);
        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        // Dados mock se falhar
        const mockProducts: Product[] = Array.from({ length: 20 }, (_, i) => ({
          id: `mock-${i + 1}`,
          name: `Produto de Tecnologia ${i + 1}`,
          slug: `produto-${i + 1}`,
          price: 299.99 + (i * 50),
          image: `https://picsum.photos/seed/${i + 1}/400/400`,
        }));
        setProducts(mockProducts);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchQuery, selectedCategory, currentPage]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Nossos Produtos</h1>
          <p className="text-gray-600 mb-6">Explore nossa coleção completa de tecnologia</p>

          {/* Search */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todas as categorias</option>
              <option value="electronics">Eletrônicos</option>
              <option value="computers">Computadores</option>
              <option value="smartphones">Smartphones</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded">
                <Skeleton className="aspect-square w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                slug={product.slug}
                discount={index % 3 === 0 ? 15 : 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Tente buscar por outro termo.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="flex items-center px-4">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
          <p>Carregando produtos...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
