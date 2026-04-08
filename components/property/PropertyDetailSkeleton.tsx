"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function PropertyDetailSkeleton() {
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
