"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
  isNew?: boolean;
  discount?: number;
  /** null/undefined = produto ainda sem nenhuma review; não renderiza estrelas. */
  rating?: number | null;
  reviewCount?: number;
}

export function ProductCard({
  name,
  price,
  image,
  slug,
  discount = 0,
  rating,
  reviewCount = 0,
}: ProductCardProps) {
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;

  return (
    <Link href={`/products/${slug}`} className="group">
      <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
        {/* Image */}
        <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <span className="text-6xl">📦</span>
            </div>
          )}
          {discount > 0 && (
            <div className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
              -{discount}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col">
          {/* Name */}
          <h3 className="mb-2 line-clamp-2 text-sm text-card-foreground transition-colors group-hover:text-primary">
            {name}
          </h3>

          {/* Rating — só renderiza quando existe pelo menos uma review real */}
          {rating != null && (
            <div className="mb-2 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating)
                      ? "fill-amber text-amber"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
              <span className="ml-1 text-xs text-muted-foreground">({reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="mt-auto">
            {discount > 0 ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-destructive">
                  {currencyFormatter.format(discountedPrice)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {currencyFormatter.format(price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-card-foreground">
                {currencyFormatter.format(price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
