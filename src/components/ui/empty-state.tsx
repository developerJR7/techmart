import * as React from "react"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: LucideIcon
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
}

function EmptyState({ icon: Icon, title, description, action, className, ...props }: EmptyStateProps) {
    return (
        <div
            role="status"
            className={cn("flex flex-col items-center justify-center rounded-xl bg-card py-16 text-center", className)}
            {...props}
        >
            {Icon && <Icon className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />}
            <h3 className="mb-1 text-lg font-medium text-card-foreground">{title}</h3>
            {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
            {action && (
                <Button onClick={action.onClick} className="mt-4">
                    {action.label}
                </Button>
            )}
        </div>
    )
}

export { EmptyState }
