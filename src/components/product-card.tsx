"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
  isNew?: boolean;
  discount?: number;
  rating?: number;
  reviews?: number;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  slug,
  discount = 0,
  rating = 4.5,
  reviews = 120,
}: ProductCardProps) {
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;

  return (
    <Link href={`/products/${slug}`} className="group">
      <div className="bg-white rounded p-4 hover:shadow-lg transition-shadow h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 rounded mb-3 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="text-6xl">📦</span>
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          {/* Name */}
          <h3 className="text-sm mb-2 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(rating)
                    ? "fill-primary text-primary"
                    : "fill-gray-200 text-gray-200"
                  }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({reviews})</span>
          </div>

          {/* Price */}
          <div className="mt-auto">
            {discount > 0 ? (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-red-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(discountedPrice)}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(price)}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(price)}
              </span>
            )}
            <p className="text-xs text-gray-500 mt-1">Frete GRÁTIS</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
