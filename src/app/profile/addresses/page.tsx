"use client";

import { useEffect, useState } from "react";
import { addressesService, Address } from "@/services/addresses.service";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MapPin, Check, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        loadAddresses();
    }, []);

    async function loadAddresses() {
        try {
            const data = await addressesService.findAll();
            setAddresses(data);
        } catch (error) {
            console.error("Failed to load addresses", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja excluir este endereço?")) return;
        try {
            await addressesService.remove(id);
            setAddresses(addresses.filter(a => a.id !== id));
            toast({ title: "Endereço removido com sucesso" });
        } catch (error) {
            toast({ variant: "error", title: "Erro ao remover endereço" });
        }
    }

    async function handleSetDefault(id: string) {
        try {
            await addressesService.setDefault(id);
            setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
            toast({ title: "Endereço padrão atualizado" });
        } catch (error) {
            toast({ variant: "error", title: "Erro ao atualizar padrão" });
        }
    }

    if (loading) {
        return <div className="space-y-4">
            <Skeleton className="h-32 w-full bg-zinc-800" />
            <Skeleton className="h-32 w-full bg-zinc-800" />
        </div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Meus Endereços</h2>
                    <p className="text-zinc-400">Gerencie seus endereços de entrega.</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Endereço
                </Button>
            </div>

            {addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-zinc-950/50 border border-dashed border-zinc-800 rounded-3xl">
                    <div className="p-4 bg-zinc-900 rounded-full mb-4">
                        <MapPin className="h-8 w-8 text-zinc-500" />
                    </div>
                    <p className="text-zinc-400 font-medium">Você ainda não tem endereços cadastrados.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className={`p-6 rounded-2xl border transition-all duration-200 ${address.isDefault
                                    ? 'border-purple-500/50 bg-purple-500/5 shadow-lg shadow-purple-900/10'
                                    : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-700'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${address.isDefault ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-900 text-zinc-500'}`}>
                                        <Home className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-white text-lg">{address.street}, {address.number}</span>
                                            {address.isDefault && (
                                                <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-medium border border-purple-500/20">
                                                    Padrão
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-zinc-400">{address.neighborhood} - {address.city}/{address.state}</p>
                                        <p className="text-zinc-500 text-sm font-mono">CEP: {address.zipCode}</p>
                                        {address.complement && <p className="text-zinc-500 text-sm mt-2 flex items-center gap-2"><div className="w-1 h-1 bg-zinc-600 rounded-full"></div> {address.complement}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!address.isDefault && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSetDefault(address.id)}
                                            className="text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg"
                                            title="Definir como padrão"
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            Definir Padrão
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                        onClick={() => handleDelete(address.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
