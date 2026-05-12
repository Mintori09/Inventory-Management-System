# Architecture

## Overview

A layered REST API for inventory management. Two user roles control access:
- **admin** — full CRUD on all resources
- **staff** — read products/categories/suppliers, perform inventory operations

All inventory mutations run inside database transactions. Every write operation appends an audit log.

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Runtime | Node.js + TypeScript | Type safety, broad ecosystem |
| Web framework | Express 4 | Mature, minimal, well-understood |
| ORM | Prisma 6 | Type-safe queries, migrations, seed |
| Database | PostgreSQL 16 | Reliable, supports transactions |
| Auth | JWT + bcrypt | Stateless auth, industry standard |
| Validation | Zod | Runtime type checking, composable schemas |
| Testing | Vitest + supertest | Fast, native TS, HTTP assertion |
| Docs | swagger-jsdoc + swagger-ui-express | Live docs from JSDoc annotations |

## Database Schema

Eight tables with the following relationships:

```
users ──┬── products (created_by)
         ├── stock_imports (created_by)
         ├── stock_exports (created_by)
         ├── stock_movements (created_by)
         └── audit_logs (user_id)

categories ──── products (category_id)
suppliers ──┬── products (supplier_id)
            └── stock_imports (supplier_id)

products ──┬── stock_imports (product_id)
           ├── stock_exports (product_id)
           └── stock_movements (product_id)
```

Key design choices:
- **stock_imports** and **stock_exports** store transaction details (price, quantity, total)
- **stock_movements** records every stock change with `stock_before`/`stock_after` for rollback analysis
- **stock_movements.reference_type** + **reference_id** links back to the source import/export
- **audit_logs** records write operations across all tables with action, table name, record id, and description

## Module Structure

Each feature follows the same pattern:

```
modules/<name>/
├── <name>.schema.ts      # Zod validation schemas
├── <name>.controller.ts  # Request handling, response formatting
├── <name>.service.ts     # Business logic
├── <name>.repository.ts  # Prisma queries
└── <name>.routes.ts      # Route definitions with JSDoc OpenAPI
```

Dependency flow: **routes → controller → service → repository → Prisma**

### Layers

**Routes** — Define HTTP methods, paths, middleware chain, and `@openapi` JSDoc annotations.

**Controller** — Parse request params/body, call service, format response. No business logic.

**Service** — Implement business rules and transactions. For inventory: validate stock levels, compute totals, orchestrate database writes in a `prisma.$transaction`.

**Repository** — Abstract Prisma queries. Keep database access isolated from business logic.

## Key Design Decisions

### Soft Delete via isActive

All primary entities (users, categories, suppliers, products) use an `isActive: Boolean` flag. Deactivation sets `isActive = false`; the record remains in the database. Queries filter `isActive = true` by default.

### Stock Isolation

Products have `currentStock` and `minStock`. Stock changes only through three inventory operations:
- **Import** — increases stock, records supplier and import price
- **Export** — decreases stock (rejects if insufficient), records export price
- **Adjust** — manual increase or decrease (admin-only)

Product update endpoints do **not** accept `currentStock`. This prevents accidental stock overwrites.

### Transactional Inventory

All inventory operations use `prisma.$transaction` to atomically:
1. Create the stock_import/stock_export/adjustment record
2. Update product.currentStock
3. Insert a stock_movement row
4. Insert an audit_log row

If any step fails, all changes roll back.

### Stock Status

Computed on read, not stored. `stockStatus` derives from `currentStock`:
- `currentStock <= 0` → `out_of_stock`
- `currentStock <= minStock` → `low_stock`
- otherwise → `in_stock`

### Audit Logging

Repository methods for write operations accept an `auditData` parameter. The audit log records the authenticated user, action, table name, record ID, and a human-readable description.

## Data Flow

```
Request
  │
  ▼
auth.middleware       → Verify JWT, attach user to req
  │
  ▼
role.middleware       → Check user.role (admin-only routes)
  │
  ▼
validate.middleware   → Parse + validate request body via Zod schema
  │
  ▼
Controller            → Extract params, call service
  │
  ▼
Service               → Business logic, Prisma transactions
  │
  ▼
Repository            → Prisma queries + audit logging
  │
  ▼
Response              → Standardized JSON format
```

## Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens expire after 24 hours
- Role guard rejects non-admin requests with 403
- Zod validation rejects malformed input with 422
- No sensitive data in error responses in production
