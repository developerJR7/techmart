import { productsService } from "@/services/products.service";
import { ProductSection } from "@/components/home/product-section";
import { Product } from "@/types/api.types";

export async function NewArrivalsSection() {
  let products: Product[] | null = null;
  try {
    // Sem endpoint dedicado de "populares" — ordenação padrão do backend já
    // é por createdAt desc, então isso é literalmente "os mais recentes".
    const { data } = await productsService.getProducts({ limit: 8 });
    products = data;
  } catch (error) {
    console.error("Erro ao carregar novidades:", error);
  }

  return (
    <ProductSection
      title="Novidades"
      description="Os produtos mais recentes do catálogo"
      products={products}
    />
  );
}
