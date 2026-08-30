"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterPanel, type FilterPanelValue } from "@/components/products/filter-panel";
import { FilterDrawer } from "@/components/products/filter-drawer";
import { SortSelector } from "@/components/products/sort-selector";
import { Search, X } from "lucide-react";
import { productsService, productKeys, type ProductSort } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;
const RATING_LABELS: Record<number, string> = { 4: "4+ estrelas", 3: "3+ estrelas", 2: "2+ estrelas", 1: "1+ estrela" };

function readFilters(searchParams: URLSearchParams) {
  const minPriceRaw = searchParams.get("minPrice");
  const maxPriceRaw = searchParams.get("maxPrice");
  const minRatingRaw = searchParams.get("minRating");
  return {
    search: searchParams.get("search") ?? "",
    categoryId: searchParams.get("categoryId") ?? "",
    minPrice: minPriceRaw ? Number(minPriceRaw) : undefined,
    maxPrice: maxPriceRaw ? Number(maxPriceRaw) : undefined,
    minRating: minRatingRaw ? Number(minRatingRaw) : undefined,
    inStock: searchParams.get("inStock") === "true",
    sort: (searchParams.get("sort") as ProductSort) || "relevance",
    page: (() => {
      const raw = Math.floor(Number(searchParams.get("page")));
      return Number.isFinite(raw) && raw >= 1 ? raw : 1;
    })(),
  };
}

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = readFilters(searchParams);

  const [searchInput, setSearchInput] = useState(filters.search);

  // Ajusta o estado local durante a renderização (em vez de um useEffect,
  // que o eslint deste projeto rejeita para esse padrão) quando o `?search=`
  // muda por uma navegação externa (ex.: busca do navbar, sem remount deste
  // componente porque é a mesma rota).
  const [syncedSearch, setSyncedSearch] = useState(filters.search);
  if (filters.search !== syncedSearch) {
    setSyncedSearch(filters.search);
    setSearchInput(filters.search);
  }

  const updateParams = useCallback(
    (overrides: Record<string, string | undefined>, opts: { resetPage?: boolean } = {}) => {
      const { resetPage = true } = opts;
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, val] of Object.entries(overrides)) {
        if (val === undefined || val === "") params.delete(key);
        else params.set(key, val);
      }
      if (resetPage) params.delete("page");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // updateParams muda de identidade a cada navegação (depende de searchParams).
  // Guardar a versão mais recente numa ref evita que o timeout do debounce
  // abaixo dispare com uma versão antiga — sem isso, um filtro aplicado
  // enquanto o debounce da busca ainda está pendente seria revertido quando
  // o timeout finalmente disparasse com a URL antiga capturada no closure.
  const updateParamsRef = useRef(updateParams);
  useEffect(() => {
    updateParamsRef.current = updateParams;
  });

  // Debounce: só grava `?search=` na URL 500ms depois de parar de digitar,
  // pra não disparar uma request/navegação por tecla. A URL é a fonte de
  // verdade da busca "aplicada"; `searchInput` é só o eco imediato do campo.
  useEffect(() => {
    if (searchInput === filters.search) return;
    const timeoutId = setTimeout(() => updateParamsRef.current({ search: searchInput || undefined }), 500);
    return () => clearTimeout(timeoutId);
  }, [searchInput, filters.search]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories(),
    staleTime: 10 * 60 * 1000,
  });

  const queryFilters = {
    search: filters.search || undefined,
    categoryId: filters.categoryId || undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minRating: filters.minRating,
    inStock: filters.inStock || undefined,
    sort: filters.sort,
    page: filters.page,
    limit: PAGE_SIZE,
  };

  const {
    data,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: productKeys.list(queryFilters),
    queryFn: ({ signal }) => productsService.getProducts(queryFilters, signal),
    placeholderData: keepPreviousData,
  });

  const products = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.lastPage ?? 1;

  const selectedCategory = categories.find((c) => c.id === filters.categoryId);
  const hasActiveFilters = Boolean(
    filters.categoryId || filters.minPrice != null || filters.maxPrice != null || filters.minRating != null || filters.inStock
  );

  const filterPanelValue: FilterPanelValue = {
    categoryId: filters.categoryId,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minRating: filters.minRating,
    inStock: filters.inStock,
  };

  const handleFilterChange = (value: FilterPanelValue) => {
    updateParams({
      categoryId: value.categoryId || undefined,
      minPrice: value.minPrice?.toString(),
      maxPrice: value.maxPrice?.toString(),
      minRating: value.minRating?.toString(),
      inStock: value.inStock ? "true" : undefined,
    });
  };

  const clearFilters = () => {
    updateParams({ categoryId: undefined, minPrice: undefined, maxPrice: undefined, minRating: undefined, inStock: undefined });
  };

  const clearAll = () => {
    setSearchInput("");
    updateParams({
      search: undefined,
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      inStock: undefined,
    });
  };

  const title = filters.search
    ? `Resultados para "${filters.search}"`
    : selectedCategory?.name ?? "Todos os produtos";

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-[1500px] px-4 py-8">
        <Breadcrumb
          className="mb-4"
          items={[
            { label: "Início", href: "/" },
            { label: "Produtos", href: "/products" },
            ...(filters.search || selectedCategory ? [{ label: title }] : []),
          ]}
        />

        <div className="mb-6">
          <h1 className="mb-1 font-display text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {isPending ? "Buscando produtos…" : `${total} ${total === 1 ? "produto encontrado" : "produtos encontrados"}`}
          </p>
          <p role="status" aria-live="polite" className="sr-only">
            {isFetching && !isPending ? "Atualizando resultados…" : ""}
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onClear={() => setSearchInput("")}
            placeholder="Buscar produtos..."
            className="flex-1"
          />
          <div className="flex gap-3">
            <div className="shrink-0 lg:hidden">
              <FilterDrawer
                categories={categories}
                value={filterPanelValue}
                onChange={handleFilterChange}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
                resultCount={total}
              />
            </div>
            <div className="min-w-0 flex-1 sm:flex-none">
              <SortSelector value={filters.sort} onChange={(sort) => updateParams({ sort: sort === "relevance" ? undefined : sort })} />
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {selectedCategory && (
              <FilterChip label={selectedCategory.name} onRemove={() => updateParams({ categoryId: undefined })} />
            )}
            {(filters.minPrice != null || filters.maxPrice != null) && (
              <FilterChip
                label={
                  filters.minPrice != null && filters.maxPrice != null
                    ? `R$ ${filters.minPrice} – R$ ${filters.maxPrice}`
                    : filters.minPrice != null
                      ? `A partir de R$ ${filters.minPrice}`
                      : `Até R$ ${filters.maxPrice}`
                }
                onRemove={() => updateParams({ minPrice: undefined, maxPrice: undefined })}
              />
            )}
            {filters.minRating != null && (
              <FilterChip
                label={RATING_LABELS[filters.minRating] ?? `${filters.minRating}+ estrelas`}
                onRemove={() => updateParams({ minRating: undefined })}
              />
            )}
            {filters.inStock && <FilterChip label="Em estoque" onRemove={() => updateParams({ inStock: undefined })} />}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto px-2 py-1 text-xs text-muted-foreground">
              Limpar tudo
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-4">
              <FilterPanel
                categories={categories}
                value={filterPanelValue}
                onChange={handleFilterChange}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          <div>
            {isPending ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(PAGE_SIZE)].map((_, i) => (
                  <div key={i} className="rounded-xl bg-card p-4">
                    <Skeleton className="aspect-square w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <ErrorState
                description="Não foi possível buscar os produtos. Tente novamente."
                onRetry={() => refetch()}
              />
            ) : products.length > 0 ? (
              <div
                className={cn(
                  "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 transition-opacity",
                  isFetching && "opacity-60"
                )}
                aria-busy={isFetching}
              >
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
                action={{ label: "Limpar filtros", onClick: clearAll }}
              />
            )}

            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={(page) => updateParams({ page: page.toString() }, { resetPage: false })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="gap-1 py-1 pl-3 pr-1.5 font-normal">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remover filtro ${label}`}
        className="rounded-full p-0.5 transition-colors hover:bg-foreground/10"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
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
