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
            <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600 mb-2">Faça login para avaliar este produto.</p>
                <Button variant="outline" asChild>
                    <a href="/login">Fazer Login</a>
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Escreva sua avaliação</h3>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sua nota</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="focus:outline-none transition-transform hover:scale-110"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={`h-6 w-6 ${star <= (hoverRating || rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-200 text-gray-200"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título (opcional)</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Resumo da sua experiência"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Comentário</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="O que você achou do produto?"
                />
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Enviando..." : "Enviar Avaliação"}
            </Button>
        </form>
    );
}
