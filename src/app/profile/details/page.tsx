"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usersService, UserProfile } from "@/services/users.service";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function ProfileDetailsPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await usersService.getProfile();
                setProfile(data);
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    if (loading) {
        return <div className="space-y-4">
            <Skeleton className="h-8 w-1/3 bg-zinc-800" />
            <Skeleton className="h-32 w-full bg-zinc-800" />
        </div>;
    }

    if (!profile) return null;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Dados Pessoais</h2>
                <p className="text-zinc-400">Gerencie suas informações básicas e de contato.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">Nome Completo</label>
                    <div className="flex items-center gap-3 p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white group hover:border-purple-500/50 transition-colors">
                        <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                            <User className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{profile.name}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">E-mail</label>
                    <div className="flex items-center gap-3 p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white group hover:border-purple-500/50 transition-colors">
                        <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                            <Mail className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{profile.email}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">Tipo de Conta</label>
                    <div className="flex items-center gap-3 p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white group hover:border-purple-500/50 transition-colors">
                        <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                            <Shield className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{profile.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">Membro desde</label>
                    <div className="flex items-center gap-3 p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white group hover:border-purple-500/50 transition-colors">
                        <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <span className="font-medium">
                            {format(new Date(profile.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
