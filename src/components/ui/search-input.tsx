import * as React from "react"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"

export interface SearchInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
    value: string
    onChange: (value: string) => void
    onClear?: () => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, value, onChange, onClear, placeholder = "Buscar...", ...props }, ref) => {
        return (
            <div className={cn("relative", className)}>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    ref={ref}
                    type="search"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-md border border-input bg-card py-2 pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    {...props}
                />
                {value && (
                    <button
                        type="button"
                        onClick={() => (onClear ? onClear() : onChange(""))}
                        aria-label="Limpar busca"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        )
    }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }
