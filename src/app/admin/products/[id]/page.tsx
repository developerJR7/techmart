"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";

const productSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  price: z.number().min(0, "Preço deve ser maior que 0"),
  stock: z.number().min(0, "Estoque deve ser maior ou igual a 0"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type ProductForm = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { isAdmin, isAuthenticated } = useAuthStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      router.push("/");
      return;
    }
    fetchCategories();
    fetchProduct();
  }, [isAuthenticated, isAdmin, router, id]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      const product = response.data;
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("price", Number(product.price));
      setValue("stock", product.stock);
      setValue("categoryId", product.categoryId);
      setValue("isFeatured", product.isFeatured);
      setValue("isActive", product.isActive);
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
      setError("Erro ao carregar produto");
    } finally {
      setLoadingProduct(false);
    }
  };

  const onSubmit = async (data: ProductForm) => {
    setError("");
    setLoading(true);
    try {
      await api.patch(`/products/${id}`, data);
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
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
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Editar Produto</h1>

          <Card>
            <CardHeader>
              <CardTitle>Editar Produto</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <input
                    {...register("name")}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descrição</label>
                  <textarea
                    {...register("description")}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Preço</label>
                    <input
                      {...register("price", { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                    />
                    {errors.price && (
                      <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Estoque</label>
                    <input
                      {...register("stock", { valueAsNumber: true })}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <select
                    {...register("categoryId")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      {...register("isFeatured")}
                      type="checkbox"
                      id="isFeatured"
                      className="w-4 h-4"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-medium">
                      Produto em destaque
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      {...register("isActive")}
                      type="checkbox"
                      id="isActive"
                      className="w-4 h-4"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium">
                      Produto ativo
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

