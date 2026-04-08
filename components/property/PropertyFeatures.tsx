"use client"

import { BedDouble, Bath, Car } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PropertyDetail, getTypeIcon } from "@/lib/utils/listings"

interface PropertyFeaturesProps {
  property: PropertyDetail
}

export function PropertyFeatures({ property }: PropertyFeaturesProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Property Features</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex flex-col items-center rounded-lg bg-muted/50 p-4 text-center">
            <BedDouble className="mb-1.5 size-5 text-muted-foreground" />
            <span className="font-heading text-2xl font-bold">
              {property.bedrooms}
            </span>
            <span className="text-xs text-muted-foreground">Bedrooms</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-muted/50 p-4 text-center">
            <Bath className="mb-1.5 size-5 text-muted-foreground" />
            <span className="font-heading text-2xl font-bold">
              {property.bathrooms}
            </span>
            <span className="text-xs text-muted-foreground">Bathrooms</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-muted/50 p-4 text-center">
            <Car className="mb-1.5 size-5 text-muted-foreground" />
            <span className="font-heading text-2xl font-bold">
              {property.parking ?? 0}
            </span>
            <span className="text-xs text-muted-foreground">Parking</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-muted/50 p-4 text-center">
            <div className="mb-1.5">{getTypeIcon(property.propertyType)}</div>
            <span className="font-heading text-sm font-bold capitalize">
              {property.propertyType}
            </span>
            <span className="text-xs text-muted-foreground">Type</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
