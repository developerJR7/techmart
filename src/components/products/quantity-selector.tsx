"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max: number;
    disabled?: boolean;
}

export function QuantitySelector({ value, onChange, min = 1, max, disabled }: QuantitySelectorProps) {
    const clamp = (n: number) => Math.min(max, Math.max(min, n));

    return (
        <div
            className="inline-flex items-center rounded-xl border border-input bg-background"
            role="group"
            aria-label="Selecionar quantidade"
        >
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-l-xl rounded-r-none"
                onClick={() => onChange(clamp(value - 1))}
                disabled={disabled || value <= min}
                aria-label="Diminuir quantidade"
            >
                <Minus className="h-4 w-4" />
            </Button>
            <span
                className="w-12 text-center text-lg font-medium tabular-nums text-foreground"
                aria-live="polite"
                aria-atomic="true"
            >
                {value}
            </span>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-l-none rounded-r-xl"
                onClick={() => onChange(clamp(value + 1))}
                disabled={disabled || value >= max}
                aria-label="Aumentar quantidade"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
}
