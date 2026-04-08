"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { PropertyDetail, getTypeEmoji } from "@/lib/utils/listings"

interface PropertyImageProps {
  property: PropertyDetail
}

export function PropertyImage({ property }: PropertyImageProps) {
  return (
    <Card className="mb-6 flex h-64 items-center justify-center overflow-hidden bg-muted/30 sm:h-80">
      {property.imageUrl ? (
        <div className="relative h-full w-full">
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
        </div>
      ) : (
        <span className="text-6xl">
          {getTypeEmoji(property.propertyType)}
        </span>
      )}
    </Card>
  )
}
