import { Suspense } from "react";
import { HeroSection, HeroSectionSkeleton } from "@/components/home/hero-section";
import { CategoriesSection, CategoriesSectionSkeleton } from "@/components/home/categories-section";
import { FeaturedSection } from "@/components/home/featured-section";
import { NewArrivalsSection } from "@/components/home/new-arrivals-section";
import { ProductSectionSkeleton } from "@/components/home/product-section-skeleton";
import { BenefitsSection } from "@/components/home/benefits-section";

// Catálogo/categorias mudam com frequência (admin cadastra produto, review
// muda o rating) — renderiza por requisição em vez de congelar no build.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="min-h-screen bg-muted/40">
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection />
      </Suspense>

      <div className="mx-auto max-w-[1500px] space-y-16 px-4 py-16">
        <Suspense fallback={<CategoriesSectionSkeleton />}>
          <CategoriesSection />
        </Suspense>

        <Suspense fallback={<ProductSectionSkeleton />}>
          <FeaturedSection />
        </Suspense>

        <Suspense fallback={<ProductSectionSkeleton />}>
          <NewArrivalsSection />
        </Suspense>

        <BenefitsSection />
      </div>
    </div>
  );
}
