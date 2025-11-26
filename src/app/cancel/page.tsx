"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900 mb-6">
            <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Pagamento Cancelado</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Seu pagamento foi cancelado. Nenhum valor foi cobrado. Você pode tentar novamente quando quiser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cart">
              <Button>Voltar ao Carrinho</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline">Continuar Comprando</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

