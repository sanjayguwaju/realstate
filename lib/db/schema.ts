import {
  pgTable,
  uuid,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const agents = pgTable(
  "agents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    agency: text("agency"),
    isAdmin: boolean("is_admin").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [uniqueIndex("agents_email_idx").on(table.email)]
)

export const properties = pgTable(
  "properties",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    suburb: text("suburb").notNull(),
    state: text("state").notNull(),
    postcode: text("postcode").notNull(),
    propertyType: text("property_type").notNull(),
    bedrooms: integer("bedrooms").notNull(),
    bathrooms: integer("bathrooms").notNull(),
    parking: integer("parking").default(0),
    status: text("status").notNull().default("active"),
    imageUrl: text("image_url"),
    internalNotes: text("internal_notes"),
    agentId: uuid("agent_id").references(() => agents.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_properties_price").on(table.price),
    index("idx_properties_suburb").on(table.suburb),
    index("idx_properties_type").on(table.propertyType),
    index("idx_properties_bedrooms").on(table.bedrooms),
    index("idx_properties_bathrooms").on(table.bathrooms),
    index("idx_properties_status").on(table.status),
    index("idx_properties_suburb_type_price").on(
      table.suburb,
      table.propertyType,
      table.price
    ),
  ]
)

export const propertiesRelations = relations(properties, ({ one }) => ({
  agent: one(agents, { fields: [properties.agentId], references: [agents.id] }),
}))

export const agentsRelations = relations(agents, ({ many }) => ({
  properties: many(properties),
}))

export type Property = typeof properties.$inferSelect
export type NewProperty = typeof properties.$inferInsert
export type Agent = typeof agents.$inferSelect
export type NewAgent = typeof agents.$inferInsert
