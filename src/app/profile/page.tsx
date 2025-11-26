"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/hooks/use-toast";
import { User, Mail, Lock, Save } from "lucide-react";
import api from "@/lib/api";

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
            });
        }
    }, [user, isAuthenticated, router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put("/users/profile", formData);
            toast({
                title: "Perfil atualizado!",
                description: "Suas informações foram atualizadas com sucesso.",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Erro ao atualizar perfil",
                description: "Tente novamente mais tarde.",
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({
                title: "Senhas não coincidem",
                description: "A nova senha e a confirmação devem ser iguais.",
                variant: "error",
            });
            return;
        }

        setLoading(true);
        try {
            await api.put("/users/password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast({
                title: "Senha alterada!",
                description: "Sua senha foi atualizada com sucesso.",
                variant: "success",
            });
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            toast({
                title: "Erro ao alterar senha",
                description: "Verifique sua senha atual e tente novamente.",
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 py-8">
                    <div className="container mx-auto px-4">
                        <Skeleton className="h-12 w-64 mb-8" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Skeleton className="h-96" />
                            <Skeleton className="h-96" />
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
                    <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Informações Pessoais */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informações Pessoais
                                </CardTitle>
                                <CardDescription>
                                    Atualize suas informações de perfil
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome Completo</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" disabled={loading} className="w-full">
                                        <Save className="mr-2 h-4 w-4" />
                                        {loading ? "Salvando..." : "Salvar Alterações"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Alterar Senha */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    Alterar Senha
                                </CardTitle>
                                <CardDescription>
                                    Mantenha sua conta segura
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Senha Atual</Label>
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">Nova Senha</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <Button type="submit" disabled={loading} className="w-full">
                                        <Lock className="mr-2 h-4 w-4" />
                                        {loading ? "Alterando..." : "Alterar Senha"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Informações da Conta */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Informações da Conta</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Tipo de Conta</p>
                                    <p className="font-semibold">{user.role === "ADMIN" ? "Administrador" : "Cliente"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">ID do Usuário</p>
                                    <p className="font-mono text-xs">{user.id}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
