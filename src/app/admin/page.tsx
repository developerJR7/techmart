"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp } from "lucide-react";
import { adminService } from "@/services/admin.service";
import Link from "next/link";

// Shape real de GET /admin/analytics/dashboard (admin-analytics.controller.ts).
// Não existe agregação mensal de vendas no backend ainda, por isso não há
// campo tipo `salesByMonth` aqui — o gráfico "Vendas por Mês" foi removido
// em vez de inventar os dados.
interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  topProducts: Array<{ id: string; name: string; totalSold: number }>;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const dashboardData = await adminService.getDashboardMetrics();
        setAnalytics(dashboardData);
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
            <p style={{ fontSize: '12px', color: '#888' }}>Pedidos processados, enviados ou entregues</p>
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
            <p style={{ fontSize: '12px', color: '#888' }}>Processados, enviados ou entregues</p>
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
                <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>Total de Usuários</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>{analytics.totalUsers}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', padding: '12px', borderRadius: '8px' }}>
                <Users size={24} color="#ec4899" />
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#888' }}>Clientes, vendedores e admins</p>
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



        {/* Top Products — o backend ainda não agrega vendas por mês
            (só existe o relatório bruto em getSalesReport), então por
            enquanto mostramos só o que é real: produtos mais vendidos. */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#111', padding: '24px', borderRadius: '12px', border: '1px solid #333' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>Top Produtos</h2>
            {analytics.topProducts.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#888' }}>Ainda não há vendas suficientes para calcular um ranking.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {analytics.topProducts.map((product, index) => (
                  <div key={product.id} style={{ borderBottom: index < analytics.topProducts.length - 1 ? '1px solid #333' : 'none', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{product.name}</p>
                      <span style={{ fontSize: '12px', color: '#888' }}>{product.totalSold} vendidos</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
