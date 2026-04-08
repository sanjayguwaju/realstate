import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getListings } from "@/lib/services/listings.service"

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).transform(v => Math.min(v, 100)).default(20),
  price_min: z.coerce.number().int().optional(),
  price_max: z.coerce.number().int().optional(),
  beds: z.coerce.number().int().optional(),
  baths: z.coerce.number().int().optional(),
  type: z.enum(["house", "apartment", "townhouse", "land"]).optional(),
  suburb: z.string().optional(),
  keyword: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const rawQuery = Object.fromEntries(sp.entries())
    const parseResult = querySchema.safeParse(rawQuery)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const {
      page,
      limit,
      price_min: priceMin,
      price_max: priceMax,
      beds,
      baths,
      type,
      suburb,
      keyword,
    } = parseResult.data

    const result = await getListings({
      suburb,
      priceMin,
      priceMax,
      beds,
      baths,
      type,
      keyword,
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
