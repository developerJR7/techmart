"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";

const categorySchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type CategoryForm = z.infer<typeof categorySchema>;

export default function NewCategoryPage() {
  const router = useRouter();
  const { isAdmin, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, isAdmin, router]);

  const onSubmit = async (data: CategoryForm) => {
    setError("");
    setLoading(true);
    try {
      await api.post("/categories", data);
      router.push("/admin/categories");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Nova Categoria</h1>

          <Card>
            <CardHeader>
              <CardTitle>Criar Categoria</CardTitle>
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
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    {...register("isActive")}
                    type="checkbox"
                    id="isActive"
                    className="w-4 h-4"
                    defaultChecked
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Categoria ativa
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Criando..." : "Criar Categoria"}
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

