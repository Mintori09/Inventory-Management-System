# Developer Guide

## Setup

```bash
pnpm install
cp .env.example .env
# Start PostgreSQL: see README
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Environment variables in `.env`:

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/inventory_db` | PostgreSQL connection |
| `JWT_SECRET` | `your-secret-key-change-in-production` | JWT signing secret |
| `PORT` | `4000` | Server port |
| `NODE_ENV` | `development` | Environment |

## Conventions

### File Naming

Kebab-case for everything:

- `user.routes.ts`, `auth.controller.ts`, `inventory.service.ts`
- `create-user.dto.ts`, `stock-overview.repository.ts`

### Module Structure

Every feature module has the same five files:

```
<name>.schema.ts       → Zod schemas
<name>.controller.ts   → HTTP handlers
<name>.service.ts      → Business logic
<name>.repository.ts   → Prisma queries
<name>.routes.ts       → Express router + JSDoc
```

### Error Handling

Use `AppError` subclasses from `src/common/errors/`:

| Class | Status | When |
|---|---|---|
| `BadRequestError` | 400 | Invalid data, duplicate SKU |
| `UnauthorizedError` | 401 | Missing/invalid JWT |
| `ForbiddenError` | 403 | Insufficient role |
| `NotFoundError` | 404 | Resource not found |
| `AppError` (base) | 500 | Unexpected errors |

Throw in service layer, catch in error middleware. No `try/catch` in controllers.

### Validation

Define Zod schemas in `*.schema.ts`. Export at least two schemas per module:

```ts
export const createProductSchema = z.object({ ... });
export const updateProductSchema = z.object({ ... }).partial();
```

Use `validate(schema)` middleware in routes.

## Adding a New Module

1. Create `src/modules/<name>/`
2. Write `<name>.schema.ts` with Zod schemas
3. Write `<name>.repository.ts` with Prisma queries
4. Write `<name>.service.ts` with business logic
5. Write `<name>.controller.ts` with request handlers
6. Write `<name>.routes.ts` with Express router + JSDoc
7. Register routes in `src/routes/index.ts`

Template for route registration in `routes/index.ts`:

```ts
import <name>Routes from "../modules/<name>/<name>.routes";
router.use("/<name>", <name>Routes);
```

## Database Changes

```bash
# 1. Edit prisma/schema.prisma

# 2. Generate migration
pnpm db:migrate --name <description>

# 3. Regenerate Prisma client
npx prisma generate

# 4. Update seed script if needed

# 5. Apply to dev database
pnpm db:migrate
```

## Testing

Run tests:

```bash
pnpm test              # Run once
pnpm test:watch        # Watch mode
```

Tests use Vitest with supertest for HTTP assertions. The test database must be seeded before running.

Test file conventions:
- Place in `tests/` directory
- Name: `<feature>.test.ts`
- Use `describe`/`it` blocks
- Import `app` from `src/app.ts`
- Authenticate before testing protected routes

Example:

```ts
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";

describe("Products API", () => {
  it("creates a product", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Product", ... });
    expect(res.status).toBe(201);
  });
});
```

## Inventory Transaction Flow

Import (`POST /api/inventory/import`):

```
validate input (Zod)
       │
authenticate user
       │
product exists? → 400 if no
       │
prisma.$transaction:
  ├─ create StockImport
  ├─ update Product (currentStock += quantity)
  ├─ create StockMovement (type: import)
  └─ create AuditLog
       │
return { id, productId, quantity, stockBefore, stockAfter }
```

Export follows the same pattern but rejects if `currentStock < quantity`.

Adjust is admin-only and allows both increase and decrease.

## API Documentation

Swagger generates live docs from `@openapi` JSDoc tags in route files.

To add docs for a new endpoint:

1. Add a `@openapi` comment block above the route handler in `*.routes.ts`
2. If the endpoint uses a new response shape, add a schema in `src/config/swagger.ts`

Example JSDoc block:

```ts
/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: List products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paginated product list
 */
```
