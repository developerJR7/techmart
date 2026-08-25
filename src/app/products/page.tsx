"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { productsService } from "@/services/products.service";
import { Product } from "@/types/api.types";
import { useToast } from "@/hooks/use-toast";

function ProductsContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
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
      setLoading(true);
      try {
        const response = await productsService.getProducts({
          search: searchQuery,
          category: selectedCategory,
          page: currentPage,
          limit: 20
        });

        // Service now returns { data: Product[], meta: ... }
        // But types might say it returns PaginatedResponse directly.
        // Let's handle both cases to be safe or just match what we changed in service.
        // We changed service to return { data, meta } object.

        // If response has data property which is an array
        if (response && Array.isArray(response.data)) {
          setProducts(response.data);
          if (response.meta) {
            setTotalPages(Math.ceil(response.meta.total / response.meta.limit));
          }
        } else if (Array.isArray(response)) {
          // Fallback if service returns array directly
          setProducts(response);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        toast({
          variant: "error",
          title: "Erro ao carregar produtos",
          description: "Não foi possível buscar os produtos. Tente novamente."
        });
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, currentPage, toast]);

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
                image={product.images?.[0]}
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
