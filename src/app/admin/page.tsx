"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp } from "lucide-react";
import { adminService } from "@/services/admin.service";
import Link from "next/link";


interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  salesByMonth: Array<{ month: string; revenue: number; orders: number }>;
  topProducts: Array<{ name: string; sold: number; revenue: number }>;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // Fetch real analytics data from backend
        const dashboardData = await adminService.getDashboardMetrics();
        setAnalytics(dashboardData);
      } catch (error) {
        console.error('Erro ao carregar analytics:', error);
        // Fallback to mock data if API fails
        const mockData: AnalyticsData = {
          totalRevenue: 45230.50,
          totalOrders: 156,
          totalProducts: 48,
          totalCustomers: 89,
          salesByMonth: [
            { month: 'Jan', revenue: 3200, orders: 12 },
            { month: 'Fev', revenue: 4100, orders: 18 },
            { month: 'Mar', revenue: 3800, orders: 15 },
            { month: 'Abr', revenue: 5200, orders: 22 },
            { month: 'Mai', revenue: 4900, orders: 19 },
            { month: 'Jun', revenue: 6100, orders: 25 },
            { month: 'Jul', revenue: 5800, orders: 21 },
            { month: 'Ago', revenue: 4500, orders: 16 },
            { month: 'Set', revenue: 5900, orders: 24 },
            { month: 'Out', revenue: 6800, orders: 28 },
            { month: 'Nov', revenue: 7200, orders: 31 },
            { month: 'Dez', revenue: 8100, orders: 35 },
          ],
          topProducts: [
            { name: 'iPhone 15 Pro', sold: 45, revenue: 67500 },
            { name: 'Samsung Galaxy S24', sold: 38, revenue: 45600 },
            { name: 'MacBook Pro M3', sold: 22, revenue: 52800 },
            { name: 'AirPods Pro', sold: 67, revenue: 16750 },
            { name: 'PlayStation 5', sold: 31, revenue: 15500 },
          ],
        };
        setAnalytics(mockData);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-white">Carregando dashboard...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-white">Erro ao carregar dados</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', color: '#fff' }}>Dashboard Admin</h1>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {/* Revenue Card */}
          <div style={{ backgroundColor: '#111', padding: '24px', borderRadius: '12px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>Receita Total</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
                  R$ {analytics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px' }}>
                <DollarSign size={24} color="#10b981" />
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> +12.5% vs mês anterior
            </p>
          </div>

          {/* Orders Card */}
          <div style={{ backgroundColor: '#111', padding: '24px', borderRadius: '12px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>Total de Pedidos</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>{analytics.totalOrders}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '8px' }}>
                <ShoppingCart size={24} color="#3b82f6" />
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> +8.2% vs mês anterior
            </p>
          </div>

          {/* Products Card */}
          <div style={{ backgroundColor: '#111', padding: '24px', borderRadius: '12px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>Produtos Ativos</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>{analytics.totalProducts}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '8px' }}>
                <Package size={24} color="#f59e0b" />
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#888' }}>Em estoque</p>
          </div>

          {/* Customers Card */}
          <div style={{ backgroundColor: '#111', padding: '24px', borderRadius: '12px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>Total de Clientes</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>{analytics.totalCustomers}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', padding: '12px', borderRadius: '8px' }}>
                <Users size={24} color="#ec4899" />
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#ec4899', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> +15.3% vs mês anterior
            </p>
          </div>

          {/* Analytics & Marketing Link Card */}
          <Link href="/admin/analytics" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#111',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #7F5AF0',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#111';
              }}
            >
              <div style={{ backgroundColor: '#7F5AF0', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
                <TrendingUp size={32} color="#fff" />
              </div>
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Analytics & Marketing</h3>
              <p style={{ color: '#888', fontSize: '14px', textAlign: 'center' }}>
                Conectar ferramentas e ver insights
              </p>
            </div>
          </Link>

          {/* AI Product Generator Link Card */}
          <Link href="/admin/ai-products" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#111',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #7F5AF0',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#111';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#FFD814',
                color: '#000',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                NOVO
              </div>
              <div style={{ backgroundColor: '#7F5AF0', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
                <Package size={32} color="#fff" />
              </div>
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>IA Geradora de Produtos</h3>
              <p style={{ color: '#888', fontSize: '14px', textAlign: 'center' }}>
                Crie produtos automaticamente com IA
              </p>
            </div>
          </Link>
        </div>



        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '40px' }}>
          {/* Sales Chart */}
          <div style={{ backgroundColor: '#111', padding: '24px', borderRadius: '12px', border: '1px solid #333' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>Vendas por Mês</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Receita (R$)" />
                <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} name="Pedidos" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div style={{ backgroundColor: '#111', padding: '24px', borderRadius: '12px', border: '1px solid #333' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>Top Produtos</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analytics.topProducts.map((product, index) => (
                <div key={index} style={{ borderBottom: index < analytics.topProducts.length - 1 ? '1px solid #333' : 'none', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{product.name}</p>
                    <span style={{ fontSize: '12px', color: '#888' }}>{product.sold} vendidos</span>
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>
                    R$ {product.revenue.toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Link href="/admin/products" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#111',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #333',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7F5AF0';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.backgroundColor = '#111';
              }}
            >
              <Package size={24} color="#7F5AF0" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#fff', fontWeight: '600' }}>Produtos</p>
            </div>
          </Link>

          <Link href="/admin/orders" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#111',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #333',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7F5AF0';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.backgroundColor = '#111';
              }}
            >
              <ShoppingCart size={24} color="#7F5AF0" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#fff', fontWeight: '600' }}>Pedidos</p>
            </div>
          </Link>

          <Link href="/admin/categories" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#111',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #333',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7F5AF0';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.backgroundColor = '#111';
              }}
            >
              <Package size={24} color="#7F5AF0" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#fff', fontWeight: '600' }}>Categorias</p>
            </div>
          </Link>

          <Link href="/admin/users" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#111',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #333',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7F5AF0';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.backgroundColor = '#111';
              }}
            >
              <Users size={24} color="#7F5AF0" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#fff', fontWeight: '600' }}>Usuários</p>
            </div>
          </Link>

          <Link href="/admin/coupons" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#111',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #333',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7F5AF0';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.backgroundColor = '#111';
              }}
            >
              <DollarSign size={24} color="#7F5AF0" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#fff', fontWeight: '600' }}>Cupons</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
