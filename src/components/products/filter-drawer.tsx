"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { FilterPanel, type FilterPanelValue } from "@/components/products/filter-panel";
import type { Category } from "@/services/categories.service";

interface FilterDrawerProps {
  categories: Category[];
  value: FilterPanelValue;
  onChange: (value: FilterPanelValue) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
}

export function FilterDrawer({
  categories,
  value,
  onChange,
  onClear,
  hasActiveFilters,
  resultCount,
}: FilterDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              •
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>Filtros</DrawerTitle>
        </DrawerHeader>

        <FilterPanel
          categories={categories}
          value={value}
          onChange={onChange}
          onClear={onClear}
          hasActiveFilters={hasActiveFilters}
        />

        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Ver {resultCount} {resultCount === 1 ? "produto" : "produtos"}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
