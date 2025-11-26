"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth-store";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import api from "@/lib/api";

interface Order {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    items: {
        id: string;
        quantity: number;
        price: number;
        product: {
            name: string;
            image?: string;
        };
    }[];
}

const statusConfig = {
    PENDING: { label: "Pendente", icon: Clock, color: "text-yellow-600" },
    PROCESSING: { label: "Processando", icon: Package, color: "text-blue-600" },
    SHIPPED: { label: "Enviado", icon: Truck, color: "text-purple-600" },
    DELIVERED: { label: "Entregue", icon: CheckCircle, color: "text-green-600" },
    CANCELLED: { label: "Cancelado", icon: XCircle, color: "text-red-600" },
};

export default function OrdersPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }
        fetchOrders();
    }, [isAuthenticated, router]);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders");
            setOrders(response.data);
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 py-8">
                    <div className="container mx-auto px-4">
                        <Skeleton className="h-12 w-64 mb-8" />
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-48" />
                            ))}
                        </div>
                    </div>
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
                    <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

                    {orders.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Você ainda não fez nenhum pedido.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => {
                                const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package;
                                const statusLabel = statusConfig[order.status as keyof typeof statusConfig]?.label || order.status;
                                const statusColor = statusConfig[order.status as keyof typeof statusConfig]?.color || "text-gray-600";

                                return (
                                    <Card key={order.id}>
                                        <CardHeader>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        Pedido #{order.id.slice(0, 8)}
                                                    </CardTitle>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                </div>
                                                <div className={`flex items-center gap-2 ${statusColor}`}>
                                                    <StatusIcon className="h-5 w-5" />
                                                    <span className="font-semibold">{statusLabel}</span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {/* Itens do Pedido */}
                                                <div className="space-y-3">
                                                    {order.items.map((item) => (
                                                        <div key={item.id} className="flex items-center gap-4 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                                            <div className="flex-1">
                                                                <p className="font-medium">{item.product.name}</p>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                    Quantidade: {item.quantity} × {formatPrice(item.price)}
                                                                </p>
                                                            </div>
                                                            <p className="font-semibold">
                                                                {formatPrice(item.price * item.quantity)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Total */}
                                                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                                    <span className="text-lg font-semibold">Total</span>
                                                    <span className="text-2xl font-bold text-[#1E90FF]">
                                                        {formatPrice(order.total)}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
