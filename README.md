## E‑Commerce MVP (Next.js + Prisma + MySQL)

Minimal e‑commerce starter built with Next.js App Router, Tailwind CSS, Prisma ORM, and MySQL (Docker). Includes sample schema, seed data, basic Store UI (list/detail), and a simple REST endpoint.

### Stack
- Next.js (App Router, TypeScript, Tailwind CSS)
- Prisma ORM
- MySQL (Docker Compose)
- zod, slugify

---

## Prerequisites
- Node.js 18+ and pnpm
- Docker Desktop (for MySQL)

## Setup
1) Install deps
```bash
pnpm install
```

2) Start MySQL via Docker
```bash
pnpm run db:up
```
This starts mysql:8.0 on localhost:3306 with local volume at `./.data/mysql`.

3) Environment
Create/update `.env`:
```bash
DATABASE_URL="mysql://app:app@localhost:3306/ecommerce"
SHADOW_DATABASE_URL="mysql://root:root@localhost:3306/ecommerce_shadow"
```

4) Prisma
```bash
# Generate client (if needed)
pnpm run prisma:generate

# Apply schema (already in repo) to DB
pnpm exec prisma migrate dev --name init

# Open Prisma Studio
pnpm run prisma:studio
```

5) Seed sample data
```bash
pnpm seed
```

6) Run the app
```bash
pnpm dev
```
Visit http://localhost:3000

---

## Features
- Database schema: Users, Products, Categories, Orders (Prisma models in `prisma/schema.prisma`).
- Seed script: creates an "Electronics" category and 3 demo products with images (`prisma/seed.ts`).
- UI:
	- Product list: `src/app/page.tsx`
	- Product detail: `src/app/products/[slug]/page.tsx`
- API: `GET /api/products` → `src/app/api/products/route.ts`

---

## Scripts
```json
{
	"dev": "next dev --turbopack",
	"build": "next build --turbopack",
	"start": "next start",
	"lint": "next lint",
	"db:up": "docker compose up -d",
	"db:down": "docker compose down -v",
	"prisma:generate": "prisma generate",
	"prisma:push": "prisma db push",
	"prisma:studio": "prisma studio",
	"seed": "tsx prisma/seed.ts"
}
```

---

## Notes
- Prisma Client is generated to `src/generated/prisma` and consumed via `src/lib/prisma.ts` singleton.
- The shadow database is used by Prisma Migrate; it can be dropped and recreated during migrations.
- Git ignores `/.data/` and `.env*` by default.

## License
MIT
