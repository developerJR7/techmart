import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
    items: BreadcrumbItem[]
}

// Item sem `href` (ou o último item da lista) é tratado como a página atual.
function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
    return (
        <nav aria-label="breadcrumb" className={cn("flex", className)} {...props}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1
                    return (
                        <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                            {index > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
                            {item.href && !isLast ? (
                                <Link href={item.href} className="transition-colors hover:text-foreground">
                                    {item.label}
                                </Link>
                            ) : (
                                <span aria-current={isLast ? "page" : undefined} className="font-medium text-foreground">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}

export { Breadcrumb }
export type { BreadcrumbItem }
