"use client";

import Link from "next/link";
import { User, MapPin, Gift, ShoppingBag, Shield, CreditCard, Headphones, MessageSquare } from "lucide-react";

export default function ProfileDashboard() {
    const cards = [
        {
            href: "/orders",
            title: "Seus pedidos",
            description: "Rastrear, devolver ou comprar produtos novamente",
            icon: ShoppingBag
        },
        {
            href: "/profile/details",
            title: "Acesso e segurança",
            description: "Gerenciar senha, e-mail, CPF e número de celular",
            icon: Shield
        },
        {
            href: "/profile/loyalty",
            title: "Prime",
            description: "Gerenciar sua assinatura, ver os benefícios e as configurações de pagamento",
            icon: Gift
        },
        {
            href: "/profile/addresses",
            title: "Seus endereços",
            description: "Alterar endereços para pedidos e presentes",
            icon: MapPin
        },
        {
            href: "/profile", // Placeholder
            title: "Seus pagamentos",
            description: "Gerenciar ou adicionar formas de pagamento e ver suas transações",
            icon: CreditCard
        },
        {
            href: "/profile", // Placeholder
            title: "Vales-presente",
            description: "Ver saldo ou resgatar um vale-presente",
            icon: Gift
        },
        {
            href: "/profile", // Placeholder
            title: "Reembolsos Boleto/Pix",
            description: "Ver saldo ou resgatar reembolsos de Boleto e Pix",
            icon: CreditCard
        },
        {
            href: "/profile", // Placeholder
            title: "Atendimento ao Cliente",
            description: "Explorar opções de autoatendimento, artigos de ajuda ou fale conosco",
            icon: Headphones
        },
        {
            href: "/profile", // Placeholder
            title: "Suas mensagens",
            description: "Visualize ou responda às mensagens da Amazon, vendedores e compradores",
            icon: MessageSquare
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white mb-6">Sua conta</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={index}
                            href={card.href}
                            className="group p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-all duration-200 flex items-start gap-4"
                            style={{ backgroundColor: 'rgba(24, 24, 27, 0.5)', borderColor: 'rgba(39, 39, 42, 1)' }}
                        >
                            <div className="shrink-0 pt-1">
                                <Icon className="h-12 w-12 text-purple-500" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[17px] text-white mb-1 group-hover:underline decoration-purple-500 underline-offset-2">
                                    {card.title}
                                </h3>
                                <p className="text-[13px] text-zinc-400 leading-snug">
                                    {card.description}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
