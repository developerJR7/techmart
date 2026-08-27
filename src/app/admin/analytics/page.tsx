"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, BarChart2, Globe, Share2, Mail, Zap, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { AdminAIAssistant } from "@/components/admin-ai-assistant";
import { adminService } from "@/services/admin.service";

// Mock Data for Campaigns
const campaignData = [
    { name: 'Campanha Verão', clicks: 4000, conversions: 240, cost: 1200, revenue: 8500 },
    { name: 'Promoção Relâmpago', clicks: 3000, conversions: 180, cost: 800, revenue: 6200 },
    { name: 'Lançamento Tech', clicks: 2000, conversions: 150, cost: 1500, revenue: 12000 },
    { name: 'Retargeting', clicks: 1500, conversions: 120, cost: 600, revenue: 4500 },
];

const trafficSourceData = [
    { name: 'Google Ads', value: 45, color: '#4285F4' },
    { name: 'Facebook/Insta', value: 30, color: '#E1306C' },
    { name: 'Email Marketing', value: 15, color: '#F4B400' },
    { name: 'Direto/Orgânico', value: 10, color: '#0F9D58' },
];

const dailyPerformance = [
    { day: 'Seg', visits: 1200, sales: 45 },
    { day: 'Ter', visits: 1350, sales: 52 },
    { day: 'Qua', visits: 1400, sales: 58 },
    { day: 'Qui', visits: 1600, sales: 65 },
    { day: 'Sex', visits: 1800, sales: 85 },
    { day: 'Sáb', visits: 2200, sales: 95 },
    { day: 'Dom', visits: 2100, sales: 88 },
];

export default function AnalyticsPage() {
    const [connectedTools, setConnectedTools] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dashboardData = await adminService.getDashboardMetrics();
                setData(dashboardData);
            } catch (error) {
                console.error('Erro ao carregar analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleConnection = (tool: string) => {
        // setLoading(true); // Don't block UI for toggle
        // Simulate API call
        setTimeout(() => {
            setConnectedTools(prev =>
                prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
            );
            // setLoading(false);
        }, 1000);
    };

    // Use API data or fallback to mock
    const performanceData = data?.dailyPerformance || dailyPerformance;
    const sourcesData = data?.trafficSources || trafficSourceData;
    const campaigns = data?.campaigns || campaignData;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics & Marketing</h1>
                        <p className="text-gray-500 dark:text-gray-400">Rastreamento avançado e otimização de campanhas</p>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-8">
                    <TabsList>
                        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                        <TabsTrigger value="integrations">Integrações</TabsTrigger>
                        <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-8">
                        {/* AI Assistant for Analytics */}
                        <Card className="border-purple-500/20 bg-purple-50/50 dark:bg-purple-900/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                                    <Zap className="h-5 w-5" />
                                    Insights de Marketing (IA)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-semibold mb-2">Análise Automática</h3>
                                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                                <span>O ROI da campanha "Lançamento Tech" está 40% acima da média. Recomendamos aumentar o orçamento.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                                <span>A taxa de conversão no mobile caiu 5% esta semana. Verifique a velocidade de carregamento.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                                <span>Email Marketing tem a melhor taxa de retenção. Crie uma nova sequência para clientes inativos.</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                        <p className="text-sm font-medium mb-2">Pergunte à IA sobre suas campanhas:</p>
                                        <AdminAIAssistant analyticsData={data || {
                                            totalRevenue: 31200,
                                            totalOrders: 695,
                                            totalProducts: 48,
                                            totalCustomers: 520,
                                            salesByMonth: [],
                                            topProducts: []
                                        }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tráfego vs Vendas (Últimos 7 dias)</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={performanceData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis yAxisId="left" />
                                            <YAxis yAxisId="right" orientation="right" />
                                            <Tooltip />
                                            <Legend />
                                            <Line yAxisId="left" type="monotone" dataKey="visits" stroke="#8884d8" name="Visitas" />
                                            <Line yAxisId="right" type="monotone" dataKey="sales" stroke="#82ca9d" name="Vendas" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Fontes de Tráfego</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={sourcesData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {sourcesData.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Integrations Tab */}
                    <TabsContent value="integrations">
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { id: 'ga4', name: 'Google Analytics 4', icon: BarChart2, desc: 'Rastreamento completo de tráfego e comportamento.' },
                                { id: 'meta', name: 'Meta Pixel (Facebook)', icon: Share2, desc: 'Rastreamento de conversões para anúncios.' },
                                { id: 'hotjar', name: 'Hotjar', icon: Globe, desc: 'Mapas de calor e gravação de sessões.' },
                                { id: 'mailchimp', name: 'Mailchimp', icon: Mail, desc: 'Sincronização de contatos e automação de email.' },
                            ].map((tool) => (
                                <Card key={tool.id}>
                                    <CardHeader>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                <tool.icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                            </div>
                                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                                        </div>
                                        <CardDescription>{tool.desc}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            variant={connectedTools.includes(tool.id) ? "outline" : "default"}
                                            className={`w-full ${connectedTools.includes(tool.id) ? 'border-green-500 text-green-600' : ''}`}
                                            onClick={() => toggleConnection(tool.id)}
                                            disabled={loading}
                                        >
                                            {connectedTools.includes(tool.id) ? (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Conectado
                                                </>
                                            ) : (
                                                'Conectar'
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Campaigns Tab */}
                    <TabsContent value="campaigns">
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance de Campanhas</CardTitle>
                                <CardDescription>Comparativo de ROI e Conversão</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={campaigns}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="cost" fill="#ef4444" name="Custo (R$)" />
                                        <Bar dataKey="revenue" fill="#22c55e" name="Receita (R$)" />
                                        <Bar dataKey="conversions" fill="#3b82f6" name="Conversões" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
