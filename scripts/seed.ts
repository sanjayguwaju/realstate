import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "../lib/db/schema"

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

async function main() {
  console.log("🌱 Seeding database...")

  // Check if data already exists
  const existing = await db.select().from(schema.agents).limit(1)
  if (existing.length > 0) {
    console.log("✅ Database already seeded, skipping...")
    await client.end()
    return
  }

  console.log("  Seeding agents...")
  const agents = await db.insert(schema.agents).values([
    { name: "Alice Nguyen", email: "alice@realty.com", phone: "0400 111 222", agency: "Premier Realty", isAdmin: true },
    { name: "Bob Martinez", email: "bob@realty.com", phone: "0400 333 444", agency: "Premier Realty", isAdmin: false },
    { name: "Carol Wu", email: "carol@realty.com", phone: "0400 555 666", agency: "Sunrise Property", isAdmin: false },
  ]).returning({ id: schema.agents.id })

  console.log("  Seeding properties...")
  const titles = [
    "3BR Family Home in Northside", "Modern 2BR Apartment — City Views", "Luxury 5BR Estate — Pool & Tennis Court",
    "Cozy 1BR Unit Near Train Station", "Renovated Queenslander — Character Charm", "Brand New Townhouse — End of Terrace",
    "Penthouse Living — 180° River Views", "4BR Family Home with Pool", "Vacant Land — Build Your Dream Home",
    "Waterfront Townhouse — Marina Access", "Student-Friendly Studio — Fully Furnished", "Queenslander on Double Block",
    "Modern 2BR Townhouse — Low Maintenance", "Acreage Retreat — 5 Acres of Serenity", "Inner-City Warehouse Conversion",
    "Development Site — DA Approved", "3BR Apartment — Walk to Beach", "Eco-Friendly Smart Home",
    "Charming Cottage — Investor Special", "Multi-Level Townhouse — City Fringe", "Hilltop Retreat with Panoramic Views",
    "Rare Northside Land — 800sqm", "CBD Investment Apartment — High Yield", "Federation Gem — Fully Restored",
    "Affordable 2BR — Great First Home",
  ]
  const descriptions = [
    "Spacious home with large backyard, double garage, and modern kitchen.",
    "High-floor apartment with gym and rooftop terrace. Floor-to-ceiling windows.",
    "Stunning executive home with resort-style pool, floodlit tennis court.",
    "Ideal for first-time buyers or investors. Walking distance to train.",
    "Beautifully restored Queenslander with VJ walls, polished hardwood floors.",
    "Contemporary 3-level townhouse with rooftop terrace and private courtyard.",
    "Full-floor penthouse with private lift access, gourmet kitchen.",
    "Spacious single-level home with in-ground pool, covered outdoor area.",
    "Flat 650sqm block in an established neighbourhood. All services connected.",
    "Directly on the marina with private pontoon. Open-plan living.",
    "Compact studio apartment walking distance to UQ.",
    "Original Queenslander on 1,200sqm. Potential for subdivision.",
    "Lock-and-leave lifestyle with stone kitchen, timber floors.",
    "Escape the city in this sprawling 5-acre property.",
    "Unique loft-style apartment in a converted heritage warehouse.",
    "Prime 1,500sqm corner block with DA approval for 12-unit complex.",
    "Spacious coastal apartment with ocean breezes, balcony.",
    "Solar-powered home with Tesla Powerwall, rainwater harvesting.",
    "Well-maintained post-war cottage currently tenanted.",
    "Architecturally designed townhouse over 3 levels.",
    "Elevated position offering 270-degree views to the mountains.",
    "Large flat block in a tightly-held pocket.",
    "Furnished 1-bedroom apartment in the heart of the CBD.",
    "Exquisite Federation-era home with original fretwork.",
    "Well-presented 2-bedroom home on a flat 500sqm block.",
  ]
  const suburbs = ["Northside", "CBD", "Ascot", "Woolloongabba", "Paddington", "Nundah", "New Farm", "Carindale", "Mount Gravatt", "Manly", "St Lucia", "Ashgrove", "Coorparoo", "Samford Valley", "Fortitude Valley", "Chermside", "Redcliffe", "The Gap", "Moorooka", "Newstead", "Chapel Hill", "Clayfield", "Zillmere"]
  const postcodes = ["4007", "4000", "4007", "4102", "4064", "4012", "4005", "4152", "4122", "4179", "4067", "4060", "4151", "4520", "4006", "4032", "4020", "4061", "4105", "4006", "4069", "4011", "4034"]
  const types = ["house", "apartment", "townhouse", "land"] as const
  const statuses = ["active", "active", "active", "under_offer", "sold"] as const
  const images = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-78b9dba3b914?w=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80",
    "https://images.unsplash.com/photo-1500382017468-90f7acb55eec?w=800&q=80",
  ]
  const notes = [
    "Vendor motivated. May accept from $720k.", "Body corporate has pending special levy of $8k.",
    "Owners relocating overseas — flexible on settlement.", null, "Heritage listed — restrictions on exterior modifications.",
    null, "Under offer at $3.1M. Buyer finance approved.", null, "DA approved for a 2-storey 4BR home.",
    null, "Sold at auction for $270k — above reserve.", "Town plan allows for 2-lot subdivision.",
    null, "Property includes a separate studio/granny flat.", null, "Vendor will consider JV with experienced developer.",
    null, "Annual energy costs under $400.", "Under offer at asking price. Unconditional.", null,
    "Recent building and pest inspection available.", null, "Sold off-market to existing client for $395k.",
    null, "Eligible for first home buyer grant.",
  ]

  const agentIds = agents.map(a => a.id)
  for (let i = 0; i < 25; i++) {
    await db.insert(schema.properties).values({
      title: titles[i],
      description: descriptions[i],
      price: String(250000 + Math.floor(Math.random() * 2750000)),
      suburb: suburbs[i % suburbs.length],
      state: "QLD",
      postcode: postcodes[i % postcodes.length],
      propertyType: types[i % types.length],
      bedrooms: [0, 1, 2, 2, 3, 3, 3, 4, 5][Math.floor(Math.random() * 9)],
      bathrooms: [1, 1, 2, 2, 2, 2, 3, 3, 4][Math.floor(Math.random() * 9)],
      parking: [0, 1, 1, 1, 2, 2, 2, 2, 3][Math.floor(Math.random() * 9)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      imageUrl: images[i % images.length],
      internalNotes: notes[i],
      agentId: agentIds[i % agentIds.length],
    })
  }

  console.log("✅ Seed complete — 3 agents and 25 properties inserted.")
  await client.end()
}

main().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
