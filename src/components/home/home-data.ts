import { cache } from "react";
import { productsService } from "@/services/products.service";

// A Home busca "destaque" duas vezes (Hero + seção "Produtos em destaque").
// `cache()` deduplica as duas chamadas dentro da mesma requisição de
// servidor, então só sai 1 GET /products/featured por carregamento de página.
export const getFeaturedProductsCached = cache(() => productsService.getFeaturedProducts());
