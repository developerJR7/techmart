"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { Plus, Edit, Trash2 } from "lucide-react";
import { productsService } from "@/services/products.service";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/api.types";
import Link from "next/link";

export default function AdminProductsPage() {
  const router = useRouter();
  const { isAdmin, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      router.push("/");
      return;
    }
    fetchProducts();
  }, [isAuthenticated, isAdmin, router]);

  const fetchProducts = async () => {
    try {
      const response = await productsService.getProducts({ limit: 100 });
      setProducts(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast({
        variant: "error",
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar a lista de produtos."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este produto?")) return;
    try {
      await adminService.deleteProduct(id);
      toast({
        title: "Produto removido!",
        description: "O produto foi removido com sucesso.",
        style: { backgroundColor: '#7F5AF0', color: 'white', border: 'none' }
      });
      fetchProducts();
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      toast({
        variant: "error",
        title: "Erro ao remover produto",
        description: "Não foi possível remover o produto."
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div>Carregando...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        R$ {Number(product.price).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} • Estoque: {product.stock} •{" "}
                        {product.isFeatured && "⭐ Destaque"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

