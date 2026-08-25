"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

/**
 * Ao carregar o app, troca o cookie httpOnly de refresh token por um novo
 * access token em memória — é assim que a sessão sobrevive a um F5 sem
 * nunca guardar tokens em localStorage.
 */
export function AuthInitializer() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
