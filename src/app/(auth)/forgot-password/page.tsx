"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setSubmitted(true);
            toast({
                title: "Email enviado!",
                description: "Verifique sua caixa de entrada para redefinir sua senha.",
                style: { backgroundColor: '#7F5AF0', color: 'white', border: 'none' }
            });
        } catch (error) {
            toast({
                variant: "error",
                title: "Erro ao enviar email",
                description: "Verifique se o email está correto e tente novamente."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
            <Link href="/login" style={{ marginBottom: '30px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#7F5AF0' }}>
                <ArrowLeft size={20} />
                Voltar para Login
            </Link>

            <div style={{
                width: '100%',
                maxWidth: '350px',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '20px 26px',
                backgroundColor: '#1a1a1a'
            }}>
                <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '10px', color: '#fff' }}>Recuperar Senha</h2>

                {!submitted ? (
                    <>
                        <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '20px' }}>
                            Digite seu email e enviaremos um link para você redefinir sua senha.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#fff' }}>
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                {loading ? "Enviando..." : "Enviar link de recuperação"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ backgroundColor: '#1a3d1a', border: '1px solid #2f5c2f', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                            <p style={{ color: '#d4edda', fontSize: '14px' }}>
                                Email enviado com sucesso! Verifique sua caixa de entrada (e spam) para continuar.
                            </p>
                        </div>
                        <button
                            onClick={() => setSubmitted(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#7F5AF0',
                                cursor: 'pointer',
                                fontSize: '13px',
                                textDecoration: 'underline'
                            }}
                        >
                            Tentar outro email
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
