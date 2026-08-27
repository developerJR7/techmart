import { PackageSearch } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Product } from "@/types/api.types";

interface ProductSectionProps {
  title: string;
  description?: string;
  /** null = a busca falhou; [] = buscou certo mas não há produtos. */
  products: Product[] | null;
}

// Casca reutilizada por "Produtos em destaque" e "Novidades" — só cuida do
// título + grid + estado vazio/erro; quem busca os dados é o Server
// Component que a envolve (cada seção tem sua própria falha isolada).
export function ProductSection({ title, description, products }: ProductSectionProps) {
  return (
    <section aria-labelledby={`section-${title}`}>
      <div className="mb-6">
        <h2 id={`section-${title}`} className="font-display text-2xl font-semibold text-foreground">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>

      {products === null ? (
        <ErrorState description={`Não foi possível carregar "${title}" agora.`} />
      ) : products.length === 0 ? (
        <EmptyState icon={PackageSearch} title="Nada por aqui ainda" description="Volte em breve para novidades." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
      )}
    </section>
  );
}
