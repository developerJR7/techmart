"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { reviewsService } from "@/services/reviews.service";
import { Star, User, MessageSquareOff } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";

interface ReviewListProps {
    productId: string;
    refreshTrigger?: number;
}

const PAGE_SIZE = 10;

// O componente é remontado pelo pai via `key={refreshTrigger}` quando uma
// nova avaliação é enviada — isso já reresolve tanto o refetch quanto a
// volta pra página 1 (onde a nova avaliação aparece, dado que a ordenação é
// isVerifiedPurchase desc, createdAt desc), sem precisar de um efeito só
// pra sincronizar esse reset.
export function ReviewList({ productId, refreshTrigger }: ReviewListProps) {
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["reviews", productId, page, refreshTrigger],
        queryFn: () => reviewsService.getByProduct(productId, page, PAGE_SIZE),
        placeholderData: keepPreviousData,
    });

    if (isLoading) {
        return (
            <div className="space-y-4" aria-busy="true" aria-label="Carregando avaliações">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-4">
                        <Skeleton className="mb-2 h-4 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <ErrorState
                title="Não foi possível carregar as avaliações"
                description="Tente novamente em instantes."
                onRetry={() => refetch()}
            />
        );
    }

    const reviews = data?.reviews ?? [];
    const pagination = data?.pagination;

    if (reviews.length === 0) {
        return (
            <EmptyState
                icon={MessageSquareOff}
                title="Nenhuma avaliação ainda"
                description="Seja a primeira pessoa a avaliar este produto."
            />
        );
    }

    return (
        <div className="space-y-4">
            <ul className="space-y-4">
                {reviews.map((review) => (
                    <li key={review.id} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="rounded-full bg-muted p-1.5">
                                    <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                </div>
                                <span className="text-sm font-medium text-card-foreground">{review.user.name}</span>
                                {review.isVerifiedPurchase && (
                                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                                        Compra verificada
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(review.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                        </div>

                        <div className="mb-2 flex" role="img" aria-label={`${review.rating} de 5 estrelas`}>
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    aria-hidden="true"
                                    className={`h-4 w-4 ${i < review.rating ? "fill-amber text-amber" : "fill-muted text-muted"}`}
                                />
                            ))}
                        </div>

                        {review.title && <h3 className="mb-1 font-medium text-card-foreground">{review.title}</h3>}
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </li>
                ))}
            </ul>

            {pagination && pagination.totalPages > 1 && (
                <nav
                    className="flex items-center justify-between border-t border-border pt-4"
                    aria-label="Paginação de avaliações"
                >
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                    >
                        Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Página {pagination.page} de {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                        disabled={page >= pagination.totalPages}
                    >
                        Próxima
                    </Button>
                </nav>
            )}
        </div>
    );
}
