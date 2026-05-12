# Quản lý kho — Frontend

Hệ thống quản lý kho hàng với giao diện admin dashboard hiện đại. Hỗ trợ hai vai trò admin/staff, quản lý sản phẩm, danh mục, nhà cung cấp, nhập/xuất/điều chỉnh kho, dashboard thống kê và audit log.

## Công nghệ

- **Framework:** Next.js 16 (App Router)
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS 4
- **State:** Zustand + TanStack Query
- **Form:** React Hook Form + Zod
- **Chart:** Recharts
- **Icons:** Lucide React
- **Testing:** Vitest + React Testing Library + Playwright
- **Mock API:** MSW (Mock Service Worker)

## Bắt đầu

```bash
pnpm install
cp .env.local.example .env.local   # nếu chưa có
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Scripts

| Lệnh | Mô tả |
|------|-------|
| `pnpm dev` | Dev server |
| `pnpm build` | Build production |
| `pnpm start` | Start production |
| `pnpm lint` | ESLint |
| `pnpm test` | Unit tests |
| `pnpm test:e2e` | E2E tests (Playwright) |

## Cấu trúc thư mục

```
frontend/
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Login
│   └── (dashboard)/  # Protected pages
├── components/       # UI & feature components
│   ├── layout/       # AppSidebar, AppTopbar, DashboardShell
│   ├── ui/           # Button, Table, Modal, Pagination...
│   └── products/ inventory/ ... # Feature components
├── hooks/            # Custom hooks (TanStack Query)
├── lib/              # API client, auth storage, utils
├── schemas/          # Zod validation schemas
├── types/            # TypeScript types
├── mocks/            # MSW handlers & data
├── __tests__/        # Unit tests
└── e2e/              # Playwright E2E tests
```

## Pages

| Route | Vai trò | Mô tả |
|-------|---------|-------|
| `/login` | Public | Đăng nhập |
| `/dashboard` | admin/staff | Dashboard thống kê |
| `/products` | admin/staff | Danh sách sản phẩm |
| `/products/new` | admin | Thêm sản phẩm |
| `/products/:id` | admin/staff | Chi tiết sản phẩm |
| `/products/:id/edit` | admin | Sửa sản phẩm |
| `/categories` | admin/staff | Danh mục |
| `/suppliers` | admin/staff | Nhà cung cấp |
| `/inventory` | admin/staff | Tổng quan tồn kho |
| `/inventory/import` | admin/staff | Nhập kho |
| `/inventory/export` | admin/staff | Xuất kho |
| `/inventory/adjust` | admin | Điều chỉnh kho |
| `/inventory/movements` | admin/staff | Lịch sử giao dịch |
| `/inventory/alerts` | admin/staff | Cảnh báo tồn kho |
| `/admin/users` | admin | Quản lý người dùng |
| `/admin/users/new` | admin | Thêm người dùng |
| `/admin/users/:id/edit` | admin | Sửa người dùng |
| `/admin/audit-logs` | admin | Nhật ký hoạt động |

## Biến môi trường

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | Backend API URL |
