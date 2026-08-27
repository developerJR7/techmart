import { getFeaturedProductsCached } from "@/components/home/home-data";
import { ProductSection } from "@/components/home/product-section";
import { Product } from "@/types/api.types";

export async function FeaturedSection() {
  let products: Product[] | null = null;
  try {
    products = await getFeaturedProductsCached();
  } catch (error) {
    console.error("Erro ao carregar produtos em destaque:", error);
  }

  return <ProductSection title="Produtos em destaque" products={products} />;
}
