"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Plus, Trash2, Edit, Check, X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { adminAIService, GeneratedProduct } from "@/services/admin-ai.service";
import { productsService } from "@/services/products.service";

export default function AIProductsPage() {
    const [category, setCategory] = useState("Smartphones");
    const [quantity, setQuantity] = useState(5);
    const [minPrice, setMinPrice] = useState(500);
    const [maxPrice, setMaxPrice] = useState(3000);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [products, setProducts] = useState<GeneratedProduct[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
    const { toast } = useToast();

    const categories = [
        "Smartphones",
        "Notebooks",
        "Tablets",
        "Smartwatches",
        "Fones de Ouvido",
        "Câmeras",
        "Consoles",
        "Acessórios",
    ];

    const handleGenerate = async () => {
        setLoading(true);
        setProducts([]);
        setSelectedProducts(new Set());

        try {
            const generatedProducts = await adminAIService.generateProductsBulk(quantity, {
                category,
                priceRange: { min: minPrice, max: maxPrice }
            });

            setProducts(generatedProducts);
            // Selecionar todos por padrão
            setSelectedProducts(new Set(generatedProducts.map((_, i) => i)));

            toast({
                title: "Produtos gerados com sucesso!",
                description: `${generatedProducts.length} produtos criados pela IA.`,
                style: { backgroundColor: '#7F5AF0', color: 'white', border: 'none' }
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Erro ao gerar produtos",
                description: "Não foi possível gerar os produtos. Tente novamente.",
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleProduct = (index: number) => {
        const newSelected = new Set(selectedProducts);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedProducts(newSelected);
    };

    const handleSaveProducts = async () => {
        const selectedProductsList = products.filter((_, i) => selectedProducts.has(i));

        if (selectedProductsList.length === 0) {
            toast({
                title: "Nenhum produto selecionado",
                description: "Selecione pelo menos um produto para salvar.",
                variant: "error",
            });
            return;
        }

        setSaving(true);
        let successCount = 0;
        let failCount = 0;

        try {
            // Salvar produtos sequencialmente para evitar sobrecarga
            for (const product of selectedProductsList) {
                try {
                    await productsService.createProduct({
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        categoryId: '1', // TODO: Map category name to actual category ID
                        images: product.imageUrl ? [product.imageUrl] : [],
                        stock: 10,
                        isFeatured: false,
                    });
                    successCount++;
                } catch (err) {
                    console.error(`Erro ao salvar produto ${product.name}:`, err);
                    failCount++;
                }
            }

            if (successCount > 0) {
                toast({
                    title: "Produtos salvos!",
                    description: `${successCount} produtos adicionados ao catálogo.${failCount > 0 ? ` (${failCount} falhas)` : ''}`,
                    style: { backgroundColor: '#10b981', color: 'white', border: 'none' }
                });

                // Remover produtos salvos da lista
                setProducts(prev => prev.filter(p => !selectedProductsList.includes(p)));
                setSelectedProducts(new Set());
            } else {
                throw new Error("Falha ao salvar todos os produtos selecionados.");
            }

        } catch (error) {
            toast({
                title: "Erro ao salvar produtos",
                description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar os produtos.",
                variant: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '20px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Sparkles className="h-8 w-8 text-[#7F5AF0]" />
                            IA Geradora de Produtos
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Crie produtos automaticamente com inteligência artificial
                        </p>
                    </div>
                    <Link href="/admin">
                        <Button variant="outline" className="border-[#7F5AF0] text-[#7F5AF0] hover:bg-[#7F5AF0] hover:text-white">
                            Voltar ao Admin
                        </Button>
                    </Link>
                </div>

                {/* Configuration Card */}
                <Card className="mb-8 bg-[#111] border-[#333]">
                    <CardHeader>
                        <CardTitle className="text-white">Configurar Geração</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Categoria */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Categoria</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-[#333] rounded-md bg-[#1a1a1a] text-white focus:border-[#7F5AF0] outline-none"
                                    disabled={loading || saving}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantidade */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Quantidade (1-50)
                                </label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={50}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    disabled={loading || saving}
                                    className="bg-[#1a1a1a] border-[#333] text-white focus:border-[#7F5AF0]"
                                />
                            </div>

                            {/* Preço Mínimo */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Preço Mínimo (R$)</label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                    disabled={loading || saving}
                                    className="bg-[#1a1a1a] border-[#333] text-white focus:border-[#7F5AF0]"
                                />
                            </div>

                            {/* Preço Máximo */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Preço Máximo (R$)</label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    disabled={loading || saving}
                                    className="bg-[#1a1a1a] border-[#333] text-white focus:border-[#7F5AF0]"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={loading || saving}
                            className="w-full bg-[#7F5AF0] hover:bg-[#6842c2] text-white border-none"
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Gerando produtos...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Gerar Produtos com IA
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Products Preview */}
                {products.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">
                                Produtos Gerados ({products.length})
                            </h2>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedProducts(new Set())}
                                    disabled={saving}
                                    className="border-[#333] text-gray-300 hover:bg-[#333] hover:text-white"
                                >
                                    Desmarcar Todos
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setSelectedProducts(new Set(products.map((_, i) => i)))
                                    }
                                    disabled={saving}
                                    className="border-[#333] text-gray-300 hover:bg-[#333] hover:text-white"
                                >
                                    Selecionar Todos
                                </Button>
                                <Button
                                    onClick={handleSaveProducts}
                                    disabled={selectedProducts.size === 0 || saving}
                                    className="bg-[#10b981] hover:bg-[#059669] text-white border-none"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Salvar Selecionados ({selectedProducts.size})
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product, index) => (
                                <Card
                                    key={index}
                                    className={`relative bg-[#111] border-[#333] ${selectedProducts.has(index)
                                        ? "ring-2 ring-[#7F5AF0]"
                                        : "opacity-80"
                                        }`}
                                >
                                    {/* Checkbox */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.has(index)}
                                            onChange={() => toggleProduct(index)}
                                            disabled={saving}
                                            className="w-5 h-5 cursor-pointer accent-[#7F5AF0]"
                                        />
                                    </div>

                                    <CardContent className="p-4">
                                        {/* Image */}
                                        <div className="relative w-full h-48 mb-4 bg-[#1a1a1a] rounded-lg overflow-hidden">
                                            {product.imageUrl ? (
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-500">
                                                    Sem imagem
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-lg line-clamp-2 text-white">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-400 line-clamp-3">
                                                {product.description}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-[#10b981]">
                                                    R$ {product.price.toFixed(2)}
                                                </span>
                                                <Badge className="bg-[#1a1a1a] text-gray-300 border-[#333]">{category}</Badge>
                                            </div>

                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {product.suggestedTags?.slice(0, 3).map(tag => (
                                                    <span key={tag} className="text-xs bg-[#333] text-gray-300 px-2 py-1 rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {products.length === 0 && !loading && (
                    <Card className="p-12 text-center bg-[#111] border-[#333]">
                        <Sparkles className="h-16 w-16 text-[#333] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-white">
                            Nenhum produto gerado ainda
                        </h3>
                        <p className="text-gray-500">
                            Configure os parâmetros acima e clique em "Gerar Produtos com IA"
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}
