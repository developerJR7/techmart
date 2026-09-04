"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { Package, Clock, CheckCircle, XCircle, Truck, ArrowLeft, MapPin, CreditCard, Barcode, QrCode } from "lucide-react";
import { ordersService } from "@/services/orders.service";
import { Order } from "@/types/api.types";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const statusConfig = {
    PENDING: { label: "Pendente", icon: Clock, color: "text-yellow-600" },
    PROCESSING: { label: "Processando", icon: Package, color: "text-blue-600" },
    SHIPPED: { label: "Enviado", icon: Truck, color: "text-purple-600" },
    DELIVERED: { label: "Entregue", icon: CheckCircle, color: "text-green-600" },
    CANCELLED: { label: "Cancelado", icon: XCircle, color: "text-red-600" },
};

const paymentMethodConfig = {
    CARD: { label: "Cartão de Crédito", icon: CreditCard },
    BOLETO: { label: "Boleto", icon: Barcode },
    PIX: { label: "PIX", icon: QrCode },
};

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { toast } = useToast();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }
        fetchOrder();
    }, [isAuthenticated, router, params.id]);

    const fetchOrder = async () => {
        try {
            const data = await ordersService.getOrderById(params.id);
            setOrder(data);
        } catch (error) {
            console.error("Erro ao carregar pedido:", error);
            toast({
                variant: "error",
                title: "Erro ao carregar pedido",
                description: "Não foi possível carregar os detalhes do pedido."
            });
            router.push("/orders");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const handleCancelOrder = async () => {
        if (!order) return;

        if (!confirm("Tem certeza que deseja cancelar este pedido?")) return;

        setCancelling(true);
        try {
            const updatedOrder = await ordersService.cancelOrder(order.id);
            setOrder(updatedOrder);
            toast({
                title: "Pedido cancelado",
                description: "Seu pedido foi cancelado com sucesso.",
                style: { backgroundColor: '#7F5AF0', color: 'white', border: 'none' }
            });
        } catch (error) {
            toast({
                variant: "error",
                title: "Erro ao cancelar pedido",
                description: "Não foi possível cancelar o pedido. Tente novamente."
            });
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 py-8">
                    <div className="container mx-auto px-4">
                        <Skeleton className="h-12 w-64 mb-8" />
                        <Skeleton className="h-96 w-full" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!order) return null;

    const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package;
    const statusLabel = statusConfig[order.status as keyof typeof statusConfig]?.label || order.status;
    const statusColor = statusConfig[order.status as keyof typeof statusConfig]?.color || "text-gray-600";

    const paymentMethod = order.payment?.method;
    const PaymentIcon = paymentMethod ? (paymentMethodConfig[paymentMethod]?.icon || CreditCard) : Clock;
    const paymentLabel = paymentMethod ? (paymentMethodConfig[paymentMethod]?.label || paymentMethod) : "Pagamento não iniciado";

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <Link href="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                        <ArrowLeft size={20} />
                        Voltar para meus pedidos
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Detalhes do Pedido */}
                        <div className="flex-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-2xl">
                                                Pedido #{order.id.slice(0, 8)}
                                            </CardTitle>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                Realizado em {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <div className={`flex items-center gap-2 ${statusColor} bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full`}>
                                                <StatusIcon className="h-5 w-5" />
                                                <span className="font-semibold">{statusLabel}</span>
                                            </div>
                                            {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                                                <Button
                                                    variant="outline"
                                                    onClick={handleCancelOrder}
                                                    disabled={cancelling}
                                                    className="border-red-500 text-red-500 hover:bg-red-50"
                                                >
                                                    {cancelling ? "Cancelando..." : "Cancelar Pedido"}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-lg">Itens do Pedido</h3>
                                            {order.orderItems.map((item) => (
                                                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                                    {/* Imagem do produto se disponível na API */}
                                                    {/* <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                                                        <Package className="h-8 w-8 text-gray-400" />
                                                    </div> */}
                                                    <div className="flex-1">
                                                        <p className="font-medium text-lg">{item.product.name}</p>
                                                        <p className="text-gray-600 dark:text-gray-400">
                                                            {item.quantity}x {formatPrice(item.price)}
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold text-lg">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Resumo e Endereço */}
                        <div className="lg:w-1/3 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Resumo do Pedido</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(order.subtotal)}</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>Desconto</span>
                                            <span>-{formatPrice(order.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-600">
                                        <span>Frete</span>
                                        <span>{order.shippingCost > 0 ? formatPrice(order.shippingCost) : "Grátis"}</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                        <span className="font-semibold text-lg">Total</span>
                                        <span className="font-bold text-2xl text-[#1E90FF]">
                                            {formatPrice(order.total)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Endereço de Entrega
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        {order.address.street}, {order.address.number}
                                        {order.address.complement ? ` - ${order.address.complement}` : ''}
                                    </p>
                                    <p className="text-gray-600">
                                        {order.address.neighborhood} - {order.address.city}/{order.address.state}
                                    </p>
                                    <p className="text-gray-600">CEP: {order.address.zipCode}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PaymentIcon className="h-5 w-5" />
                                        Pagamento
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-medium">{paymentLabel}</p>
                                    {order.payment && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Status do pagamento: {order.payment.status}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
