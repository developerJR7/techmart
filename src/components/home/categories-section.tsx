import { Tags } from "lucide-react";
import { categoriesService } from "@/services/categories.service";
import { CategoryCard } from "@/components/home/category-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";

export async function CategoriesSection() {
  let categories: Awaited<ReturnType<typeof categoriesService.getCategories>> | null = null;
  try {
    categories = await categoriesService.getCategories();
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
  }

  return (
    <section aria-labelledby="section-categorias">
      <h2 id="section-categorias" className="mb-6 font-display text-2xl font-semibold text-foreground">
        Categorias
      </h2>

      {categories === null ? (
        <ErrorState description="Não foi possível carregar as categorias agora." />
      ) : categories.length === 0 ? (
        <EmptyState icon={Tags} title="Nenhuma categoria disponível" />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}

export function CategoriesSectionSkeleton() {
  return (
    <section>
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-square w-full rounded-xl" />
          </div>
        ))}
      </div>
    </section>
  );
}
