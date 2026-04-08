import { NextRequest, NextResponse } from "next/server"
import { getListingById } from "@/lib/services/listings.service"
import { isAdmin } from "@/lib/middleware/auth"
import { validate as uuidValidate, version as uuidVersion } from "uuid"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!uuidValidate(id) || uuidVersion(id) !== 4) {
      return NextResponse.json(
        { error: "Invalid listing ID format — expected a UUID v4" },
        { status: 400 }
      )
    }

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
