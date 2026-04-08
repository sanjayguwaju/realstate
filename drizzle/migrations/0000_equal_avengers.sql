CREATE TABLE "agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"agency" text,
	"is_admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"price" numeric(12, 2) NOT NULL,
	"suburb" text NOT NULL,
	"state" text NOT NULL,
	"postcode" text NOT NULL,
	"property_type" text NOT NULL,
	"bedrooms" integer NOT NULL,
	"bathrooms" integer NOT NULL,
	"parking" integer DEFAULT 0,
	"status" text DEFAULT 'active' NOT NULL,
	"image_url" text,
	"internal_notes" text,
	"agent_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "agents_email_idx" ON "agents" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_properties_price" ON "properties" USING btree ("price");--> statement-breakpoint
CREATE INDEX "idx_properties_suburb" ON "properties" USING btree ("suburb");--> statement-breakpoint
CREATE INDEX "idx_properties_type" ON "properties" USING btree ("property_type");--> statement-breakpoint
CREATE INDEX "idx_properties_bedrooms" ON "properties" USING btree ("bedrooms");--> statement-breakpoint
CREATE INDEX "idx_properties_bathrooms" ON "properties" USING btree ("bathrooms");--> statement-breakpoint
CREATE INDEX "idx_properties_status" ON "properties" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_properties_suburb_type_price" ON "properties" USING btree ("suburb","property_type","price");