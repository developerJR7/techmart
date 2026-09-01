"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, Star, Truck, PackageX, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { productsService, productKeys } from "@/services/products.service";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/products/product-gallery";
import { QuantitySelector } from "@/components/products/quantity-selector";
import { ReviewList } from "@/components/reviews/review-list";
import { ReviewForm } from "@/components/reviews/review-form";
import { useToast } from "@/hooks/use-toast";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const LOW_STOCK_THRESHOLD = 5;
// Mesma regra usada em /cart e /checkout — mantida aqui só como estimativa
// (não considera outros itens já no carrinho).
const FREE_SHIPPING_THRESHOLD = 200;

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [reviewsRefreshKey, setReviewsRefreshKey] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [now] = useState(() => Date.now());

  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: ({ signal }) => productsService.getProductBySlug(slug, signal),
    enabled: !!slug,
    retry: 1,
  });

  const productId = product?.id;

  // Relacionados reais (mesma categoria, GET /products/:id/related) — as
  // recomendações de IA (similar/frequently-bought-together) não devolvem
  // slug/categoria no payload, então não dá pra linkar pra elas com
  // segurança; por isso esta página usa só o endpoint de relacionados.
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["products", "related", productId],
    queryFn: () => productsService.getRelatedProducts(productId!),
    enabled: !!productId,
  });

  // Produto trocado (navegação entre slugs) → quantidade não pode carregar
  // um valor que pode exceder o estoque do novo produto.
  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-5 w-1/3" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <ErrorState
          title="Não foi possível carregar o produto"
          description="Verifique sua conexão e tente novamente."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={PackageX}
          title="Produto não encontrado"
          description="O produto que você está procurando não existe ou foi removido."
          action={{ label: "Voltar para a loja", onClick: () => router.push("/products") }}
        />
      </div>
    );
  }

  // "Novo" é real: só aparece pra produtos cadastrados nos últimos 30 dias,
  // calculado a partir do createdAt de verdade. `now` fica travado no
  // instante da montagem (Date.now() direto no corpo do render é impuro).
  const isNew = now - new Date(product.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;
  const inWishlist = isInWishlist(product.id);
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= LOW_STOCK_THRESHOLD;

  // `images` é o array real da galeria; `image` é um campo legado que
  // vários produtos do seed só têm este preenchido (images: [] vazio).
  // Sem esse fallback, esses produtos apareceriam sem nenhuma imagem.
  const galleryImages = product.images.length > 0 ? product.images : product.image ? [product.image] : [];
  const primaryImage = galleryImages[0];

  async function handleAddToCart() {
    if (!product || !inStock) return;
    setIsAddingToCart(true);
    try {
      await addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: primaryImage,
        slug: product.slug,
        quantity,
      });
      toast({
        variant: "success",
        title: "Adicionado ao carrinho",
        description: `${quantity}x ${product.name} adicionado com sucesso.`,
      });
    } finally {
      setIsAddingToCart(false);
    }
  }

  async function handleBuyNow() {
    if (!product || !inStock) return;
    setIsBuyingNow(true);
    try {
      await addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: primaryImage,
        slug: product.slug,
        quantity,
      });
      router.push("/checkout");
    } finally {
      setIsBuyingNow(false);
    }
  }

  async function handleWishlistToggle() {
    if (!product) return;
    setIsTogglingWishlist(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        toast({ title: "Removido da lista de desejos", description: "Produto removido da sua lista." });
      } else {
        await addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: primaryImage,
          slug: product.slug,
        });
        toast({ title: "Adicionado à lista de desejos", description: "Produto salvo na sua lista." });
      }
    } finally {
      setIsTogglingWishlist(false);
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Produtos", href: "/products" },
            { label: product.category.name, href: `/products?categoryId=${product.category.id}` },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={galleryImages} productName={product.name} />

          <div className="flex flex-col">
            {isNew && <Badge className="mb-3 w-fit">Novo</Badge>}

            <div className="mb-3 flex flex-wrap items-center gap-3">
              <Badge variant="outline">{product.category.name}</Badge>
              {product.averageRating != null && (
                <div className="flex items-center gap-1.5 text-sm">
                  <div className="flex" role="img" aria-label={`${product.averageRating.toFixed(1)} de 5 estrelas`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        aria-hidden="true"
                        className={`h-4 w-4 ${
                          i < Math.floor(product.averageRating!) ? "fill-amber text-amber" : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    {product.averageRating.toFixed(1)} ({product.reviewCount}{" "}
                    {product.reviewCount === 1 ? "avaliação" : "avaliações"})
                  </span>
                </div>
              )}
            </div>

            <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground md:text-4xl">{product.name}</h1>

            {/* Sem originalPrice/desconto real no contrato do Product — mostra
                só o preço de verdade em vez de forjar um "de/por" fixo. */}
            <p className="mb-2 text-4xl font-bold text-foreground">{currencyFormatter.format(product.price)}</p>

            <p
              className={`mb-6 text-sm font-medium ${
                !inStock ? "text-destructive" : lowStock ? "text-warning" : "text-success"
              }`}
            >
              {!inStock
                ? "Produto esgotado"
                : lowStock
                  ? `Restam apenas ${product.stock} unidades`
                  : "Em estoque"}
            </p>

            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{product.description}</p>

            <Card className="mb-8 shadow-soft">
              <CardContent className="p-6">
                {inStock ? (
                  <>
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                      <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} />
                      <Button
                        className="h-12 flex-1 text-base"
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || isBuyingNow}
                      >
                        {isAddingToCart ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                        ) : (
                          <ShoppingCart className="mr-2 h-5 w-5" aria-hidden="true" />
                        )}
                        Adicionar ao carrinho
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 shrink-0"
                        onClick={handleWishlistToggle}
                        disabled={isTogglingWishlist}
                        aria-pressed={inWishlist}
                        aria-label={inWishlist ? "Remover da lista de desejos" : "Adicionar à lista de desejos"}
                      >
                        {isTogglingWishlist ? (
                          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                        ) : (
                          <Heart
                            className={`h-5 w-5 ${inWishlist ? "fill-destructive text-destructive" : ""}`}
                            aria-hidden="true"
                          />
                        )}
                      </Button>
                    </div>
                    <Button
                      variant="secondary"
                      className="mb-4 h-12 w-full text-base"
                      onClick={handleBuyNow}
                      disabled={isBuyingNow || isAddingToCart}
                    >
                      {isBuyingNow && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                      Comprar agora
                    </Button>
                  </>
                ) : (
                  <Button className="mb-4 h-12 w-full text-base" disabled>
                    Produto esgotado
                  </Button>
                )}

                <div className="flex items-center gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>
                    {product.price * quantity > FREE_SHIPPING_THRESHOLD
                      ? "Frete grátis nesta quantidade"
                      : "Frete calculado no carrinho"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {product.specifications && product.specifications.length > 0 && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold text-card-foreground">Especificações</h2>
                  <dl className="divide-y divide-border">
                    {product.specifications.map((spec) => (
                      <div key={spec.id} className="flex justify-between gap-4 py-2.5 text-sm">
                        <dt className="text-muted-foreground">{spec.key}</dt>
                        <dd className="text-right font-medium text-card-foreground">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Avaliações dos clientes</h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ReviewList key={reviewsRefreshKey} productId={product.id} refreshTrigger={reviewsRefreshKey} />
            </div>
            <div>
              <ReviewForm productId={product.id} onSuccess={() => setReviewsRefreshKey((k) => k + 1)} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Produtos relacionados</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relatedProducts.map((related) => (
                <ProductCard
                  key={related.id}
                  id={related.id}
                  name={related.name}
                  price={related.price}
                  image={related.images?.[0] ?? related.image ?? undefined}
                  slug={related.slug}
                  rating={related.averageRating}
                  reviewCount={related.reviewCount}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
