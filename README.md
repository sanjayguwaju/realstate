# Real-Estate Listing Search API

A full-stack property-search application built with **Next.js** (App Router), **PostgreSQL 17**, and **Drizzle ORM**. Features a REST API with paginated search, dynamic filtering, role-aware access control, input validation, and a responsive frontend built with shadcn/ui.

---

## Quick Start

### i. How to Run the App

**Docker Compose (Recommended):**

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment file (uses default Docker settings)
cp .env.example .env

# 3. Start all services (app + database + drizzle studio)
# First build may take 2-3 minutes
docker-compose up -d
```

**After startup:**
- Application: http://localhost:3000
- Drizzle Studio: http://localhost:4983

**Verify it's working:**
```bash
curl http://localhost:3000/api/listings?limit=1
```

**View logs:**
```bash
docker-compose logs -f app
```

> **Note:** Database migrations and seeding (3 agents + 25 properties) run automatically on first start.

**Manual Setup:**
```bash
pnpm install
cp .env.example .env          # Set DATABASE_URL=postgres://postgres:postgres@localhost:5432/realestate
docker run -d --name realstate-pg -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=realestate -p 5432:5432 postgres:17-alpine
pnpm run db:generate
pnpm run db:migrate
pnpm run dev                   # http://localhost:3000
```

### ii. How to Seed the DB

```bash
pnpm run db:seed
```

This inserts 3 agents + 25 sample properties into the database.

### iii. Example API Calls

**Search listings (using actual seeded suburbs):**
```bash
# List all properties
curl "http://localhost:3000/api/listings?limit=10"

# Filter by suburb (Northside, CBD, Ascot, Paddington, etc.)
curl "http://localhost:3000/api/listings?suburb=Northside&limit=5"

# Filter by price range and bedrooms
curl "http://localhost:3000/api/listings?price_min=500000&price_max=1500000&beds=3&limit=10"

# Filter by property type (house, apartment, townhouse, land)
curl "http://localhost:3000/api/listings?type=apartment&limit=5"

# Combined filters
curl "http://localhost:3000/api/listings?suburb=CBD&price_max=2000000&beds=2&type=apartment"
```

**Get single listing:**
```bash
curl "http://localhost:3000/api/listings/<uuid>"
```

**Get listing with admin access (includes internal notes):**

```bash
# First, get a listing ID
curl -s "http://localhost:3000/api/listings?limit=1" | grep -o '"id":"[^"]*"' | head -1

# Then use that ID with admin header
curl -H "X-User-Role: admin" "http://localhost:3000/api/listings/REPLACE_WITH_ID"
```

**Postman:**
- URL: `http://localhost:3000/api/listings/{listing-id}`
- Headers: `X-User-Role: admin`

---

## Architecture

### Layered Design

The application follows a strict **3-layer architecture** where each layer has a single responsibility and communicates only with the layer directly below it.

```mermaid
graph TB
    subgraph "Presentation Layer"
        FE["Frontend (React)<br/>app/listings/page.tsx<br/>app/listings/[id]/page.tsx"]
    end

    subgraph "Controller Layer (app/api/)"
        C1["GET /api/listings<br/>app/api/listings/route.ts"]
        C2["GET /api/listings/:id<br/>app/api/listings/[id]/route.ts"]
    end

    subgraph "Service Layer (lib/services/)"
        S1["listings.service.ts<br/>getListings()"]
        S2["listings.service.ts<br/>getListingById()"]
    end

    subgraph "Middleware (lib/middleware/)"
        AUTH["auth.ts<br/>isAdmin()"]
    end

    subgraph "Data Access Layer (lib/db/)"
        DB["index.ts — Drizzle Client"]
        SCH["schema.ts — Tables, Indexes, Types"]
    end

    subgraph "Database"
        PG[("PostgreSQL 17")]
    end

    FE -- "fetch()" --> C1
    FE -- "fetch()" --> C2
    C1 -- "validate → delegate" --> S1
    C2 -- "validate → delegate" --> S2
    C2 -- "check role" --> AUTH
    S1 --> DB
    S2 --> DB
    DB --> SCH
    DB --> PG

    style FE fill:#3b82f6,color:#fff
    style C1 fill:#8b5cf6,color:#fff
    style C2 fill:#8b5cf6,color:#fff
    style S1 fill:#10b981,color:#fff
    style S2 fill:#10b981,color:#fff
    style AUTH fill:#f59e0b,color:#fff
    style DB fill:#ef4444,color:#fff
    style SCH fill:#ef4444,color:#fff
    style PG fill:#334155,color:#fff
```

### Request Flow

```mermaid
sequenceDiagram
    participant Client
    participant Controller as Controller<br/>(app/api/)
    participant Auth as Middleware<br/>(lib/middleware/)
    participant Service as Service<br/>(lib/services/)
    participant DB as Data Access<br/>(lib/db/)
    participant PG as PostgreSQL

    Client->>Controller: HTTP Request
    Controller->>Controller: Parse & validate input
    alt Invalid input
        Controller-->>Client: 400 Bad Request
    end
    Controller->>Auth: isAdmin(req)
    Auth-->>Controller: boolean
    Controller->>Service: getListingById(id, admin)
    Service->>DB: Drizzle query
    DB->>PG: SQL
    PG-->>DB: Rows
    DB-->>Service: Typed result
    Service->>Service: Strip admin fields if !admin
    Service-->>Controller: Data | null
    alt Not found
        Controller-->>Client: 404 Not Found
    end
    Controller-->>Client: 200 JSON Response
```

### Folder Structure

```
project-root/
├── app/                              ← PRESENTATION + CONTROLLER LAYERS
│   ├── api/listings/                 ← Controller (thin route handlers)
│   │   ├── route.ts                  │  Parse params, validate, delegate to service
│   │   └── [id]/route.ts            │  UUID validation, call service, return HTTP status
│   ├── listings/                     ← Presentation (React pages)
│   │   ├── page.tsx                  │  Search + results UI (shadcn components)
│   │   └── [id]/page.tsx            │  Property detail UI
│   ├── layout.tsx
│   └── globals.css
│
├── lib/                              ← BUSINESS LOGIC + DATA ACCESS
│   ├── services/                     ← Service Layer
│   │   └── listings.service.ts       │  Query building, pagination, role-aware stripping
│   ├── middleware/                    ← Middleware
│   │   └── auth.ts                   │  isAdmin() — reads X-User-Role header
│   ├── db/                           ← Data Access Layer
│   │   ├── index.ts                  │  Drizzle client singleton
│   │   └── schema.ts                │  Table definitions, indexes, relations, types
│   └── utils.ts                      ← Shared utilities (shadcn cn())
│
├── scripts/
│   └── seed.ts                       ← Seed script (3 agents + 25 properties)
├── drizzle/
│   └── migrations/                   ← Generated SQL migrations
├── __tests__/
│   └── listings.api.test.ts          ← Integration tests (20 tests)
├── components/ui/                    ← shadcn/ui components
└── drizzle.config.ts                 ← Migration configuration
```

### Separation of Concerns

| Layer       | Directory                      | Responsibility                                              |
|-------------|--------------------------------|-------------------------------------------------------------|
| Controller  | `app/api/listings/`            | Parse query params, validate input, call service, return HTTP response |
| Service     | `lib/services/`                | Build dynamic SQL conditions, execute queries, strip admin fields |
| Middleware  | `lib/middleware/`              | Determine user role from `X-User-Role` header               |
| Data Access | `lib/db/`                      | Drizzle client singleton + schema definitions               |
| Presentation| `app/listings/`                | React UI with shadcn/ui components                          |

**Key principle**: Route handlers contain _zero_ database imports. They import only from `lib/services/` and `lib/middleware/`. All query logic lives in the service layer.

---

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** 17+ (Docker recommended)
- **pnpm** (or npm)

## Setup

### Option 1: Docker Compose (Recommended)

The easiest way to get started with all services pre-configured:

```bash
# 1. Clone and install
git clone <repo-url> && cd realstate
pnpm install

# 2. Configure environment
cp .env.example .env
# Edit .env: DATABASE_URL=postgres://postgres:postgres@db:5432/realestate

# 3. Start all services (app + database + drizzle studio)
docker-compose up -d

# 4. View logs
docker-compose logs -f app
```

Services will be available at:
- Application: http://localhost:3000
- Drizzle Studio: http://localhost:4983
- PostgreSQL: localhost:5432

### Option 2: Manual Setup

```bash
# 1. Clone and install
git clone <repo-url> && cd realstate
pnpm install

# 2. Configure environment
cp .env.example .env
# Edit .env:  DATABASE_URL=postgres://postgres:postgres@localhost:5432/realestate

# 3. Start PostgreSQL (Docker)
docker run -d --name realstate-pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=realestate \
  -p 5432:5432 \
  postgres:17-alpine

# 4. Generate and apply migrations
pnpm run db:generate     # generates SQL from schema
pnpm run db:migrate      # applies migrations to DB

# 5. Seed sample data
pnpm run db:seed         # inserts 3 agents + 25 properties

# 6. Start development server
pnpm run dev             # http://localhost:3000
```

---

## API Reference

### `GET /api/listings`

Returns a paginated list of property listings with optional filters.

**Query Parameters:**

| Param       | Type   | Description                              | Default |
|-------------|--------|------------------------------------------|---------|
| `suburb`    | string | Case-insensitive partial match           | —       |
| `price_min` | number | Minimum price                            | —       |
| `price_max` | number | Maximum price                            | —       |
| `beds`      | number | Minimum bedrooms                         | —       |
| `baths`     | number | Minimum bathrooms                        | —       |
| `type`      | string | `house` / `apartment` / `townhouse` / `land` | — |
| `keyword`   | string | Searches title and description (ILIKE)   | —       |
| `page`      | number | Page number                              | 1       |
| `limit`     | number | Results per page (max: 100)              | 20      |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "price": "750000.00",
      "suburb": "string",
      "propertyType": "house",
      "bedrooms": 3,
      "bathrooms": 2,
      "status": "active",
      "agent": { "id": "uuid", "name": "string" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "totalPages": 2
  }
}
```

**Error (400):**
```json
{ "error": "type must be one of: house, apartment, townhouse, land" }
```

---

### `GET /api/listings/:id`

Returns full property details including agent contact info.

**Headers:**

| Header        | Value   | Effect                          |
|---------------|---------|---------------------------------|
| `X-User-Role` | `admin` | Includes `internalNotes` field  |

**Response (200):**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "price": "750000.00",
  "suburb": "string",
  "state": "QLD",
  "postcode": "4007",
  "propertyType": "house",
  "bedrooms": 3,
  "bathrooms": 2,
  "parking": 2,
  "status": "active",
  "internalNotes": "Admin only — stripped for normal users",
  "agent": {
    "id": "uuid",
    "name": "string",
    "phone": "string",
    "email": "string"
  }
}
```

**Errors:**
| Status | Body                                                    |
|--------|---------------------------------------------------------|
| 400    | `{ "error": "Invalid listing ID format — expected a UUID" }` |
| 404    | `{ "error": "Not found" }`                              |
| 500    | `{ "error": "Internal server error" }`                  |

---

## Schema Design

### Agents
| Column     | Type      | Constraints        | Notes             |
|------------|-----------|--------------------|--------------------|
| id         | UUID      | PK, auto-generated |                    |
| name       | text      | NOT NULL           |                    |
| email      | text      | NOT NULL, UNIQUE   | Unique index       |
| phone      | text      | nullable           |                    |
| agency     | text      | nullable           |                    |
| is_admin   | boolean   | NOT NULL, default false | Role flag     |
| created_at | timestamptz | default now()    |                    |

### Properties
| Column        | Type          | Constraints          | Notes                |
|---------------|---------------|----------------------|----------------------|
| id            | UUID          | PK, auto-generated   |                      |
| title         | text          | NOT NULL             |                      |
| description   | text          | nullable             |                      |
| price         | numeric(12,2) | NOT NULL             |                      |
| suburb        | text          | NOT NULL             | Indexed              |
| state         | text          | NOT NULL             |                      |
| postcode      | text          | NOT NULL             |                      |
| property_type | text          | NOT NULL             | Indexed              |
| bedrooms      | integer       | NOT NULL             | Indexed              |
| bathrooms     | integer       | NOT NULL             | Indexed              |
| parking       | integer       | default 0            |                      |
| status        | text          | NOT NULL, default 'active' | Indexed        |
| internal_notes| text          | nullable             | **Admin only**       |
| agent_id      | UUID          | FK → agents.id       |                      |
| created_at    | timestamptz   | default now()        |                      |
| updated_at    | timestamptz   | default now()        |                      |

### Indexes (7 + 1 composite)
| Index                            | Columns                          | Purpose                    |
|----------------------------------|----------------------------------|----------------------------|
| `agents_email_idx`               | email (unique)                   | Agent lookup by email      |
| `idx_properties_price`           | price                            | Price range queries        |
| `idx_properties_suburb`          | suburb                           | Suburb filter              |
| `idx_properties_type`            | property_type                    | Type filter                |
| `idx_properties_bedrooms`        | bedrooms                         | Bedroom filter             |
| `idx_properties_bathrooms`       | bathrooms                        | Bathroom filter            |
| `idx_properties_status`          | status                           | Status filter              |
| `idx_properties_suburb_type_price` | suburb, property_type, price   | Combined filter optimization |

---

## Run Tests

```bash
# Run tests (no server required — tests use mocks)
pnpm run test
```

**Test coverage (20 tests):**
- Response shape and field validation
- All filter types (suburb, price range, beds, baths, type, keyword, combined)
- Pagination (page/limit, totalPages calculation, empty page, limit clamping)
- Input validation (invalid type → 400, invalid UUID → 400)
- Role-based access (admin internalNotes, normal user exclusion, case-sensitive role check)
- Error responses (404 for unknown ID, 400 for bad input)

---

## Database Management

```bash
# Docker Compose (recommended)
docker-compose up -d db          # Start database
docker-compose up -d studio    # Start Drizzle Studio
docker-compose logs -f app       # View app logs
docker-compose down -v           # Full reset (wipes database)

# Manual (requires local PostgreSQL)
pnpm run db:generate    # Generate migration SQL from schema changes
pnpm run db:migrate     # Apply migrations to the database
pnpm run db:studio      # Open Drizzle Studio (visual DB browser)
pnpm run db:seed        # Seed sample data (3 agents + 25 properties)
```

## Deployment

The application can be deployed using Docker Compose:

```bash
# Production deployment
docker-compose up -d
```

Or build and run the Docker image directly:

```bash
docker build -t realstate .
docker run -p 3000:3000 -e DATABASE_URL=postgres://... realstate
```

## Tech Stack

| Layer      | Technology                 |
|------------|----------------------------|
| Frontend   | Next.js (App Router)       |
| UI         | shadcn/ui + Tailwind CSS   |
| Backend    | Next.js API Routes         |
| Database   | PostgreSQL 17              |
| ORM        | Drizzle ORM                |
| Migrations | drizzle-kit                |
| Testing    | Vitest + Supertest         |
| Auth       | X-User-Role header         |
| Bundler    | Turbopack (Next.js dev)    |
