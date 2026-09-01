"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

// Combina `images[]` com o legado `image` singular já na page (ver
// api.types.ts) — este componente só recebe a lista final, já resolvida.
export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [failedIndexes, setFailedIndexes] = useState<Set<number>>(new Set());

    const hasImages = images.length > 0;
    const activeSrc = hasImages ? images[activeIndex] : undefined;
    const activeFailed = failedIndexes.has(activeIndex);

    function markFailed(index: number) {
        setFailedIndexes((prev) => new Set(prev).add(index));
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-card">
                {hasImages && activeSrc && !activeFailed ? (
                    <Image
                        key={activeSrc}
                        src={activeSrc}
                        alt={`${productName} — imagem ${activeIndex + 1} de ${images.length}`}
                        fill
                        priority
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-contain p-8"
                        onError={() => markFailed(activeIndex)}
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                        <ImageOff className="h-12 w-12" aria-hidden="true" />
                        <span className="text-sm">Sem imagem disponível</span>
                    </div>
                )}
            </div>

            {images.length > 1 && (
                <div
                    className="flex gap-2 overflow-x-auto pb-1"
                    role="tablist"
                    aria-label={`Imagens de ${productName}`}
                >
                    {images.map((src, index) => (
                        <button
                            key={src + index}
                            type="button"
                            role="tab"
                            aria-selected={index === activeIndex}
                            aria-label={`Ver imagem ${index + 1} de ${images.length}`}
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                index === activeIndex
                                    ? "border-primary ring-2 ring-primary/30"
                                    : "border-border hover:border-primary/40"
                            )}
                        >
                            {failedIndexes.has(index) ? (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    <ImageOff className="h-4 w-4" aria-hidden="true" />
                                </div>
                            ) : (
                                <Image
                                    src={src}
                                    alt=""
                                    aria-hidden="true"
                                    fill
                                    sizes="64px"
                                    className="object-contain p-1.5"
                                    onError={() => markFailed(index)}
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
