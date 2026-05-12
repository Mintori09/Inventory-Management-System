# Inventory Management System — Backend

A RESTful inventory management API built with Express, TypeScript, Prisma, and PostgreSQL. Supports JWT authentication, role-based access control (admin/staff), stock import/export/adjustment with full audit logging, and interactive Swagger documentation.

## Features

- **JWT Authentication** — Secure login with bcrypt password hashing
- **Role-Based Access** — Admin (full access) and Staff (read + inventory operations)
- **Product Management** — CRUD with SKU, pricing, category/supplier relations
- **Inventory Transactions** — Import, export, and manual stock adjustment in database transactions
- **Audit Logging** — Every write operation logs who did what and when
- **Dashboard** — Real-time stock overview, low-stock alerts, movement history
- **Interactive API Docs** — Swagger UI at `/api/docs`
- **Soft Delete** — All records use `isActive` flag instead of hard deletion

## Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- pnpm

## Quick Start

```bash
# 1. Clone & install
pnpm install

# 2. Configure environment
cp .env.example .env

# 3. Start PostgreSQL
docker run --name inventory-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=inventory_db \
  -p 5432:5432 \
  -d postgres:16

# 4. Migrate & seed
pnpm db:migrate
pnpm db:seed

# 5. Start development server
pnpm dev
```

Server starts at `http://localhost:4000`. API docs at `http://localhost:4000/api/docs`.

## Default Accounts

| Email | Password | Role |
|---|---|---|
| admin@example.com | 123456 | admin |
| staff@example.com | 123456 | staff |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm start` | Start production server |
| `pnpm build` | Compile TypeScript |
| `pnpm test` | Run integration tests |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed database |
| `pnpm db:reset` | Reset database |

## Project Structure

```
backend/
├── prisma/            # Schema, migrations, seed
├── src/
│   ├── common/        # Middlewares, errors, utils, constants
│   ├── config/        # Env, Prisma client, CORS, Swagger
│   ├── modules/       # Feature modules (8 total)
│   │   ├── auth/
│   │   ├── audit-logs/
│   │   ├── categories/
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── products/
│   │   ├── suppliers/
│   │   └── users/
│   └── routes/        # Route registration
├── tests/             # Integration tests
└── docs/              # Architecture & developer documentation
```

## Tech Stack

- **Runtime:** Node.js, TypeScript
- **Framework:** Express 4
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT (jsonwebtoken), bcrypt
- **Validation:** Zod
- **Testing:** Vitest + supertest
- **Docs:** swagger-jsdoc + swagger-ui-express
