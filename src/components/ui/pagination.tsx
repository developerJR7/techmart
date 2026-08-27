import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    return (
        <nav aria-label="Paginação" className="mt-8 flex items-center justify-center gap-2">
            <Button
                variant="outline"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Página anterior"
            >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Anterior
            </Button>
            <span className="px-4 text-sm text-muted-foreground" aria-current="page">
                Página {currentPage} de {totalPages}
            </span>
            <Button
                variant="outline"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Próxima página"
            >
                Próxima
                <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
        </nav>
    )
}

export { Pagination }
