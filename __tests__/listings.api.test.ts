import { describe, it, expect, vi } from "vitest"
import { NextRequest } from "next/server"
import { GET as getListingsHandler } from "@/app/api/listings/route"
import { GET as getListingByIdHandler } from "@/app/api/listings/[id]/route"
import { mockGetListings, mockGetListingById, mockProperties } from "./mocks"

// Mock the listings service
vi.mock("@/lib/services/listings.service", () => ({
  getListings: vi.fn((query) => Promise.resolve(mockGetListings(query))),
  getListingById: vi.fn((id, admin) => Promise.resolve(mockGetListingById(id, admin))),
}))

// Mock the auth middleware
vi.mock("@/lib/middleware/auth", () => ({
  isAdmin: vi.fn((req) => req.headers.get("x-user-role") === "admin"),
}))

// Helper to create NextRequest
function createRequest(url: string, headers?: Record<string, string>) {
  return new NextRequest(new URL(url, "http://localhost:3000"), { headers })
}

// ── GET /api/listings ─────────────────────────────────────────────────────────

describe("GET /api/listings", () => {
  it("returns paginated results with correct shape", async () => {
    const req = createRequest("/api/listings")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toHaveProperty("data")
    expect(body).toHaveProperty("pagination")
    expect(body.pagination).toEqual(
      expect.objectContaining({
        page: expect.any(Number),
        limit: expect.any(Number),
        total: expect.any(Number),
        totalPages: expect.any(Number),
      })
    )
    expect(Array.isArray(body.data)).toBe(true)
  })

  it("returns listings with expected fields", async () => {
    const req = createRequest("/api/listings?limit=1")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    const item = body.data[0]
    expect(item).toHaveProperty("id")
    expect(item).toHaveProperty("title")
    expect(item).toHaveProperty("price")
    expect(item).toHaveProperty("suburb")
    expect(item).toHaveProperty("propertyType")
    expect(item).toHaveProperty("bedrooms")
    expect(item).toHaveProperty("bathrooms")
    expect(item).toHaveProperty("status")
    expect(item).toHaveProperty("agent")
    // List endpoint should NOT include admin-only fields
    expect(item).not.toHaveProperty("internalNotes")
    expect(item).not.toHaveProperty("description")
  })

  // ── Filter tests ──────────────────────────────────────────────────────────

  it("filters by price range", async () => {
    const req = createRequest("/api/listings?price_min=500000&price_max=800000")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data.length).toBeGreaterThanOrEqual(1)
    body.data.forEach((p: { price: string }) => {
      expect(Number(p.price)).toBeGreaterThanOrEqual(500000)
      expect(Number(p.price)).toBeLessThanOrEqual(800000)
    })
  })

  it("filters by suburb (case-insensitive)", async () => {
    const req = createRequest("/api/listings?suburb=northside")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data.length).toBeGreaterThanOrEqual(1)
    body.data.forEach((p: { suburb: string }) =>
      expect(p.suburb.toLowerCase()).toContain("northside")
    )
  })

  it("filters by property type", async () => {
    const req = createRequest("/api/listings?type=apartment")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data.length).toBeGreaterThanOrEqual(1)
    body.data.forEach((p: { propertyType: string }) =>
      expect(p.propertyType).toBe("apartment")
    )
  })

  it("filters by minimum bedrooms", async () => {
    const req = createRequest("/api/listings?beds=3")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data.length).toBeGreaterThanOrEqual(1)
    body.data.forEach((p: { bedrooms: number }) =>
      expect(p.bedrooms).toBeGreaterThanOrEqual(3)
    )
  })

  it("filters by minimum bathrooms", async () => {
    const req = createRequest("/api/listings?baths=2")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    body.data.forEach((p: { bathrooms: number }) =>
      expect(p.bathrooms).toBeGreaterThanOrEqual(2)
    )
  })

  it("filters by keyword (title/description)", async () => {
    const req = createRequest("/api/listings?keyword=pool")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data.length).toBeGreaterThanOrEqual(1)
  })

  it("supports combined filters", async () => {
    const req = createRequest("/api/listings?suburb=northside&type=house&beds=3")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    body.data.forEach(
      (p: { suburb: string; propertyType: string; bedrooms: number }) => {
        expect(p.suburb.toLowerCase()).toContain("northside")
        expect(p.propertyType).toBe("house")
        expect(p.bedrooms).toBeGreaterThanOrEqual(3)
      }
    )
  })

  // ── Pagination tests ──────────────────────────────────────────────────────

  it("respects page and limit parameters", async () => {
    const req = createRequest("/api/listings?page=1&limit=5")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data.length).toBeLessThanOrEqual(5)
    expect(body.pagination.page).toBe(1)
    expect(body.pagination.limit).toBe(5)
  })

  it("calculates totalPages correctly", async () => {
    const req = createRequest("/api/listings?limit=3")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    const { total, totalPages, limit } = body.pagination
    expect(totalPages).toBe(Math.ceil(total / limit))
  })

  it("returns empty data for a page beyond totalPages", async () => {
    const req = createRequest("/api/listings?page=999&limit=20")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.data).toEqual([])
    expect(body.pagination.page).toBe(999)
  })

  // ── Input validation tests ────────────────────────────────────────────────

  it("rejects invalid property type with 400", async () => {
    const req = createRequest("/api/listings?type=castle")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body).toHaveProperty("error")
  })

  it("defaults to page 1 if page is missing", async () => {
    const req = createRequest("/api/listings")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.pagination.page).toBe(1)
  })

  it("clamps limit to max 100", async () => {
    const req = createRequest("/api/listings?limit=999")
    const res = await getListingsHandler(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.pagination.limit).toBe(100)
  })
})

// ── GET /api/listings/:id ─────────────────────────────────────────────────────

describe("GET /api/listings/:id", () => {
  it("returns 404 for a valid UUID that does not exist", async () => {
    const req = createRequest("/api/listings/123e4567-e89b-42d3-a456-426614174999")
    const res = await getListingByIdHandler(req, { params: Promise.resolve({ id: "123e4567-e89b-42d3-a456-426614174999" }) })
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body).toEqual({ error: "Not found" })
  })

  it("returns 400 for an invalid UUID format", async () => {
    const req = createRequest("/api/listings/not-a-uuid")
    const res = await getListingByIdHandler(req, { params: Promise.resolve({ id: "not-a-uuid" }) })
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body).toHaveProperty("error")
    expect(body.error).toContain("UUID")
  })

  it("excludes internalNotes for normal users", async () => {
    const id = mockProperties[0].id
    const req = createRequest(`/api/listings/${id}`)
    const res = await getListingByIdHandler(req, { params: Promise.resolve({ id }) })
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).not.toHaveProperty("internalNotes")
  })

  it("includes internalNotes for admin users", async () => {
    const id = mockProperties[0].id
    const req = createRequest(`/api/listings/${id}`, { "x-user-role": "admin" })
    const res = await getListingByIdHandler(req, { params: Promise.resolve({ id }) })
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toHaveProperty("internalNotes")
  })

  it("denies admin access for incorrect role header values", async () => {
    const id = mockProperties[0].id
    // "Admin" (wrong case) should NOT grant admin access
    const req = createRequest(`/api/listings/${id}`, { "x-user-role": "Admin" })
    const res = await getListingByIdHandler(req, { params: Promise.resolve({ id }) })
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).not.toHaveProperty("internalNotes")
  })

  it("returns full property details with agent info", async () => {
    const id = mockProperties[0].id
    const req = createRequest(`/api/listings/${id}`)
    const res = await getListingByIdHandler(req, { params: Promise.resolve({ id }) })
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toHaveProperty("title")
    expect(body).toHaveProperty("description")
    expect(body).toHaveProperty("price")
    expect(body).toHaveProperty("suburb")
    expect(body).toHaveProperty("state")
    expect(body).toHaveProperty("postcode")
    expect(body).toHaveProperty("propertyType")
    expect(body).toHaveProperty("bedrooms")
    expect(body).toHaveProperty("bathrooms")
    expect(body).toHaveProperty("parking")
    expect(body).toHaveProperty("status")
    expect(body).toHaveProperty("agent")
    expect(body.agent).toHaveProperty("id")
    expect(body.agent).toHaveProperty("name")
    expect(body.agent).toHaveProperty("phone")
    expect(body.agent).toHaveProperty("email")
  })
})
