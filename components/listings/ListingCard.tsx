"use client"

import Link from "next/link"
import Image from "next/image"
import { BedDouble, Bath, MapPin, User } from "lucide-react"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ListingItem,
  getStatusVariant,
  getTypeIcon,
  getTypeEmoji,
  formatPrice,
} from "@/lib/utils/listings"

interface ListingCardProps {
  listing: ListingItem
  searchParams: string
}

export function ListingCard({ listing, searchParams }: ListingCardProps) {
  return (
    <Link
      key={listing.id}
      href={`/listings/${listing.id}?${searchParams}`}
      className="group"
    >
      <Card className="h-full transition-all duration-200 group-hover:shadow-lg group-hover:ring-2 group-hover:ring-primary/30">
        {/* Card image area */}
        <div className="relative flex h-40 w-full overflow-hidden bg-muted/50">
          {listing.imageUrl ? (
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <span className="text-4xl">{getTypeEmoji(listing.propertyType)}</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant={getStatusVariant(listing.status)}>
              {listing.status.replace("_", " ")}
            </Badge>
          </div>
          <div className="absolute right-3 bottom-3">
            <Badge
              variant="outline"
              className="bg-background/80 capitalize backdrop-blur-sm"
            >
              {getTypeIcon(listing.propertyType)}
              {listing.propertyType}
            </Badge>
          </div>
        </div>

        <CardHeader>
          <div className="text-lg font-bold text-primary">
            {formatPrice(listing.price)}
          </div>
          <CardTitle className="line-clamp-2 text-sm">
            {listing.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {listing.suburb}
          </div>
        </CardHeader>

        <CardContent>
          <Separator className="mb-3" />
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BedDouble className="size-3.5" />
              <span className="font-semibold text-foreground">
                {listing.bedrooms}
              </span>{" "}
              beds
            </span>
            <span className="flex items-center gap-1">
              <Bath className="size-3.5" />
              <span className="font-semibold text-foreground">
                {listing.bathrooms}
              </span>{" "}
              baths
            </span>
          </div>
        </CardContent>

        {listing.agent && (
          <CardFooter className="text-xs text-muted-foreground">
            <User className="mr-1 size-3" />
            {listing.agent.name}
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}
