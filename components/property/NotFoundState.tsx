"use client"

import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface NotFoundStateProps {
  backUrl: string
}

export function NotFoundState({ backUrl }: NotFoundStateProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href={backUrl}>
          <ArrowLeft className="size-4" />
          Back to search
        </Link>
      </Button>
      <Card className="py-16 text-center">
        <CardContent className="flex flex-col items-center gap-3">
          <Search className="size-12 text-muted-foreground/50" />
          <h3 className="font-heading text-lg font-semibold">
            Property not found
          </h3>
          <p className="text-sm text-muted-foreground">
            This property may have been removed or the link is incorrect.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
