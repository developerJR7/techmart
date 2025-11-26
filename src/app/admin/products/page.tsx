"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { Plus, Edit, Trash2 } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { isAdmin, isAuthenticated } = useAuthStore();
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
      const response = await api.get("/products?limit=100");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este produto?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      alert("Erro ao remover produto");
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

