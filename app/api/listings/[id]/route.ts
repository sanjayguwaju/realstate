import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getListingById } from "@/lib/services/listings.service"
import { isAdmin } from "@/lib/middleware/auth"

const paramsSchema = z.object({
  id: z.string().uuid("Invalid listing ID format — expected a UUID v4"),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rawParams = await params
    const parseResult = paramsSchema.safeParse(rawParams)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      )
    }

    const { id } = parseResult.data

    const listing = await getListingById(id, isAdmin(req))

    if (!listing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error(`[GET /api/listings/:id] Unhandled error:`, error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
