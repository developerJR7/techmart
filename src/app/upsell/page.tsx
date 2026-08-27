"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, ShieldCheck, Star, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/hooks/use-toast";

export default function UpsellPage() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [loading, setLoading] = useState(false);
    const { addItem } = useCartStore();
    const { toast } = useToast();

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAcceptOffer = async () => {
        setLoading(true);

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Add upsell item to cart (simulating adding to order)
        addItem({
            id: "upsell-warranty-plus",
            name: "Garantia Estendida Premium + Suporte VIP",
            price: 49.90,
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=400&h=400&fit=crop",
            slug: "garantia-estendida-premium",
            quantity: 1
        });

        toast({
            title: "Oferta adicionada com sucesso!",
            description: "Seu pedido foi atualizado.",
            duration: 3000,
        });

        router.push("/success?session_id=upsell_accepted");
    };

    const handleDeclineOffer = () => {
        router.push("/success");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                        <span>Carrinho</span>
                        <span>Pagamento</span>
                        <span className="text-purple-600 font-bold">Oferta Especial</span>
                        <span>Conclusão</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 w-3/4 transition-all duration-500"></div>
                    </div>
                </div>

                <Card className="border-2 border-purple-500 shadow-2xl overflow-hidden relative">
                    {/* Urgency Banner */}
                    <div className="bg-purple-600 text-white p-3 text-center font-bold flex items-center justify-center gap-2 animate-pulse">
                        <Clock className="h-5 w-5" />
                        Oferta expira em: {formatTime(timeLeft)}
                    </div>

                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-bold inline-flex items-center gap-1 mb-4">
                            <CheckCircle className="h-4 w-4" />
                            Pagamento Aprovado!
                        </div>
                        <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            ESPERE! Não feche essa página!
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Temos uma oferta exclusiva de **One-Click Upsell** para você.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-6 items-center">
                            <div className="relative w-48 h-48 flex-shrink-0">
                                <Image
                                    src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=400&h=400&fit=crop"
                                    alt="Garantia Premium"
                                    fill
                                    className="object-cover rounded-lg"
                                />
                                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    50% OFF
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold mb-2">Garantia Estendida Premium + Suporte VIP</h3>
                                <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    ))}
                                    <span className="text-xs text-gray-500 ml-1">(4.9/5)</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                    Proteja sua compra por mais 2 anos contra defeitos, quedas acidentais e líquidos. Inclui suporte técnico prioritário 24/7.
                                </p>
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <span className="text-gray-400 line-through text-lg">R$ 99,90</span>
                                    <span className="text-3xl font-bold text-green-600">R$ 49,90</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-sm text-gray-600 dark:text-gray-400 flex gap-3">
                            <ShieldCheck className="h-10 w-10 text-purple-600 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white mb-1">Segurança Garantida</p>
                                <p>Não é necessário digitar seus dados novamente. O valor será adicionado ao seu pedido atual com apenas um clique.</p>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-900/50 p-6">
                        <Button
                            size="lg"
                            className="w-full text-lg font-bold h-14 bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                            onClick={handleAcceptOffer}
                            disabled={loading}
                        >
                            {loading ? (
                                "Processando..."
                            ) : (
                                <>
                                    SIM! Adicionar ao meu pedido <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                        <button
                            onClick={handleDeclineOffer}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors"
                            disabled={loading}
                        >
                            Não, obrigado. Quero apenas finalizar meu pedido original.
                        </button>
                    </CardFooter>
                </Card>

                <div className="text-center mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs">
                    <ShieldCheck className="h-3 w-3" />
                    Checkout Seguro 3.1 • Criptografia SSL 256-bits
                </div>
            </div>
        </div>
    );
}
