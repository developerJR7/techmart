"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#0A0A0A', color: '#fff', marginTop: 'auto', borderTop: '2px solid #7F5AF0' }}>
      {/* Botão Voltar ao Topo */}
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          backgroundColor: '#1a1a1a',
          textAlign: 'center',
          padding: '15px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          borderBottom: '1px solid #333'
        }}
      >
        Voltar ao início
      </div>

      {/* Conteúdo Principal */}
      <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Coluna 1 */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', color: '#7F5AF0' }}>Conheça-nos</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/about" style={{ color: '#DDD', fontSize: '14px', textDecoration: 'none' }}>
                  Sobre o TechMart
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/careers" style={{ color: '#DDD', fontSize: '14px', textDecoration: 'none' }}>
                  Carreiras
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/blog" style={{ color: '#DDD', fontSize: '14px', textDecoration: 'none' }}>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 2 */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', color: '#7F5AF0' }}>Ganhe dinheiro conosco</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/sell" style={{ color: '#DDD', fontSize: '14px', textDecoration: 'none' }}>
                  Venda no TechMart
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/affiliate" style={{ color: '#DDD', fontSize: '14px', textDecoration: 'none' }}>
                  Seja um afiliado
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/advertise" style={{ color: '#DDD', fontSize: '14px', textDecoration: 'none' }}>
                  Anuncie seus produtos
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', color: '#7F5AF0' }}>Formas de pagamento</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/payment" style={{ color: '#DDD', fontSize: '14px', textDecoration: 'none' }}>
                  Compre com pontos
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/balance" style={{ color: '#DDD', fontSize: '14px', textDecoration: 'none' }}>
                  Atualizar seu saldo
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/currency" style={{ color: '#DDD', fontSize: '14px', textDecoration: 'none' }}>
                  Conversor de moedas
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4 */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', color: '#7F5AF0' }}>Deixe-nos ajudar você</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/account" style={{ color: '#DDD', fontSize: '14px', textDecoration: 'none' }}>
                  Sua conta
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/orders" style={{ color: '#DDD', fontSize: '14px', textDecoration: 'none' }}>
                  Seus pedidos
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/shipping" style={{ color: '#DDD', fontSize: '14px', textDecoration: 'none' }}>
                  Frete e prazo de entrega
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/returns" style={{ color: '#DDD', fontSize: '14px', textDecoration: 'none' }}>
                  Devoluções e reembolsos
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link href="/help" style={{ color: '#DDD', fontSize: '14px', textDecoration: 'none' }}>
                  Ajuda
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div style={{ borderTop: '1px solid #333', paddingTop: '30px' }}>
          {/* Logo e idioma */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ fontSize: '20px', fontWeight: 'bold', color: '#7F5AF0', textDecoration: 'none' }}>
              TechMart
            </Link>
            <div style={{ display: 'flex', gap: '15px', fontSize: '12px' }}>
              <button style={{
                padding: '8px 15px',
                backgroundColor: 'transparent',
                border: '1px solid #555',
                color: '#DDD',
                borderRadius: '3px',
                cursor: 'pointer'
              }}>
                🌐 Português
              </button>
              <button style={{
                padding: '8px 15px',
                backgroundColor: 'transparent',
                border: '1px solid #555',
                color: '#DDD',
                borderRadius: '3px',
                cursor: 'pointer'
              }}>
                💵 BRL - R$
              </button>
              <button style={{
                padding: '8px 15px',
                backgroundColor: 'transparent',
                border: '1px solid #555',
                color: '#DDD',
                borderRadius: '3px',
                cursor: 'pointer'
              }}>
                🇧🇷 Brasil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé final */}
      <div style={{ backgroundColor: '#000', padding: '20px', textAlign: 'center', borderTop: '1px solid #333' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
          © {new Date().getFullYear()} TechMart. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
