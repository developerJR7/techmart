"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Gift, LogOut, ShoppingBag, ChevronRight, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    const menuItems = [
        { href: "/profile", label: "Visão Geral", icon: User },
        { href: "/profile/details", label: "Meus Dados", icon: Shield },
        { href: "/orders", label: "Meus Pedidos", icon: ShoppingBag },
        { href: "/profile/addresses", label: "Endereços", icon: MapPin },
        { href: "/profile/loyalty", label: "Fidelidade & Pontos", icon: Gift },
    ];

    const isDashboard = pathname === "/profile";

    return (
        <div className="min-h-screen bg-black text-white py-8" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
            <div className="container mx-auto px-4 max-w-6xl">
                <div className={`flex flex-col ${!isDashboard ? 'md:flex-row' : ''} gap-8`}>
                    {/* Sidebar - Only show on inner pages */}
                    {!isDashboard && (
                        <aside className="w-full md:w-72 shrink-0">
                            <div
                                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-xl p-4 sticky top-24"
                                style={{ backgroundColor: 'rgba(24, 24, 27, 0.5)', borderColor: 'rgba(39, 39, 42, 1)' }}
                            >
                                <nav className="space-y-1">
                                    <div className="px-4 py-2 mb-2">
                                        <h2 className="font-bold text-lg text-white">Minha Conta</h2>
                                    </div>
                                    {menuItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`group flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                                        ? "bg-zinc-800 text-white font-medium border-l-4 border-purple-600"
                                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                                    }`}
                                                style={isActive ? { backgroundColor: 'rgba(39, 39, 42, 1)', borderLeft: '4px solid #7c3aed' } : {}}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="font-medium">{item.label}</span>
                                                </div>
                                                {isActive && <ChevronRight className="h-4 w-4" />}
                                            </Link>
                                        );
                                    })}
                                    <div className="pt-2 mt-2 border-t border-zinc-800" style={{ borderColor: 'rgba(39, 39, 42, 1)' }}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                                            onClick={logout}
                                            style={{ color: '#f87171' }}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sair
                                        </Button>
                                    </div>
                                </nav>
                            </div>
                        </aside>
                    )}

                    {/* Main Content */}
                    <main className="flex-1">
                        {isDashboard ? (
                            // Dashboard Layout (Full Width, Transparent)
                            <div className="min-h-[600px]">
                                {children}
                            </div>
                        ) : (
                            // Inner Page Layout (Card)
                            <div
                                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-xl p-8 min-h-[600px]"
                                style={{ backgroundColor: 'rgba(24, 24, 27, 0.5)', borderColor: 'rgba(39, 39, 42, 1)' }}
                            >
                                {children}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
