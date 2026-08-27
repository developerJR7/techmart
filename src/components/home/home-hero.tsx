"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/api.types";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface HomeHeroProps {
  /** Produtos reais em destaque, usados como elemento visual de apoio — não
   * como grid de cards. No máximo os 3 primeiros são exibidos. */
  products: Product[];
}

export function HomeHero({ products }: HomeHeroProps) {
  const reduceMotion = useReducedMotion();
  const [primary, secondary, tertiary] = products;

  const fadeIn = {
    initial: reduceMotion ? {} : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative overflow-hidden bg-secondary">
      {/* Glow de fundo — sutil, só pra dar atmosfera, sem virar gradiente pesado */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-15%] left-[10%] h-64 w-64 rounded-full bg-amber/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        {/* Headline — elemento principal */}
        <motion.div {...fadeIn} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-inset ring-white/10">
            Marketplace de tecnologia
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-display">
            Tecnologia de verdade,
            <br />
            vendedores de confiança.
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/70">
            Compare, compre e acompanhe seu pedido em um marketplace pensado
            pra quem entende de tecnologia.
          </p>
          <div className="mt-8">
            <Link href="/products">
              <Button size="lg">Explorar produtos</Button>
            </Link>
          </div>
        </motion.div>

        {/* Composição visual — produtos reais como apoio, não como grid de cards */}
        <motion.div
          {...fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative h-[300px] sm:h-[360px] lg:h-[440px]"
        >
          {tertiary && (
            <Link
              href={`/products/${tertiary.slug}`}
              className="group absolute left-0 top-2 z-30 h-[38%] w-[36%] -rotate-6 overflow-hidden rounded-2xl border border-white/10 bg-card shadow-elevated transition-transform hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary sm:top-4"
            >
              <Image
                src={tertiary.images?.[0] ?? ""}
                alt={tertiary.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="220px"
              />
            </Link>
          )}

          {secondary && (
            <Link
              href={`/products/${secondary.slug}`}
              className="group absolute bottom-2 left-[6%] z-10 h-[52%] w-[48%] rotate-3 overflow-hidden rounded-2xl border border-white/10 bg-card shadow-elevated transition-transform hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary sm:bottom-4"
            >
              <Image
                src={secondary.images?.[0] ?? ""}
                alt={secondary.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="280px"
              />
            </Link>
          )}

          {primary && (
            <Link
              href={`/products/${primary.slug}`}
              className="group absolute right-0 top-1/2 z-20 h-[72%] w-[58%] -translate-y-1/2 rotate-2 overflow-hidden rounded-2xl border border-white/10 bg-card shadow-elevated transition-transform hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            >
              <Image
                src={primary.images?.[0] ?? ""}
                alt={primary.name}
                fill
                priority
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 400px, 60vw"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-sm font-semibold text-foreground shadow-soft">
                {currencyFormatter.format(primary.price)}
              </span>
            </Link>
          )}

          {products.length === 0 && (
            <div
              aria-hidden
              className="absolute right-0 top-1/2 h-[72%] w-[58%] -translate-y-1/2 rounded-2xl border border-white/10 bg-white/5"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
