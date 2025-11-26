"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCartStore();

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Pedido Confirmado!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Obrigado pela sua compra! Seu pedido foi processado com sucesso e você receberá um email de confirmação em breve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button>Continuar Comprando</Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline">Ver Meus Pedidos</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

