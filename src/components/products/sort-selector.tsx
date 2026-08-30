"use client";

import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductSort } from "@/services/products.service";

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "relevance", label: "Mais relevantes" },
  { value: "newest", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "rating_desc", label: "Melhor avaliados" },
];

interface SortSelectorProps {
  value: ProductSort;
  onChange: (value: ProductSort) => void;
}

export function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ProductSort)}>
      <SelectTrigger className="w-full gap-2 sm:w-56" aria-label="Ordenar produtos">
        <ArrowUpDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
