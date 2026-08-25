"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

/**
 * Bloqueio real de acesso ao painel admin, não apenas visual: só libera o
 * conteúdo depois que a sessão foi confirmada (via cookie httpOnly) e o
 * papel do usuário é ADMIN. Enquanto a sessão está sendo verificada, ou se
 * a verificação falhar, nada do admin é renderizado.
 *
 * Isso é uma camada de UX/defesa em profundidade — a proteção real de
 * dados continua no backend (JwtAuthGuard + RolesGuard em cada rota
 * /admin/*), já que o frontend e o backend ficam em origens diferentes e
 * o middleware do Next não consegue ler o cookie httpOnly do backend.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isInitialized, isAuthenticated, isAdmin } = useAuth();

  const authorized = isInitialized && isAuthenticated() && isAdmin();

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    if (!isAdmin()) {
      router.replace("/");
    }
  }, [isInitialized, isAuthenticated, isAdmin, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white/60 text-sm">
        Verificando permissões...
      </div>
    );
  }

  return <>{children}</>;
}
