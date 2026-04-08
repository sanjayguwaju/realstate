import { NextRequest, NextResponse } from "next/server"
import { getListings } from "@/lib/services/listings.service"

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams

    const page = Math.max(1, Number(sp.get("page")) || 1)
    const limit = Math.min(100, Math.max(1, Number(sp.get("limit")) || 20))

    const priceMin = sp.get("price_min")
      ? Number(sp.get("price_min"))
      : undefined
    const priceMax = sp.get("price_max")
      ? Number(sp.get("price_max"))
      : undefined
    const beds = sp.get("beds") ? Number(sp.get("beds")) : undefined
    const baths = sp.get("baths") ? Number(sp.get("baths")) : undefined

    if (priceMin !== undefined && isNaN(priceMin)) {
      return NextResponse.json(
        { error: "price_min must be a valid number" },
        { status: 400 }
      )
    }
    if (priceMax !== undefined && isNaN(priceMax)) {
      return NextResponse.json(
        { error: "price_max must be a valid number" },
        { status: 400 }
      )
    }
    if (beds !== undefined && isNaN(beds)) {
      return NextResponse.json(
        { error: "beds must be a valid number" },
        { status: 400 }
      )
    }
    if (baths !== undefined && isNaN(baths)) {
      return NextResponse.json(
        { error: "baths must be a valid number" },
        { status: 400 }
      )
    }

    const validTypes = ["house", "apartment", "townhouse", "land"]
    const type = sp.get("type") ?? undefined
    if (type && !validTypes.includes(type)) {
      return NextResponse.json(
        { error: `type must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      )
    }

    const result = await getListings({
      suburb: sp.get("suburb") ?? undefined,
      priceMin,
      priceMax,
      beds,
      baths,
      type,
      keyword: sp.get("keyword") ?? undefined,
      page,
      limit,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[GET /api/listings] Unhandled error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
