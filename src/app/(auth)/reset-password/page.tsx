"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";
import { ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const { toast } = useToast();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast({
                variant: "error",
                title: "Token inválido",
                description: "O link de recuperação é inválido ou expirou."
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                variant: "error",
                title: "Senhas não coincidem",
                description: "A nova senha e a confirmação devem ser iguais."
            });
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(token, password);
            toast({
                title: "Senha redefinida!",
                description: "Sua senha foi alterada com sucesso. Faça login para continuar.",
                style: { backgroundColor: '#7F5AF0', color: 'white', border: 'none' }
            });
            router.push("/login");
        } catch (error) {
            toast({
                variant: "error",
                title: "Erro ao redefinir senha",
                description: "O link pode ter expirado. Tente solicitar novamente."
            });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div style={{ textAlign: 'center', color: '#fff' }}>
                <p>Token de recuperação não encontrado.</p>
                <Link href="/forgot-password" style={{ color: '#7F5AF0', marginTop: '10px', display: 'inline-block' }}>
                    Solicitar novo link
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#fff' }}>
                    Nova Senha
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#fff' }}>
                    Confirmar Nova Senha
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Redefinindo..." : "Redefinir Senha"}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
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
                <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '10px', color: '#fff' }}>Redefinir Senha</h2>
                <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '20px' }}>
                    Crie uma nova senha para sua conta.
                </p>

                <Suspense fallback={<div style={{ color: '#fff' }}>Carregando...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
