"use client";

import { useEffect, useState } from "react";
import { Review, reviewsService } from "@/services/reviews.service";
import { Star, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewListProps {
    productId: string;
    refreshTrigger?: number;
}

export function ReviewList({ productId, refreshTrigger }: ReviewListProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReviews();
    }, [productId, refreshTrigger]);

    async function loadReviews() {
        try {
            setLoading(true);
            const data = await reviewsService.getByProduct(productId);
            // Handle both array and paginated response
            if (Array.isArray(data)) {
                setReviews(data);
            } else if (data && Array.isArray((data as any).data)) {
                setReviews((data as any).data);
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.error("Failed to load reviews", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg">
                        <Skeleton className="h-4 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <p>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-gray-200 p-1 rounded-full">
                                <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="font-medium text-sm">{review.user.name}</span>
                            {review.isVerifiedPurchase && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    Compra Verificada
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-gray-500">
                            {format(new Date(review.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                    </div>

                    <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                            />
                        ))}
                    </div>

                    {review.title && <h4 className="font-medium mb-1">{review.title}</h4>}
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
            ))}
        </div>
    );
}
