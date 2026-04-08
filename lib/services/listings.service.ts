import { db } from "../db"
import { properties, agents } from "../db/schema"
import { and, gte, lte, eq, ilike, or, count } from "drizzle-orm"

export interface ListingsQuery {
  suburb?: string
  priceMin?: number
  priceMax?: number
  beds?: number
  baths?: number
  type?: string
  keyword?: string
  page: number
  limit: number
}

export async function getListings(query: ListingsQuery) {
  const {
    suburb,
    priceMin,
    priceMax,
    beds,
    baths,
    type,
    keyword,
    page,
    limit,
  } = query
  const offset = (page - 1) * limit

  const conditions = [
    suburb ? ilike(properties.suburb, `%${suburb}%`) : undefined,
    priceMin ? gte(properties.price, String(priceMin)) : undefined,
    priceMax ? lte(properties.price, String(priceMax)) : undefined,
    beds ? gte(properties.bedrooms, beds) : undefined,
    baths ? gte(properties.bathrooms, baths) : undefined,
    type ? eq(properties.propertyType, type) : undefined,
    keyword
      ? or(
          ilike(properties.title, `%${keyword}%`),
          ilike(properties.description, `%${keyword}%`)
        )
      : undefined,
  ].filter(Boolean) as ReturnType<typeof eq>[]

  const where = conditions.length ? and(...conditions) : undefined

  const [rows, [{ value: total }]] = await Promise.all([
    db
      .select({
        id: properties.id,
        title: properties.title,
        price: properties.price,
        suburb: properties.suburb,
        propertyType: properties.propertyType,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        status: properties.status,
        imageUrl: properties.imageUrl,
        agent: {
          id: agents.id,
          name: agents.name,
        },
      })
      .from(properties)
      .leftJoin(agents, eq(properties.agentId, agents.id))
      .where(where)
      .orderBy(properties.createdAt)
      .limit(limit)
      .offset(offset),

    db.select({ value: count() }).from(properties).where(where),
  ])

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total: Number(total),
      totalPages: Math.ceil(Number(total) / limit),
    },
  }
}


export async function getListingById(id: string, admin: boolean) {
  const [row] = await db
    .select({
      id: properties.id,
      title: properties.title,
      description: properties.description,
      price: properties.price,
      suburb: properties.suburb,
      state: properties.state,
      postcode: properties.postcode,
      propertyType: properties.propertyType,
      bedrooms: properties.bedrooms,
      bathrooms: properties.bathrooms,
      parking: properties.parking,
      status: properties.status,
      imageUrl: properties.imageUrl,
      internalNotes: properties.internalNotes,
      agent: {
        id: agents.id,
        name: agents.name,
        phone: agents.phone,
        email: agents.email,
      },
    })
    .from(properties)
    .leftJoin(agents, eq(properties.agentId, agents.id))
    .where(eq(properties.id, id))

  if (!row) return null

  if (!admin) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { internalNotes: _internalNotes, ...publicRow } = row
    return publicRow
  }

  return row
}
