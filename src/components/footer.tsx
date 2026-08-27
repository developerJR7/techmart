"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";

const columns = [
  {
    title: "Conheça-nos",
    links: [
      { href: "/about", label: "Sobre o TechMart" },
      { href: "/careers", label: "Carreiras" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Ganhe dinheiro conosco",
    links: [
      { href: "/sell", label: "Venda no TechMart" },
      { href: "/affiliate", label: "Seja um afiliado" },
      { href: "/advertise", label: "Anuncie seus produtos" },
    ],
  },
  {
    title: "Formas de pagamento",
    links: [
      { href: "/payment", label: "Compre com pontos" },
      { href: "/balance", label: "Atualizar seu saldo" },
      { href: "/currency", label: "Conversor de moedas" },
    ],
  },
  {
    title: "Deixe-nos ajudar você",
    links: [
      { href: "/account", label: "Sua conta" },
      { href: "/orders", label: "Seus pedidos" },
      { href: "/shipping", label: "Frete e prazo de entrega" },
      { href: "/returns", label: "Devoluções e reembolsos" },
      { href: "/help", label: "Ajuda" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-primary/20 bg-secondary text-white">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex w-full items-center justify-center gap-2 border-b border-white/10 bg-white/5 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <ArrowUp size={14} />
        Voltar ao início
      </button>

      <div className="mx-auto max-w-[1500px] px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 font-display text-sm font-semibold text-primary">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-8">
          <Link href="/" className="font-display text-lg font-bold text-primary">
            TechMart
          </Link>
          <div className="flex flex-wrap gap-3 text-xs">
            {["🌐 Português", "💵 BRL - R$", "🇧🇷 Brasil"].map((label) => (
              <button
                key={label}
                className="rounded-full border border-white/15 px-3 py-1.5 text-white/70 transition-colors hover:border-white/30 hover:text-white"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/30 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} TechMart. Todos os direitos reservados.
      </div>
    </footer>
  );
}
