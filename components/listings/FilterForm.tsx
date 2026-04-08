"use client"

import { Search, X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PROPERTY_TYPES,
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
} from "@/lib/utils/listings"

interface FilterFormProps {
  suburb: string
  priceMin: string
  priceMax: string
  beds: string
  baths: string
  type: string
  keyword: string
  validationError: string | null
  onSuburbChange: (value: string) => void
  onPriceMinChange: (value: string) => void
  onPriceMaxChange: (value: string) => void
  onBedsChange: (value: string) => void
  onBathsChange: (value: string) => void
  onTypeChange: (value: string) => void
  onKeywordChange: (value: string) => void
  onApplyFilters: () => void
  onClearFilters: () => void
}

export function FilterForm({
  suburb,
  priceMin,
  priceMax,
  beds,
  baths,
  type,
  keyword,
  validationError,
  onSuburbChange,
  onPriceMinChange,
  onPriceMaxChange,
  onBedsChange,
  onBathsChange,
  onTypeChange,
  onKeywordChange,
  onApplyFilters,
  onClearFilters,
}: FilterFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onApplyFilters()
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="size-4" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {validationError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="filter-suburb">Suburb</Label>
            <Input
              id="filter-suburb"
              placeholder="e.g. Northside"
              value={suburb}
              onChange={(e) => onSuburbChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-price-min">Min Price</Label>
            <Input
              id="filter-price-min"
              type="number"
              placeholder="$0"
              value={priceMin}
              onChange={(e) => onPriceMinChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-price-max">Max Price</Label>
            <Input
              id="filter-price-max"
              type="number"
              placeholder="No max"
              value={priceMax}
              onChange={(e) => onPriceMaxChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Bedrooms (min)</Label>
            <Select
              value={beds || "any"}
              onValueChange={(v) => onBedsChange(v === "any" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {BEDROOM_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Bathrooms (min)</Label>
            <Select
              value={baths || "any"}
              onValueChange={(v) => onBathsChange(v === "any" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {BATHROOM_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Property Type</Label>
            <Select
              value={type || "all"}
              onValueChange={(v) => onTypeChange(v === "all" ? "" : v)}
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
              onChange={(e) => onKeywordChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={onApplyFilters} className="flex-1">
              <Search className="size-4" />
              Search
            </Button>
            <Button variant="outline" onClick={onClearFilters}>
              <X className="size-4" />
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
