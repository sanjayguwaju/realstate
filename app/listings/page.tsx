"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback, Suspense } from "react"
import Link from "next/link"
import { Search, Loader2 } from "lucide-react"

import { RoleToggle } from "@/components/role-toggle"
import { Button } from "@/components/ui/button"
import {
  ListingCard,
  LoadingSkeleton,
  Pagination,
  EmptyState,
  FilterForm,
} from "@/components/listings"
import {
  ListingItem,
  PaginationInfo,
  filterSchema,
} from "@/lib/utils/listings"

function ListingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [listings, setListings] = useState<ListingItem[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [validationError, setValidationError] = useState<string | null>(null)

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
    setValidationError(null)

    const rawFilters = {
      suburb: suburb || undefined,
      priceMin: priceMin || undefined,
      priceMax: priceMax || undefined,
      beds: beds || undefined,
      baths: baths || undefined,
      type: type || undefined,
      keyword: keyword || undefined,
    }

    const parseResult = filterSchema.safeParse(rawFilters)
    if (!parseResult.success) {
      setValidationError(parseResult.error.issues[0].message)
      return
    }

    const valid = parseResult.data
    const params = new URLSearchParams()
    if (valid.suburb) params.set("suburb", valid.suburb)
    if (valid.priceMin !== undefined) params.set("price_min", String(valid.priceMin))
    if (valid.priceMax !== undefined) params.set("price_max", String(valid.priceMax))
    if (valid.beds !== undefined) params.set("beds", String(valid.beds))
    if (valid.baths !== undefined) params.set("baths", String(valid.baths))
    if (valid.type) params.set("type", valid.type)
    if (valid.keyword) params.set("keyword", valid.keyword)
    if (page > 1) params.set("page", String(page))

    router.push(`/listings?${params.toString()}`)
  }

  const clearFilters = () => {
    setValidationError(null)
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
        <div className="mb-6 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Find Your Property
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse listings across all suburbs and price ranges
          </p>
        </div>

        <FilterForm
          suburb={suburb}
          priceMin={priceMin}
          priceMax={priceMax}
          beds={beds}
          baths={baths}
          type={type}
          keyword={keyword}
          validationError={validationError}
          onSuburbChange={setSuburb}
          onPriceMinChange={setPriceMin}
          onPriceMaxChange={setPriceMax}
          onBedsChange={setBeds}
          onBathsChange={setBaths}
          onTypeChange={setType}
          onKeywordChange={setKeyword}
          onApplyFilters={() => applyFilters()}
          onClearFilters={clearFilters}
        />

        {loading ? (
          <div>
            <div className="mb-4 flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-sm">Loading properties…</span>
            </div>
            <LoadingSkeleton />
          </div>
        ) : listings.length === 0 ? (
          <EmptyState onClearFilters={clearFilters} />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {pagination?.total ?? 0}
                </span>{" "}
                properties found
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  searchParams={searchParams.toString()}
                />
              ))}
            </div>

            {pagination && (
              <Pagination
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={goToPage}
              />
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
