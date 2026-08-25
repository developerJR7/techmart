"use client";

import { useEffect, useState } from "react";
import { loyaltyService, LoyaltyProfile } from "@/services/loyalty.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift, TrendingUp, History, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function LoyaltyPage() {
    const [profile, setProfile] = useState<LoyaltyProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadLoyalty() {
            try {
                const data = await loyaltyService.getProfile();
                setProfile(data);
            } catch (error) {
                console.error("Failed to load loyalty profile", error);
            } finally {
                setLoading(false);
            }
        }
        loadLoyalty();
    }, []);

    if (loading) {
        return <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-3xl bg-zinc-800" />
            <Skeleton className="h-64 w-full rounded-3xl bg-zinc-800" />
        </div>;
    }

    if (!profile) return null;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Programa de Fidelidade</h2>
                <p className="text-zinc-400">Acompanhe seus pontos e troque por recompensas exclusivas.</p>
            </div>

            {/* Points Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900 rounded-3xl p-8 text-white shadow-2xl shadow-purple-900/20 border border-white/10">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Gift className="h-64 w-64 transform rotate-12 translate-x-12 -translate-y-12" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <Sparkles className="h-5 w-5 text-yellow-400" />
                            <span className="font-medium">TechMart Rewards</span>
                        </div>
                        <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/10">
                            Nível {profile.tier}
                        </span>
                    </div>

                    <div className="mb-2">
                        <span className="text-6xl font-bold tracking-tight">{profile.points}</span>
                        <span className="text-xl opacity-80 ml-2">pontos</span>
                    </div>

                    <p className="text-blue-100 font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Total acumulado na vida: {profile.lifetimePoints} pontos
                    </p>
                </div>
            </div>

            {/* History */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                        <History className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Histórico de Pontos</h3>
                </div>

                <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl overflow-hidden">
                    {profile.history.length === 0 ? (
                        <div className="p-12 text-center">
                            <Gift className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500">Nenhuma movimentação ainda. Faça compras para ganhar pontos!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-800">
                            {profile.history.map((item) => (
                                <div key={item.id} className="p-6 flex items-center justify-between hover:bg-zinc-900/50 transition-colors group">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-3 rounded-xl ${item.type === 'EARN' ? 'bg-green-500/10 text-green-400' :
                                                item.type === 'REDEEM' ? 'bg-red-500/10 text-red-400' : 'bg-zinc-800 text-zinc-400'
                                            }`}>
                                            <TrendingUp className={`h-5 w-5 ${item.type === 'REDEEM' ? 'rotate-180' : ''}`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white group-hover:text-purple-400 transition-colors">{item.description}</p>
                                            <p className="text-sm text-zinc-500">
                                                {format(new Date(item.createdAt), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`font-bold text-lg ${item.type === 'EARN' ? 'text-green-400' :
                                            item.type === 'REDEEM' ? 'text-red-400' : 'text-white'
                                        }`}>
                                        {item.type === 'EARN' ? '+' : '-'}{item.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
