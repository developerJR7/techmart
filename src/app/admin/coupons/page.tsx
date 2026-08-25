"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Ticket, Plus, Trash2, Edit, Calendar, Percent } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import Link from "next/link";

interface Coupon {
    id: string;
    code: string;
    type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
    value: number;
    expiresAt: string;
    usageLimit: number;
    usageCount: number;
    active: boolean;
}

export default function AdminCouponsPage() {
    const { toast } = useToast();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const data = await adminService.getCoupons();
            setCoupons(data);
        } catch (error) {
            console.error("Erro ao carregar cupons:", error);
            toast({
                variant: "error",
                title: "Erro ao carregar cupons",
                description: "Não foi possível carregar a lista de cupons."
            });
        } finally {
            setLoading(false);
        }
    };

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        type: "PERCENTAGE" as Coupon["type"],
        value: 0,
        expiresAt: "",
        usageLimit: 100,
    });

    const handleCreate = async () => {
        try {
            await adminService.createCoupon({
                code: formData.code,
                type: formData.type,
                value: formData.value,
                expiresAt: formData.expiresAt,
                usageLimit: formData.usageLimit,
                isActive: true
            });
            toast({
                title: "Cupom criado!",
                description: "O cupom foi criado com sucesso.",
                style: { backgroundColor: '#7F5AF0', color: 'white', border: 'none' }
            });
            setShowForm(false);
            setFormData({
                code: "",
                type: "PERCENTAGE",
                value: 0,
                expiresAt: "",
                usageLimit: 100,
            });
            fetchCoupons();
        } catch (error) {
            console.error("Erro ao criar cupom:", error);
            toast({
                variant: "error",
                title: "Erro ao criar cupom",
                description: "Não foi possível criar o cupom."
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja remover este cupom?")) return;
        try {
            await adminService.deleteCoupon(id);
            toast({
                title: "Cupom removido!",
                description: "O cupom foi removido com sucesso.",
                style: { backgroundColor: '#7F5AF0', color: 'white', border: 'none' }
            });
            fetchCoupons();
        } catch (error) {
            console.error("Erro ao remover cupom:", error);
            toast({
                variant: "error",
                title: "Erro ao remover cupom",
                description: "Não foi possível remover o cupom."
            });
        }
    };

    const toggleActive = async (id: string) => {
        try {
            const coupon = coupons.find(c => c.id === id);
            if (!coupon) return;

            await adminService.updateCoupon(id, { isActive: !coupon.active });
            fetchCoupons();
        } catch (error) {
            console.error("Erro ao atualizar cupom:", error);
            toast({
                variant: "error",
                title: "Erro ao atualizar cupom",
                description: "Não foi possível atualizar o cupom."
            });
        }
    };

    const getTypeLabel = (type: Coupon["type"]) => {
        switch (type) {
            case "PERCENTAGE":
                return "Percentual";
            case "FIXED":
                return "Valor Fixo";
            case "FREE_SHIPPING":
                return "Frete Grátis";
        }
    };

    const getTypeColor = (type: Coupon["type"]) => {
        switch (type) {
            case "PERCENTAGE":
                return "bg-blue-100 text-blue-700";
            case "FIXED":
                return "bg-green-100 text-green-700";
            case "FREE_SHIPPING":
                return "bg-purple-100 text-purple-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cupons de Desconto</h1>
                        <p className="text-gray-500 dark:text-gray-400">Gerencie cupons e promoções</p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Novo Cupom
                    </Button>
                </div>

                {/* Form */}
                {showForm && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Criar Novo Cupom</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Código do Cupom</label>
                                    <Input
                                        placeholder="Ex: BEMVINDO10"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tipo</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as Coupon["type"] })}
                                    >
                                        <option value="PERCENTAGE">Percentual (%)</option>
                                        <option value="FIXED">Valor Fixo (R$)</option>
                                        <option value="FREE_SHIPPING">Frete Grátis</option>
                                    </select>
                                </div>
                                {formData.type !== "FREE_SHIPPING" && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Valor {formData.type === "PERCENTAGE" ? "(%)" : "(R$)"}
                                        </label>
                                        <Input
                                            type="number"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Data de Expiração</label>
                                    <Input
                                        type="date"
                                        value={formData.expiresAt}
                                        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Limite de Uso</label>
                                    <Input
                                        type="number"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleCreate}>Criar Cupom</Button>
                                <Button variant="outline" onClick={() => setShowForm(false)}>
                                    Cancelar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Coupons List */}
                <div className="grid gap-4">
                    {coupons.map((coupon) => (
                        <Card key={coupon.id} className={!coupon.active ? "opacity-60" : ""}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Ticket className="h-5 w-5 text-purple-600" />
                                            <h3 className="text-xl font-bold font-mono">{coupon.code}</h3>
                                            <Badge className={getTypeColor(coupon.type)}>{getTypeLabel(coupon.type)}</Badge>
                                            {!coupon.active && <Badge variant="secondary">Inativo</Badge>}
                                        </div>
                                        <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {coupon.type === "PERCENTAGE" && `${coupon.value}% OFF`}
                                                    {coupon.type === "FIXED" && `R$ ${coupon.value.toFixed(2)} OFF`}
                                                    {coupon.type === "FREE_SHIPPING" && "Frete Grátis"}
                                                </p>
                                                <p className="text-xs">Desconto</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {coupon.usageCount} / {coupon.usageLimit}
                                                </p>
                                                <p className="text-xs">Usos</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {new Date(coupon.expiresAt).toLocaleDateString("pt-BR")}
                                                </p>
                                                <p className="text-xs">Expira em</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {new Date(coupon.expiresAt) > new Date() ? "Válido" : "Expirado"}
                                                </p>
                                                <p className="text-xs">Status</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => toggleActive(coupon.id)}
                                            title={coupon.active ? "Desativar" : "Ativar"}
                                        >
                                            {coupon.active ? "✓" : "✗"}
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => handleDelete(coupon.id)} className="text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
