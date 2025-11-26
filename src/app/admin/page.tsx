"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp } from "lucide-react";
import api from "@/lib/api";
import { AdminAIAssistant } from "@/components/admin-ai-assistant";

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
        // Mock data for now - replace with real API calls later
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
      } catch (error) {
        console.error('Erro ao carregar analytics:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Erro ao carregar dados</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>Dashboard Admin</h1>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {/* Revenue Card */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Receita Total</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>
                  R$ {analytics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div style={{ backgroundColor: '#dcfce7', padding: '12px', borderRadius: '8px' }}>
                <DollarSign size={24} color="#16a34a" />
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> +12.5% vs mês anterior
            </p>
          </div>

          {/* Orders Card */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total de Pedidos</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{analytics.totalOrders}</p>
              </div>
              <div style={{ backgroundColor: '#dbeafe', padding: '12px', borderRadius: '8px' }}>
                <ShoppingCart size={24} color="#2563eb" />
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> +8.2% vs mês anterior
            </p>
          </div>

          {/* Products Card */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Produtos Ativos</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{analytics.totalProducts}</p>
              </div>
              <div style={{ backgroundColor: '#fef3c7', padding: '12px', borderRadius: '8px' }}>
                <Package size={24} color="#d97706" />
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#666' }}>Em estoque</p>
          </div>

          {/* Customers Card */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total de Clientes</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{analytics.totalCustomers}</p>
              </div>
              <div style={{ backgroundColor: '#fce7f3', padding: '12px', borderRadius: '8px' }}>
                <Users size={24} color="#db2777" />
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#db2777', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> +15.3% vs mês anterior
            </p>
          </div>
        </div>

        {/* AI Assistant */}
        <div style={{ marginBottom: '40px' }}>
          <AdminAIAssistant analyticsData={analytics} />
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '40px' }}>
          {/* Sales Chart */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Vendas por Mês</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} name="Receita (R$)" />
                <Line type="monotone" dataKey="orders" stroke="#2563eb" strokeWidth={2} name="Pedidos" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Top Produtos</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analytics.topProducts.map((product, index) => (
                <div key={index} style={{ borderBottom: index < analytics.topProducts.length - 1 ? '1px solid #e5e7eb' : 'none', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>{product.name}</p>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#16a34a' }}>
                      R$ {product.revenue.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <p style={{ fontSize: '12px', color: '#666' }}>{product.sold} vendidos</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Bar Chart */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Produtos Mais Vendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sold" fill="#2563eb" name="Unidades Vendidas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
