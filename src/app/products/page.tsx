"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Search } from "lucide-react";
import { productsService, productKeys } from "@/services/products.service";
import { categoriesService, Category } from "@/services/categories.service";

const PAGE_SIZE = 20;

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Ajusta o estado durante a renderização (em vez de um useEffect) quando o
  // `?search=` da URL muda — ver "Adjusting state when a prop changes" nos
  // docs do React. Evita o round-trip extra de um efeito só pra sincronizar.
  const [syncedSearchParam, setSyncedSearchParam] = useState(initialSearch);
  if (initialSearch !== syncedSearchParam) {
    setSyncedSearchParam(initialSearch);
    setSearchQuery(initialSearch);
    setDebouncedSearch(initialSearch);
  }

  useEffect(() => {
    categoriesService
      .getCategories()
      .then(setCategories)
      .catch((error) => console.error("Erro ao carregar categorias:", error));
  }, []);

  // Debounce: só atualiza o valor que entra na query key 500ms depois de
  // parar de digitar, pra não disparar uma request por tecla.
  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Volta pra primeira página sempre que um filtro muda (mesmo padrão de
  // ajuste de estado durante a renderização, em vez de useEffect).
  const filterKey = `${debouncedSearch}::${selectedCategoryId}`;
  const [syncedFilterKey, setSyncedFilterKey] = useState(filterKey);
  if (filterKey !== syncedFilterKey) {
    setSyncedFilterKey(filterKey);
    setCurrentPage(1);
  }

  const filters = {
    search: debouncedSearch,
    categoryId: selectedCategoryId || undefined,
    page: currentPage,
    limit: PAGE_SIZE,
  };

  const {
    data,
    isPending: loading,
    isError: error,
    refetch,
  } = useQuery({
    queryKey: productKeys.list(filters),
    queryFn: ({ signal }) => productsService.getProducts(filters, signal),
    placeholderData: keepPreviousData,
  });

  const products = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.meta.total / data.meta.limit) || 1 : 1;

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-4 font-display text-3xl font-bold text-foreground">Nossos Produtos</h1>
          <p className="mb-6 text-muted-foreground">Explore nossa coleção completa de tecnologia</p>

          {/* Search */}
          <div className="flex gap-4 mb-6">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar produtos..."
              className="flex-1 max-w-xl"
            />
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="rounded-md border border-input bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="rounded-xl bg-card p-4">
                <Skeleton className="aspect-square w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState
            description="Não foi possível buscar os produtos. Tente novamente."
            onRetry={() => refetch()}
          />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.images?.[0]}
                slug={product.slug}
                rating={product.averageRating}
                reviewCount={product.reviewCount}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="Nenhum produto encontrado"
            description="Tente buscar por outro termo ou remover os filtros."
          />
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
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
