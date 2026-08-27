import { getFeaturedProductsCached } from "@/components/home/home-data";
import { HomeHero } from "@/components/home/home-hero";

export async function HeroSection() {
  let products: Awaited<ReturnType<typeof getFeaturedProductsCached>> = [];
  try {
    products = await getFeaturedProductsCached();
  } catch (error) {
    console.error("Erro ao carregar produtos em destaque para o Hero:", error);
  }

  return <HomeHero products={products.slice(0, 3)} />;
}

export function HeroSectionSkeleton() {
  return (
    <div className="h-[500px] animate-pulse bg-secondary sm:h-[560px] lg:h-[640px]" />
  );
}
