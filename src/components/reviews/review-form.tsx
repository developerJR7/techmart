"use client";

import { useState } from "react";
import { reviewsService } from "@/services/reviews.service";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface ReviewFormProps {
    productId: string;
    onSuccess: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [title, setTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (rating === 0) {
            toast({
                variant: "error",
                title: "Avaliação necessária",
                description: "Por favor, selecione uma nota de 1 a 5 estrelas."
            });
            return;
        }

        try {
            setSubmitting(true);
            await reviewsService.create({
                productId,
                rating,
                title,
                comment
            });

            toast({
                title: "Avaliação enviada!",
                description: "Obrigado por compartilhar sua opinião."
            });

            setRating(0);
            setComment("");
            setTitle("");
            onSuccess();
        } catch (error) {
            console.error("Error submitting review", error);
            toast({
                variant: "error",
                title: "Erro ao enviar",
                description: "Não foi possível enviar sua avaliação. Tente novamente."
            });
        } finally {
            setSubmitting(false);
        }
    }

    if (!user) {
        return (
            <div className="rounded-xl bg-card border border-border p-6 text-center">
                <p className="mb-3 text-sm text-muted-foreground">Faça login para avaliar este produto.</p>
                <Button variant="outline" asChild>
                    <a href="/login">Fazer login</a>
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <h3 className="mb-4 font-display text-lg font-semibold text-card-foreground">Escreva sua avaliação</h3>

            <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-card-foreground" id="rating-label">
                    Sua nota
                </label>
                <div className="flex gap-1" role="radiogroup" aria-labelledby="rating-label">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            role="radio"
                            aria-checked={rating === star}
                            aria-label={`${star} de 5 estrelas`}
                            className="rounded transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                aria-hidden="true"
                                className={`h-6 w-6 ${star <= (hoverRating || rating)
                                        ? "fill-amber text-amber"
                                        : "fill-muted text-muted"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="review-title" className="mb-1 block text-sm font-medium text-card-foreground">
                    Título (opcional)
                </label>
                <input
                    id="review-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Resumo da sua experiência"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="review-comment" className="mb-1 block text-sm font-medium text-card-foreground">
                    Comentário
                </label>
                <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="O que você achou do produto?"
                />
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Enviando..." : "Enviar avaliação"}
            </Button>
        </form>
    );
}
