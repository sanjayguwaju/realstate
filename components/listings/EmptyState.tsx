"use client"

import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  onClearFilters: () => void
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <Card className="py-16 text-center">
      <CardContent className="flex flex-col items-center gap-3">
        <SearchX className="size-12 text-muted-foreground/50" />
        <div>
          <h3 className="font-heading text-lg font-semibold">
            No properties found
          </h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or clearing all search criteria.
          </p>
        </div>
        <Button variant="outline" onClick={onClearFilters} className="mt-2">
          Clear all filters
        </Button>
      </CardContent>
    </Card>
  )
}
