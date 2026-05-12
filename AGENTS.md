# Repo: Inventory Management System

pnpm monorepo — `backend/` (Express 4 + Prisma 6 + PG16) and `frontend/` (Next.js 16 + React 19 + Tailwind 4).

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | concurrently: backend tsx watch + frontend next dev |
| `pnpm build` | tsc build backend, then next build frontend |
| `pnpm typecheck` | `tsc --noEmit` in backend, then frontend |
| `pnpm lint` | frontend only (`eslint`) |
| `pnpm test` | vitest run in backend, then frontend |
| `pnpm db:migrate` | backend prisma migrate dev |
| `pnpm db:seed` | backend tsx prisma/seed.ts |

Run isolated: `pnpm --filter ./backend <cmd>` or `pnpm --filter ./frontend <cmd>`.

Frontend E2E: `pnpm --filter ./frontend test:e2e` — playwright builds+starts on port 3001.

Verified CI order: `install → prisma generate → prisma migrate deploy → seed → test` (backend); `install → lint → test` (frontend).

## Architecture

**Backend** — Express app in `src/app.ts`, routes registered in `src/routes/index.ts`. Each module has 5 files: `<name>.schema.ts` (Zod), `.controller.ts`, `.service.ts`, `.repository.ts`, `.routes.ts`. Shared code in `src/common/` (errors, middlewares, constants, types, utils). Swagger at `/api/docs`.

Inventory mutations run in `prisma.$transaction` — creates stock_import/export, updates product.currentStock, inserts stock_movement and audit_log atomically.

Soft deletes via `isActive` flag. Stock status computed on read (`currentStock <= minStock → low_stock`).

**Frontend** — App Router, `@/` import alias. TanStack Query + Zustand. React Hook Form + Zod v4. MSW auto-starts in dev (`providers.tsx`). Auth via cookies (middleware protects routes).

## Key details

- Node >=20, pnpm >=9
- Backend Zod v3.x, frontend Zod v4.x — schemas are NOT interchangeable
- Backend uses `tsx` for dev/seed, `tsc` for build
- Backend `package-manager-strict=false` in `.npmrc`
- Backend test needs running PostgreSQL with seeded data (CI uses `inventory_test` db)
- Backend tests import `app` from `src/app.ts`, not `server.ts`
- Frontend `vitest` uses jsdom + setup file (`test-setup.ts`); backend uses node env
- Frontend E2E playwright config uses `PORT=3001` with `reuseExistingServer: true`
- Error handling in backend: throw `AppError` subclass (400/401/403/404/500) in service, caught by global middleware. No try/catch in controllers
- Audit logging: repository write methods accept `auditData` parameter

## Reference

- `frontend/AGENTS.md` — Next.js 16 differs from training data; read `node_modules/next/dist/docs/` before writing code
- `backend/ARCHITECTURE.md` — detailed module patterns and data flow
- `backend/DEVELOPER_GUIDE.md` — adding modules, testing conventions, swagger docs
