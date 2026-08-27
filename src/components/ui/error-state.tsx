import * as React from "react"
import { AlertTriangle, RotateCw } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string
    description?: string
    onRetry?: () => void
}

// Estado de erro genérico — explicação + caminho de recuperação (retry),
// nunca só uma mensagem seca. Ver regra 19 do briefing de UI/UX.
function ErrorState({
    title = "Algo deu errado",
    description = "Não foi possível carregar essas informações. Tente novamente.",
    onRetry,
    className,
    ...props
}: ErrorStateProps) {
    return (
        <div
            role="alert"
            className={cn("flex flex-col items-center justify-center rounded-xl bg-card py-16 text-center", className)}
            {...props}
        >
            <AlertTriangle className="mb-4 h-12 w-12 text-destructive" aria-hidden="true" />
            <h3 className="mb-1 text-lg font-medium text-card-foreground">{title}</h3>
            <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
            {onRetry && (
                <Button variant="outline" onClick={onRetry} className="mt-4">
                    <RotateCw className="mr-2 h-4 w-4" />
                    Tentar novamente
                </Button>
            )}
        </div>
    )
}

export { ErrorState }
