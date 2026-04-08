"use client"

import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PropertyDetail, formatPrice, getStatusVariant } from "@/lib/utils/listings"

interface PropertyHeaderProps {
  property: PropertyDetail
}

export function PropertyHeader({ property }: PropertyHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          {property.title}
        </h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {property.suburb}, {property.state} {property.postcode}
          </span>
          <Badge variant={getStatusVariant(property.status)}>
            {property.status.replace("_", " ")}
          </Badge>
        </div>
      </div>
      <div className="text-2xl font-bold text-primary sm:text-3xl">
        {formatPrice(property.price)}
      </div>
    </div>
  )
}
