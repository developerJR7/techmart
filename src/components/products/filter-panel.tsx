"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Category } from "@/services/categories.service";

const RATING_THRESHOLDS = [4, 3, 2, 1];

export interface FilterPanelValue {
  categoryId: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock: boolean;
}

interface FilterPanelProps {
  categories: Category[];
  value: FilterPanelValue;
  onChange: (value: FilterPanelValue) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

export function FilterPanel({
  categories,
  value,
  onChange,
  onClear,
  hasActiveFilters,
  className,
}: FilterPanelProps) {
  const [minPriceInput, setMinPriceInput] = React.useState(value.minPrice?.toString() ?? "");
  const [maxPriceInput, setMaxPriceInput] = React.useState(value.maxPrice?.toString() ?? "");

  React.useEffect(() => {
    setMinPriceInput(value.minPrice?.toString() ?? "");
    setMaxPriceInput(value.maxPrice?.toString() ?? "");
  }, [value.minPrice, value.maxPrice]);

  const commitPriceRange = () => {
    const minPrice = minPriceInput ? Number(minPriceInput) : undefined;
    const maxPrice = maxPriceInput ? Number(maxPriceInput) : undefined;
    if (minPrice === value.minPrice && maxPrice === value.maxPrice) return;
    onChange({ ...value, minPrice, maxPrice });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-foreground">Filtros</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-auto px-2 py-1 text-xs">
            Limpar tudo
          </Button>
        )}
      </div>

      {/* Categoria */}
      <fieldset className="flex flex-col gap-1">
        <legend className="mb-2 text-sm font-medium text-foreground">Categoria</legend>
        <button
          type="button"
          onClick={() => onChange({ ...value, categoryId: "" })}
          aria-pressed={value.categoryId === ""}
          className={cn(
            "flex min-h-11 items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value.categoryId === "" ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground"
          )}
        >
          Todas as categorias
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange({ ...value, categoryId: category.id })}
            aria-pressed={value.categoryId === category.id}
            className={cn(
              "flex min-h-11 items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              value.categoryId === category.id
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <span className="line-clamp-1">{category.name}</span>
            {typeof category._count?.products === "number" && (
              <span className="shrink-0 text-xs text-muted-foreground">{category._count.products}</span>
            )}
          </button>
        ))}
      </fieldset>

      {/* Preço */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium text-foreground">Preço</legend>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="filter-min-price" className="sr-only">
              Preço mínimo
            </Label>
            <Input
              id="filter-min-price"
              type="number"
              inputMode="decimal"
              min={0}
              placeholder="Mín."
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              onBlur={commitPriceRange}
              onKeyDown={(e) => e.key === "Enter" && commitPriceRange()}
              className="h-9"
            />
          </div>
          <span className="text-muted-foreground" aria-hidden="true">
            —
          </span>
          <div className="flex-1">
            <Label htmlFor="filter-max-price" className="sr-only">
              Preço máximo
            </Label>
            <Input
              id="filter-max-price"
              type="number"
              inputMode="decimal"
              min={0}
              placeholder="Máx."
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              onBlur={commitPriceRange}
              onKeyDown={(e) => e.key === "Enter" && commitPriceRange()}
              className="h-9"
            />
          </div>
        </div>
      </fieldset>

      {/* Avaliação */}
      <fieldset className="flex flex-col gap-1">
        <legend className="mb-2 text-sm font-medium text-foreground">Avaliação</legend>
        {RATING_THRESHOLDS.map((threshold) => (
          <button
            key={threshold}
            type="button"
            onClick={() => onChange({ ...value, minRating: value.minRating === threshold ? undefined : threshold })}
            aria-pressed={value.minRating === threshold}
            className={cn(
              "flex min-h-11 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              value.minRating === threshold ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <span className="flex" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn("h-3.5 w-3.5", i < threshold ? "fill-amber text-amber" : "fill-muted text-muted")}
                />
              ))}
            </span>
            <span>ou mais</span>
          </button>
        ))}
      </fieldset>

      {/* Disponibilidade */}
      <fieldset className="flex items-center gap-2">
        <Checkbox
          id="filter-in-stock"
          checked={value.inStock}
          onCheckedChange={(checked) => onChange({ ...value, inStock: checked === true })}
        />
        <Label htmlFor="filter-in-stock" className="cursor-pointer text-sm font-normal text-foreground">
          Somente produtos em estoque
        </Label>
      </fieldset>
    </div>
  );
}
