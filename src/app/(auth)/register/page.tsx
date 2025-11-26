"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      // Call your register API here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'facebook') => {
    // OAuth login will be implemented with NextAuth
    alert(`Login com ${provider} será implementado em breve!`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
      {/* Logo */}
      <Link href="/" style={{ marginBottom: '30px', textDecoration: 'none' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#7F5AF0' }}>TechMart</h1>
      </Link>

      {/* Register Box */}
      <div style={{
        width: '100%',
        maxWidth: '350px',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '20px 26px',
        backgroundColor: '#1a1a1a'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '10px', color: '#fff' }}>Criar conta</h2>

        {error && (
          <div style={{
            backgroundColor: '#3d1a1a',
            border: '1px solid #721c24',
            borderRadius: '4px',
            padding: '10px',
            marginBottom: '15px',
            fontSize: '13px',
            color: '#f8d7da'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#fff' }}>
              Seu nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome e sobrenome"
              required
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '13px',
                border: '1px solid #333',
                borderRadius: '3px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#0A0A0A',
                color: '#fff'
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#fff' }}>
              E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '13px',
                border: '1px solid #333',
                borderRadius: '3px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#0A0A0A',
                color: '#fff'
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#fff' }}>
              Senha
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '13px',
                border: '1px solid #333',
                borderRadius: '3px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#0A0A0A',
                color: '#fff'
              }}
            />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#fff' }}>
              Digite a senha novamente
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '13px',
                border: '1px solid #333',
                borderRadius: '3px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#0A0A0A',
                color: '#fff'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#7F5AF0',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              opacity: loading ? 0.6 : 1,
              color: '#fff'
            }}
          >
            {loading ? "Criando conta..." : "Criar sua conta TechMart"}
          </button>
        </form>

        <p style={{ fontSize: '12px', marginTop: '20px', lineHeight: '1.5', color: '#999' }}>
          Ao criar uma conta, você concorda com as{" "}
          <Link href="/terms" style={{ color: '#7F5AF0', textDecoration: 'none' }}>
            Condições de Uso
          </Link>{" "}
          e{" "}
          <Link href="/privacy" style={{ color: '#7F5AF0', textDecoration: 'none' }}>
            Política de Privacidade
          </Link>
          .
        </p>

        {/* Divider */}
        <div style={{
          margin: '30px 0 20px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{ borderTop: '1px solid #333', position: 'relative' }}>
            <span style={{
              position: 'relative',
              top: '-10px',
              backgroundColor: '#1a1a1a',
              padding: '0 10px',
              fontSize: '12px',
              color: '#999'
            }}>
              ou
            </span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => handleOAuthLogin('google')}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#000'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z" />
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
            </svg>
            Continuar com Google
          </button>

          <button
            onClick={() => handleOAuthLogin('facebook')}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#1877F2',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#fff'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Continuar com Facebook
          </button>
        </div>
      </div>

      {/* Sign In Link */}
      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #333', width: '100%', maxWidth: '350px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#999' }}>
          Já tem uma conta?{" "}
          <Link href="/login" style={{ color: '#7F5AF0', textDecoration: 'none', fontWeight: '500' }}>
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
