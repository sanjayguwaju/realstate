"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  SlidersHorizontal,
  X,
  Home,
  Building2,
  TreePine,
  Building,
  BedDouble,
  Bath,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
  SearchX,
} from "lucide-react"

import { RoleToggle } from "@/components/role-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ListingItem {
  id: string
  title: string
  price: string
  suburb: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  status: string
  imageUrl?: string
  agent: { id: string; name: string } | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const PROPERTY_TYPES = [
  { value: "all", label: "All Types" },
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "townhouse", label: "Townhouse" },
  { value: "land", label: "Land" },
]

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

function formatPrice(price: string): string {
  const num = parseFloat(price)
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(num)
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-20" />
            <div className="mt-3 flex gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-32" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function ListingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [listings, setListings] = useState<ListingItem[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)

  const [suburb, setSuburb] = useState(searchParams.get("suburb") ?? "")
  const [priceMin, setPriceMin] = useState(searchParams.get("price_min") ?? "")
  const [priceMax, setPriceMax] = useState(searchParams.get("price_max") ?? "")
  const [beds, setBeds] = useState(searchParams.get("beds") ?? "")
  const [baths, setBaths] = useState(searchParams.get("baths") ?? "")
  const [type, setType] = useState(searchParams.get("type") ?? "")
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "")

  const currentPage = Number(searchParams.get("page")) || 1

  const fetchListings = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      const spSuburb = searchParams.get("suburb")
      const spPriceMin = searchParams.get("price_min")
      const spPriceMax = searchParams.get("price_max")
      const spBeds = searchParams.get("beds")
      const spBaths = searchParams.get("baths")
      const spType = searchParams.get("type")
      const spKeyword = searchParams.get("keyword")

      if (spSuburb) params.set("suburb", spSuburb)
      if (spPriceMin) params.set("price_min", spPriceMin)
      if (spPriceMax) params.set("price_max", spPriceMax)
      if (spBeds) params.set("beds", spBeds)
      if (spBaths) params.set("baths", spBaths)
      if (spType) params.set("type", spType)
      if (spKeyword) params.set("keyword", spKeyword)

      params.set("page", String(currentPage))
      params.set("limit", "12")

      const res = await fetch(`/api/listings?${params.toString()}`)
      const data = await res.json()
      setListings(data.data)
      setPagination(data.pagination)
    } catch {
      setListings([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [searchParams, currentPage])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  // Sync inputs with URL params on load or navigation
  useEffect(() => {
    setSuburb(searchParams.get("suburb") ?? "")
    setPriceMin(searchParams.get("price_min") ?? "")
    setPriceMax(searchParams.get("price_max") ?? "")
    setBeds(searchParams.get("beds") ?? "")
    setBaths(searchParams.get("baths") ?? "")
    setType(searchParams.get("type") ?? "")
    setKeyword(searchParams.get("keyword") ?? "")
  }, [searchParams])

  const applyFilters = (page = 1) => {
    const params = new URLSearchParams()
    if (suburb) params.set("suburb", suburb)
    if (priceMin) params.set("price_min", priceMin)
    if (priceMax) params.set("price_max", priceMax)
    if (beds) params.set("beds", beds)
    if (baths) params.set("baths", baths)
    if (type) params.set("type", type)
    if (keyword) params.set("keyword", keyword)
    if (page > 1) params.set("page", String(page))

    router.push(`/listings?${params.toString()}`)
  }

  const clearFilters = () => {
    setSuburb("")
    setPriceMin("")
    setPriceMax("")
    setBeds("")
    setBaths("")
    setType("")
    setKeyword("")
    router.push("/listings")
  }

  const goToPage = (page: number) => {
    applyFilters(page)
  }

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
        {/* Hero */}
        <div className="mb-6 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Find Your Property
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse listings across all suburbs and price ranges
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="size-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5">
                <Label htmlFor="filter-suburb">Suburb</Label>
                <Input
                  id="filter-suburb"
                  placeholder="e.g. Northside"
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="filter-price-min">Min Price</Label>
                <Input
                  id="filter-price-min"
                  type="number"
                  placeholder="$0"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="filter-price-max">Max Price</Label>
                <Input
                  id="filter-price-max"
                  type="number"
                  placeholder="No max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Bedrooms (min)</Label>
                <Select
                  value={beds || "any"}
                  onValueChange={(v) => setBeds(v === "any" ? "" : v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Bathrooms (min)</Label>
                <Select
                  value={baths || "any"}
                  onValueChange={(v) => setBaths(v === "any" ? "" : v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Property Type</Label>
                <Select
                  value={type || "all"}
                  onValueChange={(v) => setType(v === "all" ? "" : v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="filter-keyword">Keyword</Label>
                <Input
                  id="filter-keyword"
                  placeholder="e.g. pool, garage"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={() => applyFilters()} className="flex-1">
                  <Search className="size-4" />
                  Search
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  <X className="size-4" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div>
            <div className="mb-4 flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-sm">Loading properties…</span>
            </div>
            <LoadingSkeleton />
          </div>
        ) : listings.length === 0 ? (
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
              <Button variant="outline" onClick={clearFilters} className="mt-2">
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {pagination?.total ?? 0}
                </span>{" "}
                properties found
              </p>
            </div>

            {/* Listings grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}?${searchParams.toString()}`}
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
                          <span className="text-4xl">
                            {listing.propertyType === "house"
                              ? "🏠"
                              : listing.propertyType === "apartment"
                                ? "🏢"
                                : listing.propertyType === "townhouse"
                                  ? "🏘️"
                                  : "🌳"}
                          </span>
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
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  <ChevronLeft className="size-4" />
                  Prev
                </Button>
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((p) => (
                  <Button
                    key={p}
                    variant={p === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(p)}
                    className="min-w-9"
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading…</span>
        </div>
      }
    >
      <ListingsContent />
    </Suspense>
  )
}
