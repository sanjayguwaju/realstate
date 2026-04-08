"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Search } from "lucide-react"

import { RoleToggle } from "@/components/role-toggle"
import { Button } from "@/components/ui/button"
import { PropertyDetail } from "@/lib/utils/listings"
import {
  PropertyDetailSkeleton,
  NotFoundState,
  PropertyHeader,
  PropertyImage,
  PropertyFeatures,
  PropertyDescription,
  AgentCard,
  InternalNotes,
} from "@/components/property"

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
    return <PropertyDetailSkeleton />
  }

  if (notFound || !property) {
    return <NotFoundState backUrl={backUrl} />
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
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={backUrl}>
            <ArrowLeft className="size-4" />
            Back to search results
          </Link>
        </Button>

        <PropertyHeader property={property} />
        <PropertyImage property={property} />

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            <PropertyFeatures property={property} />
            {property.description && (
              <PropertyDescription description={property.description} />
            )}
          </div>

          <div className="space-y-4">
            <AgentCard agent={property.agent} />
            {property.internalNotes && (
              <InternalNotes notes={property.internalNotes} />
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
