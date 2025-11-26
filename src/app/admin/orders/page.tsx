"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  orderItems: Array<{
    product: {
      name: string;
    };
    quantity: number;
    price: number;
  }>;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const { isAdmin, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      router.push("/");
      return;
    }
    fetchOrders();
  }, [isAuthenticated, isAdmin, router]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/all");
      setOrders(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      alert("Erro ao atualizar status");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
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
          <h1 className="text-3xl font-bold mb-8">Gerenciar Pedidos</h1>

          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">Pedido #{order.id.slice(0, 8)}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.user.name} ({order.user.email})
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <p className="text-lg font-bold mt-2">
                        R$ {Number(order.total).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Itens:</h4>
                    <ul className="space-y-1">
                      {order.orderItems.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          {item.product.name} x{item.quantity} - R${" "}
                          {Number(item.price).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                    >
                      <option value="PENDING">Pendente</option>
                      <option value="PROCESSING">Processando</option>
                      <option value="SHIPPED">Enviado</option>
                      <option value="DELIVERED">Entregue</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
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

