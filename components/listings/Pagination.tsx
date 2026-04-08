"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaginationInfo } from "@/lib/utils/listings"

interface PaginationProps {
  pagination: PaginationInfo
  currentPage: number
  onPageChange: (page: number) => void
}

export function Pagination({
  pagination,
  currentPage,
  onPageChange,
}: PaginationProps) {
  if (pagination.totalPages <= 1) return null

  return (
    <div className="mt-8 flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="size-4" />
        Prev
      </Button>
      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
        (p) => (
          <Button
            key={p}
            variant={p === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(p)}
            className="min-w-9"
          >
            {p}
          </Button>
        )
      )}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= pagination.totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
