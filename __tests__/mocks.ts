// Mock data for tests
const mockAgents = [
  { id: "agent-1", name: "Alice Nguyen", phone: "0400 111 222", email: "alice@realty.com", agency: "Premier Realty", isAdmin: true },
  { id: "agent-2", name: "Bob Martinez", phone: "0400 333 444", email: "bob@realty.com", agency: "Premier Realty", isAdmin: false },
  { id: "agent-3", name: "Carol Wu", phone: "0400 555 666", email: "carol@realty.com", agency: "Sunrise Property", isAdmin: false },
]

export const mockProperties = [
  {
    id: "123e4567-e89b-42d3-a456-426614174001",
    title: "3BR Family Home in Northside",
    description: "Spacious home with large backyard, double garage, and modern kitchen.",
    price: "750000",
    suburb: "Northside",
    state: "QLD",
    postcode: "4007",
    propertyType: "house",
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    internalNotes: "Vendor motivated. May accept from $720k.",
    agentId: "agent-1",
  },
  {
    id: "123e4567-e89b-42d3-a456-426614174002",
    title: "Modern 2BR Apartment — City Views",
    description: "High-floor apartment with gym and rooftop terrace. Floor-to-ceiling windows.",
    price: "520000",
    suburb: "CBD",
    state: "QLD",
    postcode: "4000",
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-78b9dba3b914?w=800&q=80",
    internalNotes: null,
    agentId: "agent-2",
  },
  {
    id: "123e4567-e89b-42d3-a456-426614174003",
    title: "Luxury 5BR Estate — Pool & Tennis Court",
    description: "Stunning executive home with resort-style pool, floodlit tennis court.",
    price: "2100000",
    suburb: "Ascot",
    state: "QLD",
    postcode: "4007",
    propertyType: "house",
    bedrooms: 5,
    bathrooms: 3,
    parking: 3,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    internalNotes: "Under offer at $3.1M. Buyer finance approved.",
    agentId: "agent-1",
  },
  {
    id: "123e4567-e89b-42d3-a456-426614174004",
    title: "Cozy 1BR Unit Near Train Station",
    description: "Ideal for first-time buyers or investors. Walking distance to train.",
    price: "320000",
    suburb: "Woolloongabba",
    state: "QLD",
    postcode: "4102",
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    parking: 0,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80",
    internalNotes: null,
    agentId: "agent-2",
  },
  {
    id: "123e4567-e89b-42d3-a456-426614174005",
    title: "Renovated Queenslander — Character Charm",
    description: "Beautifully restored Queenslander with VJ walls, polished hardwood floors.",
    price: "890000",
    suburb: "Paddington",
    state: "QLD",
    postcode: "4064",
    propertyType: "house",
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-90f7acb55eec?w=800&q=80",
    internalNotes: "Heritage listed — restrictions on exterior modifications.",
    agentId: "agent-3",
  },
  {
    id: "123e4567-e89b-42d3-a456-426614174006",
    title: "Brand New Townhouse — End of Terrace",
    description: "Contemporary 3-level townhouse with rooftop terrace and private courtyard.",
    price: "650000",
    suburb: "Nundah",
    state: "QLD",
    postcode: "4012",
    propertyType: "townhouse",
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    internalNotes: "DA approved for a 2-storey 4BR home.",
    agentId: "agent-2",
  },
  {
    id: "123e4567-e89b-42d3-a456-426614174007",
    title: "Penthouse Living — 180° River Views",
    description: "Full-floor penthouse with private lift access, gourmet kitchen.",
    price: "1850000",
    suburb: "New Farm",
    state: "QLD",
    postcode: "4005",
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-78b9dba3b914?w=800&q=80",
    internalNotes: null,
    agentId: "agent-1",
  },
  {
    id: "123e4567-e89b-42d3-a456-426614174008",
    title: "4BR Family Home with Pool",
    description: "Spacious single-level home with in-ground pool, covered outdoor area.",
    price: "950000",
    suburb: "Carindale",
    state: "QLD",
    postcode: "4152",
    propertyType: "house",
    bedrooms: 4,
    bathrooms: 2,
    parking: 2,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    internalNotes: "Property includes a separate studio/granny flat.",
    agentId: "agent-1",
  },
  {
    id: "123e4567-e89b-42d3-a456-426614174009",
    title: "Vacant Land — Build Your Dream Home",
    description: "Flat 650sqm block in an established neighbourhood. All services connected.",
    price: "450000",
    suburb: "Mount Gravatt",
    state: "QLD",
    postcode: "4122",
    propertyType: "land",
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80",
    internalNotes: "Town plan allows for 2-lot subdivision.",
    agentId: "agent-3",
  },
  {
    id: "123e4567-e89b-42d3-a456-426614174010",
    title: "Waterfront Townhouse — Marina Access",
    description: "Directly on the marina with private pontoon. Open-plan living.",
    price: "1200000",
    suburb: "Manly",
    state: "QLD",
    postcode: "4179",
    propertyType: "townhouse",
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-90f7acb55eec?w=800&q=80",
    internalNotes: "Vendor will consider JV with experienced developer.",
    agentId: "agent-1",
  },
]

// Helper functions for filtering
export function mockGetListings(query: {
  suburb?: string
  priceMin?: number
  priceMax?: number
  beds?: number
  baths?: number
  type?: string
  keyword?: string
  page: number
  limit: number
}) {
  let filtered = [...mockProperties]

  if (query.suburb) {
    const suburbLower = query.suburb.toLowerCase()
    filtered = filtered.filter(p => p.suburb.toLowerCase().includes(suburbLower))
  }

  if (query.priceMin !== undefined) {
    filtered = filtered.filter(p => Number(p.price) >= query.priceMin!)
  }

  if (query.priceMax !== undefined) {
    filtered = filtered.filter(p => Number(p.price) <= query.priceMax!)
  }

  if (query.beds !== undefined) {
    filtered = filtered.filter(p => p.bedrooms >= query.beds!)
  }

  if (query.baths !== undefined) {
    filtered = filtered.filter(p => p.bathrooms >= query.baths!)
  }

  if (query.type) {
    filtered = filtered.filter(p => p.propertyType === query.type)
  }

  if (query.keyword) {
    const keywordLower = query.keyword.toLowerCase()
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(keywordLower) ||
      p.description.toLowerCase().includes(keywordLower)
    )
  }

  const total = filtered.length
  const offset = (query.page - 1) * query.limit
  const paginated = filtered.slice(offset, offset + query.limit)

  // Add agent info to each property
  const data = paginated.map(p => {
    const agent = mockAgents.find(a => a.id === p.agentId)!
    return {
      id: p.id,
      title: p.title,
      price: p.price,
      suburb: p.suburb,
      propertyType: p.propertyType,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      status: p.status,
      imageUrl: p.imageUrl,
      agent: {
        id: agent.id,
        name: agent.name,
      },
    }
  })

  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  }
}

export function mockGetListingById(id: string, admin: boolean) {
  const property = mockProperties.find(p => p.id === id)
  if (!property) return null

  const agent = mockAgents.find(a => a.id === property.agentId)!

  const result = {
    id: property.id,
    title: property.title,
    description: property.description,
    price: property.price,
    suburb: property.suburb,
    state: property.state,
    postcode: property.postcode,
    propertyType: property.propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    parking: property.parking,
    status: property.status,
    imageUrl: property.imageUrl,
    internalNotes: property.internalNotes,
    agent: {
      id: agent.id,
      name: agent.name,
      phone: agent.phone,
      email: agent.email,
    },
  }

  if (!admin) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { internalNotes: _, ...publicResult } = result
    return publicResult
  }

  return result
}
