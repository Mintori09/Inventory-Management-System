# Inventory Management System

Hệ thống quản lý kho hàng với REST API backend và web dashboard. Hỗ trợ hai vai trò admin/staff, quản lý sản phẩm, danh mục, nhà cung cấp, nhập/xuất/điều chỉnh kho, dashboard thống kê và audit log.

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| **Runtime** | Node.js + TypeScript |
| **Backend** | Express 4 + Prisma 6 + PostgreSQL 16 |
| **Frontend** | Next.js 16 + React 19 + Tailwind CSS 4 |
| **State** | Zustand + TanStack Query |
| **Form** | React Hook Form + Zod |
| **Auth** | JWT + bcrypt |
| **Chart** | Recharts |
| **Testing** | Vitest + supertest + Playwright |
| **CI** | GitHub Actions |
| **Container** | Docker / Docker Compose |

## Project Structure

```
├── backend/                        # REST API (Express + Prisma)
│   ├── prisma/                     # Schema, migrations, seed
│   ├── src/
│   │   ├── common/                 # Middlewares, errors, utils, constants
│   │   ├── config/                 # Env, Prisma client, CORS, Swagger
│   │   ├── modules/                # 8 feature modules
│   │   │   ├── auth/
│   │   │   ├── audit-logs/
│   │   │   ├── categories/
│   │   │   ├── dashboard/
│   │   │   ├── inventory/
│   │   │   ├── products/
│   │   │   ├── suppliers/
│   │   │   └── users/
│   │   └── routes/                 # Route registration
│   └── tests/                      # Integration tests
│
├── frontend/                       # Web dashboard (Next.js)
│   ├── app/                        # App Router pages (18 routes)
│   │   ├── (auth)/login/
│   │   └── (dashboard)/            # Products, categories, inventory, admin
│   ├── components/                 # Layout, UI, feature components
│   ├── hooks/                      # TanStack Query hooks
│   ├── lib/                        # API client, auth, utils
│   ├── schemas/                    # Zod validation schemas
│   ├── types/                      # TypeScript type definitions
│   ├── mocks/                      # MSW mock handlers
│   ├── __tests__/                  # Unit tests
│   └── e2e/                        # Playwright E2E tests
│
├── .github/workflows/ci.yml        # CI pipeline
├── docker-compose.yml              # PostgreSQL service
└── README.md
```

## Backend Architecture

### Database Schema

9 tables với các quan hệ:

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

### Module Structure (5-layer)

```
routes → controller → service → repository → Prisma
```

| Layer | Trách nhiệm |
|-------|-------------|
| **Routes** | HTTP methods + middleware chain + JSDoc OpenAPI |
| **Controller** | Parse request, call service, format response |
| **Service** | Business logic, Prisma transactions |
| **Repository** | Prisma queries |
| **Schema** | Zod validation |

### Inventory Transaction Flow

Mọi thao tác nhập/xuất/điều chỉnh kho đều chạy trong `prisma.$transaction`:

1. Tạo `stock_imports` / `stock_exports`
2. Update `products.current_stock`
3. Tạo `stock_movements` (stock trước/sau)
4. Tạo `audit_logs`

Nếu bất kỳ bước nào thất bại → rollback toàn bộ.

## Prerequisites

- **Node.js** 20+
- **pnpm** — `npm install -g pnpm`
- **PostgreSQL** 16 (hoặc Docker)
- **Docker** (tuỳ chọn, cho PostgreSQL)

## Getting Started

### 1. Clone

```bash
git clone https://github.com/Mintori09/Inventory-Management-System.git
cd Inventory-Management-System
```

### 2. Backend Setup

```bash
cd backend
pnpm install

# Tạo file .env từ mẫu
cp .env.example .env

# Chạy PostgreSQL (nếu chưa có)
docker compose up -d postgres

# Migrate + seed database
pnpm db:migrate
pnpm db:seed

# Start dev server (hot reload)
pnpm dev
```

Backend chạy tại `http://localhost:4000`. API docs tại `http://localhost:4000/api/docs`.

### 3. Frontend Setup

```bash
cd frontend
pnpm install

# Tạo .env.local (nếu chưa có)
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local

# Start dev server
pnpm dev
```

Frontend chạy tại `http://localhost:3000`.

### 4. Default Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | 123456 | admin |
| staff@example.com | 123456 | staff |

## Environment Variables

### Backend (`backend/.env`)

| Variable | Mặc định | Bắt buộc | Mô tả |
|----------|----------|----------|-------|
| `DATABASE_URL` | — | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | — | ✅ | JWT signing key |
| `JWT_EXPIRES_IN` | `1d` | ❌ | Token expiration |
| `PORT` | `4000` | ❌ | Server port |
| `NODE_ENV` | `development` | ❌ | Environment |
| `CORS_ORIGIN` | `http://localhost:3000` | ❌ | Allowed frontend origin |

### Frontend (`frontend/.env.local`)

| Variable | Mặc định | Mô tả |
|----------|----------|-------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | Backend API base URL |

## Available Scripts

### Backend

| Lệnh | Mô tả |
|------|-------|
| `pnpm dev` | Dev server (hot reload) |
| `pnpm build` | Compile TypeScript |
| `pnpm start` | Production server |
| `pnpm test` | Run integration tests |
| `pnpm typecheck` | TypeScript type check |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed database |
| `pnpm db:reset` | Reset database |

### Frontend

| Lệnh | Mô tả |
|------|-------|
| `pnpm dev` | Dev server (Next.js) |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | ESLint |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm typecheck` | TypeScript type check |

## API Endpoints

### Auth
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/api/auth/login` | — | Đăng nhập |
| POST | `/api/auth/logout` | ✅ | Đăng xuất |
| GET | `/api/auth/me` | ✅ | Thông tin user hiện tại |

### Users (admin only)
`GET/POST/PUT/DELETE /api/users[/:id]`

### Categories
`GET /api/categories` (admin/staff), `POST/PUT/DELETE` (admin only)

### Suppliers
`GET /api/suppliers` (admin/staff), `POST/PUT/DELETE` (admin only)

### Products
`GET /api/products` (admin/staff), `POST/PUT/DELETE` (admin only)

### Inventory
| Method | Endpoint | Auth | Vai trò |
|--------|----------|------|---------|
| GET | `/api/inventory/stock-overview` | ✅ | admin/staff |
| GET | `/api/inventory/movements` | ✅ | admin/staff |
| GET | `/api/inventory/low-stock` | ✅ | admin/staff |
| POST | `/api/inventory/import` | ✅ | admin/staff |
| POST | `/api/inventory/export` | ✅ | admin/staff |
| POST | `/api/inventory/adjust` | ✅ | admin only |

### Dashboard
`GET /api/dashboard/summary`, `GET /api/dashboard/recent-movements`

### Audit Logs (admin only)
`GET /api/audit-logs[/:id]`

Chi tiết: [API.md](backend/API.md) hoặc Swagger UI tại `/api/docs`.

## Frontend Pages (18 routes)

| Route | Vai trò |
|-------|---------|
| `/login` | Public |
| `/dashboard` | admin/staff |
| `/products` | admin/staff |
| `/products/new` | admin |
| `/products/:id` | admin/staff |
| `/products/:id/edit` | admin |
| `/categories` | admin/staff |
| `/suppliers` | admin/staff |
| `/inventory` | admin/staff |
| `/inventory/import` | admin/staff |
| `/inventory/export` | admin/staff |
| `/inventory/adjust` | admin |
| `/inventory/movements` | admin/staff |
| `/inventory/alerts` | admin/staff |
| `/admin/users` | admin |
| `/admin/users/new` | admin |
| `/admin/users/:id/edit` | admin |
| `/admin/audit-logs` | admin |

## Testing

### Backend (integration tests)

```bash
cd backend
pnpm test
```

Cần PostgreSQL + seed data. 9 test files: auth, product, inventory, CRUD, rate-limit, export, statistics, concurrency.

### Frontend (unit tests)

```bash
cd frontend
pnpm test          # 69 tests, 7 files
pnpm test:e2e      # Playwright, 6 spec files
pnpm test:e2e:ui   # Playwright UI mode
```

## Deployment

### Docker Compose (production)

```bash
docker compose up -d
```

Chạy PostgreSQL + backend. Frontend deploy riêng (Vercel, VPS, etc.).

### Backend Docker

```bash
cd backend
docker build -t inventory-api .
docker run -p 4000:4000 \
  -e DATABASE_URL=postgresql://user:pass@host/db \
  -e JWT_SECRET=your-secret \
  inventory-api
```

### Frontend (Vercel)

```bash
cd frontend
pnpm build
npx vercel --prod
```

Set `NEXT_PUBLIC_API_URL` trong Vercel project settings.

## CI/CD

Pipeline `.github/workflows/ci.yml`:

| Job | Steps |
|-----|-------|
| **backend** | PostgreSQL service → install → prisma migrate + seed → typecheck → test |
| **frontend** | Install → lint → test |

Chạy trên push/PR vào `main`.

## Security

- Passwords hashed với bcrypt (salt rounds: 10)
- JWT token hết hạn sau 24h, refresh token 7 ngày
- Role guard (admin/staff) trên từng endpoint
- Zod validation chặn input lỗi
- Soft delete (`isActive`) thay vì hard delete
- Inventory transaction chặn xuất âm kho ở database layer
