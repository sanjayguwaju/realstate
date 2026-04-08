"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  BedDouble,
  Bath,
  Car,
  Home,
  Building2,
  Building,
  TreePine,
  MapPin,
  Phone,
  Mail,
  ShieldAlert,
  Loader2,
  Search,
} from "lucide-react"

import { RoleToggle } from "@/components/role-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface PropertyDetail {
  id: string
  title: string
  description: string | null
  price: string
  suburb: string
  state: string
  postcode: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  parking: number | null
  status: string
  imageUrl?: string | null
  internalNotes?: string | null
  agent: {
    id: string
    name: string
    phone: string | null
    email: string | null
  } | null
}

function formatPrice(price: string): string {
  const num = parseFloat(price)
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(num)
}

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default"
    case "under_offer":
      return "secondary"
    case "sold":
      return "destructive"
    default:
      return "outline"
  }
}

function getTypeEmoji(type: string) {
  switch (type) {
    case "house":
      return "🏠"
    case "apartment":
      return "🏢"
    case "townhouse":
      return "🏘️"
    case "land":
      return "🌳"
    default:
      return "🏠"
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "house":
      return <Home className="size-4" />
    case "apartment":
      return <Building2 className="size-4" />
    case "townhouse":
      return <Building className="size-4" />
    case "land":
      return <TreePine className="size-4" />
    default:
      return <Home className="size-4" />
  }
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Skeleton className="mb-4 h-4 w-40" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-80" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="mt-6 h-64 w-full rounded-xl" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    </div>
  )
}

function DetailContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true)
      try {
        const res = await fetch(`/api/listings/${params.id}`)
        if (res.status === 404) {
          setNotFound(true)
          return
        }
        const data = await res.json()
        setProperty(data)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [params.id])

  const backUrl = `/listings?${searchParams.toString()}`

  if (loading) {
    return <DetailSkeleton />
  }

  if (notFound || !property) {
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

  const agentInitials = property.agent
    ? property.agent.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "?"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/listings"
            className="font-heading text-lg font-bold tracking-tight"
          >
            Premier <span className="text-primary">Realty</span>
          </Link>
          <nav className="flex items-center gap-4">
            <RoleToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/listings">
                <Search className="size-4" />
                Search
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Back link */}
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={backUrl}>
            <ArrowLeft className="size-4" />
            Back to search results
          </Link>
        </Button>

        {/* Title + Price bar */}
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

        {/* Image Display */}
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

        {/* Content grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left column */}
          <div className="space-y-4">
            {/* Features */}
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
                    <span className="text-xs text-muted-foreground">
                      Bedrooms
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-muted/50 p-4 text-center">
                    <Bath className="mb-1.5 size-5 text-muted-foreground" />
                    <span className="font-heading text-2xl font-bold">
                      {property.bathrooms}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Bathrooms
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-muted/50 p-4 text-center">
                    <Car className="mb-1.5 size-5 text-muted-foreground" />
                    <span className="font-heading text-2xl font-bold">
                      {property.parking ?? 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Parking
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-muted/50 p-4 text-center">
                    <div className="mb-1.5">
                      {getTypeIcon(property.propertyType)}
                    </div>
                    <span className="font-heading text-sm font-bold capitalize">
                      {property.propertyType}
                    </span>
                    <span className="text-xs text-muted-foreground">Type</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {property.description && (
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="leading-relaxed text-muted-foreground">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Agent card */}
            {property.agent && (
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Listing Agent</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center pt-6 text-center">
                  <Avatar size="lg" className="mb-3">
                    <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                      {agentInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-heading text-base font-semibold">
                    {property.agent.name}
                  </div>
                  <Separator className="my-4" />
                  <div className="w-full space-y-2 text-sm text-muted-foreground">
                    {property.agent.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="size-3.5" />
                        {property.agent.phone}
                      </div>
                    )}
                    {property.agent.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="size-3.5" />
                        {property.agent.email}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Internal Notes (admin only) */}
            {property.internalNotes && (
              <Alert className="border-amber-500/30 bg-amber-500/5">
                <ShieldAlert className="size-4 text-amber-600" />
                <AlertTitle className="text-amber-700 dark:text-amber-400">
                  Internal Notes (Admin)
                </AlertTitle>
                <AlertDescription className="text-amber-600/80 dark:text-amber-400/70">
                  {property.internalNotes}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PropertyDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading…</span>
        </div>
      }
    >
      <DetailContent />
    </Suspense>
  )
}
