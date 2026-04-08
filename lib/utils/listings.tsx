import { z } from "zod"
import { Home, Building2, Building, TreePine } from "lucide-react"
import { ReactNode } from "react"

export interface ListingItem {
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

export interface PropertyDetail {
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

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const PROPERTY_TYPES = [
  { value: "all", label: "All Types" },
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "townhouse", label: "Townhouse" },
  { value: "land", label: "Land" },
] as const

export const BEDROOM_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
] as const

export const BATHROOM_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
] as const

export const filterSchema = z.object({
  suburb: z.string().max(100).optional(),
  priceMin: z.coerce.number().int().min(0).optional(),
  priceMax: z.coerce.number().int().min(0).optional(),
  beds: z.coerce.number().int().min(0).optional(),
  baths: z.coerce.number().int().min(0).optional(),
  type: z.enum(["house", "apartment", "townhouse", "land"]).optional(),
  keyword: z.string().max(100).optional(),
})

export type FilterValues = z.infer<typeof filterSchema>

const typeIconMap: Record<string, ReactNode> = {
  house: <Home className="size-4" />,
  apartment: <Building2 className="size-4" />,
  townhouse: <Building className="size-4" />,
  land: <TreePine className="size-4" />,
}

export const getTypeIcon = (type: string): ReactNode => typeIconMap[type] ?? <Home className="size-4" />

const typeEmojiMap: Record<string, string> = {
  house: "🏠",
  apartment: "🏢",
  townhouse: "🏘️",
  land: "🌳",
}

export const getTypeEmoji = (type: string): string => typeEmojiMap[type] ?? "🏠"

const statusVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  under_offer: "secondary",
  sold: "destructive",
}

export const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => statusVariantMap[status] ?? "outline"

export const formatPrice = (price: string): string =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(parseFloat(price))
