import Link from "next/link";
import Image from "next/image";
import { Category } from "@/services/categories.service";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const count = category._count?.products;

  return (
    <Link
      href={`/products?categoryId=${category.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">📦</div>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-medium text-card-foreground group-hover:text-primary">
          {category.name}
        </h3>
        {typeof count === "number" && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {count} {count === 1 ? "produto" : "produtos"}
          </p>
        )}
      </div>
    </Link>
  );
}
