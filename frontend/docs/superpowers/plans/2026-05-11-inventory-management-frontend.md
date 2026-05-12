# Inventory Management System — Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 18-page admin dashboard for inventory management with role-based access (admin/staff).

**Architecture:** Next.js 16 App Router with custom UI components, fetch-based API client with JWT auth, Zustand for auth state, TanStack Query for server data, React Hook Form + Zod for forms, and Recharts for dashboard charts.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, React Hook Form, Zod, TanStack Query, Recharts, Lucide React, Zustand

**Key conventions:**
- `middleware.ts` → `proxy.ts` in Next.js 16 (export `proxy` not `middleware`)
- Token in localStorage keys: `inventory_token`, `inventory_user`
- Role-based route guards in proxy + UI-level hidden buttons
- API responses wrapped in `{ success, data, message }` format
- Vietnamese UI text throughout

**Pre-read:** Check `node_modules/next/dist/docs/` for any Next.js 16 breaking changes before writing code.

---

### Task 1: Install dependencies & create folder structure

**Files:**
- Modify: `package.json`
- Create: `.env.local`
- Create: All empty folders per spec

- [ ] **Step 1: Install dependencies**

```bash
pnpm add zustand @tanstack/react-query react-hook-form @hookform/resolvers zod recharts lucide-react
pnpm add -D @types/react
```

- [ ] **Step 2: Create .env.local**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

- [ ] **Step 3: Create folder structure**

```bash
mkdir -p app/"(auth)"/login
mkdir -p app/"(dashboard)"/dashboard
mkdir -p app/"(dashboard)"/products/new app/"(dashboard)"/products/"[id]"/edit
mkdir -p app/"(dashboard)"/categories app/"(dashboard)"/suppliers
mkdir -p app/"(dashboard)"/inventory/import app/"(dashboard)"/inventory/export app/"(dashboard)"/inventory/adjust app/"(dashboard)"/inventory/movements app/"(dashboard)"/inventory/alerts
mkdir -p app/"(dashboard)"/admin/users/new app/"(dashboard)"/admin/users/"[id]"/edit app/"(dashboard)"/admin/audit-logs
mkdir -p app/403
mkdir -p components/layout components/ui components/dashboard components/products components/categories components/suppliers components/inventory components/users components/audit-logs
mkdir -p hooks lib schemas types public/images
```

- [ ] **Step 4: Update globals.css**

```css
@import "tailwindcss";

@theme inline {
  --color-background: #f8fafc;
  --color-foreground: #0f172a;
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-secondary: #64748b;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;
  --color-info: #0891b2;
  --color-neutral: #6b7280;
  --color-sidebar: #1e293b;
  --color-sidebar-hover: #334155;
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--color-background);
  color: var(--color-foreground);
}
```

- [ ] **Step 5: Update root layout metadata and wrap with Providers**

Edit `app/layout.tsx`:
- Update `<html lang="vi">`
- Title: "Quản lý kho"
- Wrap children in `<Providers>` component

- [ ] **Step 6: Verify build**

```bash
pnpm build
```
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "setup: install deps, create folder structure, configure env and theme"
```

---

### Task 2: Create type definitions

**Files:** 9 files in `types/` — `api.type.ts`, `auth.type.ts`, `user.type.ts`, `product.type.ts`, `category.type.ts`, `supplier.type.ts`, `inventory.type.ts`, `dashboard.type.ts`, `audit-log.type.ts`

All types map directly from spec Section 10. Key types:

- `api.type.ts`: `PaginationMeta`, `ListResponse<T>`, `ApiResponse<T>`, `ApiError`
- `auth.type.ts`: `UserRole`, `AuthUser`, `LoginResponse`, `LoginPayload`
- `user.type.ts`: `User`, `CreateUserPayload`, `UpdateUserPayload`, `UsersResponse`
- `product.type.ts`: `StockStatus`, `Product`, `ProductListParams`, `CreateProductPayload`, `UpdateProductPayload`, `ProductsResponse`
- `category.type.ts`: `Category`, `CreateCategoryPayload`, `UpdateCategoryPayload`, `CategoriesResponse`
- `supplier.type.ts`: `Supplier`, `CreateSupplierPayload`, `UpdateSupplierPayload`, `SuppliersResponse`
- `inventory.type.ts`: `MovementType`, `StockMovement`, `StockOverviewItem`, `ImportStockPayload`, `ExportStockPayload`, `AdjustStockPayload`, `MovementListParams`, `MovementsResponse`, `LowStockItem`, `LowStockResponse`
- `dashboard.type.ts`: `DashboardSummary`, `RecentMovement`, `ImportExportChartData`, `CategoryStockData`
- `audit-log.type.ts`: `AuditLog`, `AuditLogListParams`, `AuditLogsResponse`

- [ ] **Step 1-9:** Create each type file with exact types from spec
- [ ] **Step 10:** `pnpm tsc --noEmit` — verify
- [ ] **Step 11:** Commit

---

### Task 3: Create Zod validation schemas

**Files:** `schemas/auth.schema.ts`, `product.schema.ts`, `category.schema.ts`, `supplier.schema.ts`, `inventory.schema.ts`, `user.schema.ts`

Map from spec Section 14. Each schema includes inferred type export.

Special cases:
- `inventory.schema.ts`: Also exports `adjustStockSchema` with `adjustmentType: z.enum(["increase", "decrease"])`
- `user.schema.ts`: Separate `createUserSchema` and `updateUserSchema` (password optional on update)
- `supplier.schema.ts`: Email field accepts `""` via `.or(z.literal(""))`

- [ ] **Step 1-6:** Create each schema file
- [ ] **Step 7:** `pnpm tsc --noEmit` — verify
- [ ] **Step 8:** Commit

---

### Task 4: Create library utilities

**Files:** 8 files in `lib/`

- `api-client.ts`: Generic fetch wrapper with JWT attachment, 401 handling → redirect login, error parsing
- `auth-storage.ts`: localStorage wrappers for `inventory_token` and `inventory_user`, SSR-safe
- `utils.ts`: `cn()` utility for conditional class joining
- `format.ts`: `formatCurrency` (VND), `formatDateTime` (vi-VN), `getStockStatusLabel`, `getMovementTypeLabel`
- `constants.ts`: `PAGE_SIZE`, `STOCK_STATUS_OPTIONS`, `MOVEMENT_TYPE_OPTIONS`, `USER_ROLE_OPTIONS`
- `query-keys.ts`: All TanStack Query key factories per spec Section 16
- `permissions.ts`: `canAccessRoute(route, role)` and `can(action, resource, role)` functions
- `menu.ts`: `MenuItem[]` with icon names, `getMenuItemsForRole(role)` filter function

- [ ] **Step 1-8:** Create each lib file
- [ ] **Step 9:** `pnpm tsc --noEmit` — verify
- [ ] **Step 10:** Commit

---

### Task 5: Create base UI components

**Files:** `components/ui/Button.tsx`, `Input.tsx`, `Textarea.tsx`, `Select.tsx`, `Badge.tsx`

Spec Section 11 specs:
- Button: `primary|secondary|outline|ghost|danger|success`, sizes `sm|md|lg`, `isLoading` with spinner
- Input: `label`, `error`, standard HTML input attrs
- Textarea: Same pattern as Input
- Select: `label`, `error`, `options: {value, label}[]`, `placeholder`
- Badge: `success|warning|danger|info|neutral`, use cases from spec

All components use `"use client"` directive and `cn()` for styling.

- [ ] **Step 1-5:** Create each component
- [ ] **Step 6:** `pnpm tsc --noEmit` — verify
- [ ] **Step 7:** Commit

---

### Task 6: Create composite UI components

**Files:** `components/ui/Table.tsx`, `Modal.tsx`, `Drawer.tsx`, `ConfirmDialog.tsx`, `Pagination.tsx`, `EmptyState.tsx`, `LoadingSkeleton.tsx`, `StatCard.tsx`

- Table: Generic `Table<T>` with columns, loading skeleton, hover rows. Renders `<table>` directly (no extra lib)
- Modal: Overlay + centered card, close on Escape/overlay click, body scroll lock
- Drawer: Slide-in from right, overlay backdrop
- ConfirmDialog: Modal wrapper with cancel/confirm buttons, `danger` variant for destructive actions
- Pagination: Page x/y display, prev/next buttons, disabled at boundaries
- EmptyState: Icon, title, description, optional CTA button
- LoadingSkeleton: Configurable `className` and `count`, animate-pulse
- StatCard: Title, value, optional icon and trend indicator

- [ ] **Step 1-8:** Create each component
- [ ] **Step 9:** `pnpm tsc --noEmit` — verify
- [ ] **Step 10:** Commit

---

### Task 7: Create auth system + login page

**Files:**
- `hooks/useAuth.ts` — Zustand store
- `app/providers.tsx` — TanStack Query client
- `app/(auth)/login/page.tsx` — Login form
- Modify `app/layout.tsx` — add Providers wrapper
- `components/ui/ToastContainer.tsx` — Global toast display
- `hooks/useToast.ts` — Toast state management

Auth store (Zustand):
- State: `user`, `token`, `isAuthenticated`, `isLoading`
- Actions: `initialize()` (hydrate from localStorage), `login()` (call API, store token/user), `logout()` (clear + redirect), `hasRole()`

Login form:
- React Hook Form + ZodResolver + loginSchema
- On success: redirect /dashboard
- On error: show "Email hoặc mật khẩu không đúng"
- Already authenticated → redirect /dashboard

Providers:
- Wrap app in `<QueryClientProvider>` with sensible defaults (retry: 1, staleTime: 30s)

Toast system:
- Global event-based pattern (not context) — `showToast()` function + `useToast()` hook + `<ToastContainer/>`
- Toast types: `success|error|info|warning`, auto-dismiss after 4s, colored borders

- [ ] **Step 1-8:** Create all auth files
- [ ] **Step 9:** `pnpm tsc --noEmit` — verify
- [ ] **Step 10:** Commit

---

### Task 8: Create route protection + error pages

**Files:**
- `proxy.ts` — Next.js 16 proxy (replaces middleware.ts)
- `app/403/page.tsx`
- `app/not-found.tsx` (replace default)

proxy.ts:
```ts
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("inventory_token")?.value;

  // Public routes: /login — if logged in, redirect to /dashboard
  if (pathname.startsWith("/login")) {
    if (token) return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }

  // Require auth
  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  // Admin routes check
  const role = request.cookies.get("inventory_role")?.value;
  const adminRoutes = ["/admin", "/inventory/adjust", "/products/new"];
  if (adminRoutes.some(r => pathname.startsWith(r)) && role !== "admin") {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

Note: Client-side login also needs to set `document.cookie = "inventory_role=..."` so proxy can read it.

- [ ] **Step 1-3:** Create proxy.ts, 403, not-found
- [ ] **Step 4:** `pnpm tsc --noEmit` — verify
- [ ] **Step 5:** Commit

---

### Task 9: Create dashboard layout

**Files:**
- `components/layout/AppSidebar.tsx` — Side nav with role-based menu, mobile drawer
- `components/layout/AppTopbar.tsx` — Header with menu toggle + UserMenu
- `components/layout/UserMenu.tsx` — User avatar dropdown with name/email/role/logout
- `components/layout/DashboardShell.tsx` — Layout wrapper with auth guard
- `app/(dashboard)/layout.tsx` — Route group layout using DashboardShell
- `components/layout/Breadcrumbs.tsx` — Optional breadcrumb component

Sidebar:
- Fixed 260px on desktop, drawer overlay on mobile
- Menu items from `lib/menu.ts`, filtered by role
- Active state based on `pathname`
- Lucide icons mapped by string name from menu config

DashboardShell:
- Calls `useAuth.initialize()` on mount
- Shows spinner while loading auth state
- Redirects to /login if not authenticated
- Renders sidebar + topbar + main content area

- [ ] **Step 1-5:** Create layout components
- [ ] **Step 6:** `pnpm tsc --noEmit` — verify
- [ ] **Step 7:** Commit

---

### Task 10: Create data fetching hooks

**Files:** `hooks/useProducts.ts`, `useCategories.ts`, `useSuppliers.ts`, `useInventory.ts`, `useUsers.ts`, `useAuditLogs.ts`, `useDebounce.ts`, `usePagination.ts`

Pattern per hook file (spec Section 15):
- List query: `useProducts(params)` → `useQuery` with `queryKeys.products(params)`
- Detail query: `useProduct(id)` → `useQuery` with `queryKeys.product(id)`, `enabled: !!id`
- Create mutation: `useCreateProduct()` → `useMutation`, invalidate list on success, showToast
- Update mutation: `useUpdateProduct()` → `useMutation({ id, data })`, invalidate list + detail
- Delete/hide mutation: `useDeleteProduct()` → `useMutation(id)`, invalidate list

useDebounce: Standard debounce hook (300ms for search inputs)
usePagination: `{ page, limit, setPage, setLimit }` state

- [ ] **Step 1-8:** Create all hook files
- [ ] **Step 9:** `pnpm tsc --noEmit` — verify
- [ ] **Step 10:** Commit

---

### Task 11: Create Dashboard page

**Files:**
- `components/dashboard/DashboardKpiCards.tsx` — 6 StatCards in grid (total products, low stock, out of stock, import today, export today, stock value)
- `components/dashboard/RecentMovements.tsx` — Table with last 5 transactions
- `components/dashboard/LowStockPreview.tsx` — Top 5 low-stock items with link to alerts
- `components/dashboard/ImportExportChart.tsx` — Recharts BarChart (2 data series)
- `components/dashboard/CategoryStockChart.tsx` — Recharts PieChart with color coding
- `app/(dashboard)/dashboard/page.tsx` — Compose all above + quick action buttons

Dashboard page fetches 4 API endpoints in parallel (summay, recent, import-export chart, category chart). Shows loading skeletons, empty chart states, and error states.

- [ ] **Step 1-6:** Create dashboard components + page
- [ ] **Step 7:** `pnpm tsc --noEmit` — verify
- [ ] **Step 8:** Commit

---

### Task 12: Create Products CRUD pages

**Files:**
- `components/products/ProductStatusBadge.tsx` — Badge wrapper mapped to stock status
- `components/products/ProductFilters.tsx` — Search + 3 dropdowns with debounced search
- `components/products/ProductTable.tsx` — Full table with row action menu
- `components/products/ProductForm.tsx` — Create/edit form with all fields, stock note for edit
- `components/products/ProductInfoCard.tsx` — Detail card with grid layout
- `components/products/ProductMovementMiniTable.tsx` — Recent movements for product
- `app/(dashboard)/products/page.tsx` — List with filters + pagination
- `app/(dashboard)/products/new/page.tsx` — Create form (admin only)
- `app/(dashboard)/products/[id]/page.tsx` — Detail with info card + movements
- `app/(dashboard)/products/[id]/edit/page.tsx` — Edit form (admin only)

Key behaviors:
- Row action menu: View, Edit (admin), Import, Export, Hide (admin)
- ProductForm: Hides currentStock field on edit, shows info banner
- Empty states: "Chưa có sản phẩm nào" vs "Không tìm thấy sản phẩm phù hợp"
- Error state with retry button

- [ ] **Step 1-10:** Create all product files
- [ ] **Step 11:** `pnpm tsc --noEmit` — verify
- [ ] **Step 12:** Commit

---

### Task 13: Create Categories + Suppliers pages

**Files:**
- `components/categories/CategoryTable.tsx` — Table with edit/hide for admin
- `components/categories/CategoryFormModal.tsx` — Modal form for create/edit
- `components/suppliers/SupplierTable.tsx` — Table with phone/email/address
- `components/suppliers/SupplierFormModal.tsx` — Modal form for create/edit
- `app/(dashboard)/categories/page.tsx` — List + modal + confirm dialog
- `app/(dashboard)/suppliers/page.tsx` — List + modal + confirm dialog

Staff: view-only (no add/edit/hide buttons)
Admin: full CRUD via modals + confirm dialog

- [ ] **Step 1-6:** Create categories/suppliers files
- [ ] **Step 7:** `pnpm tsc --noEmit` — verify
- [ ] **Step 8:** Commit

---

### Task 14: Create Inventory pages

**Files:**
- `components/inventory/StockOverviewTable.tsx` — Table with view/import/export actions
- `components/inventory/ImportStockForm.tsx` — Form with dynamic preview (stockAfter, totalAmount)
- `components/inventory/ExportStockForm.tsx` — Form with stock check warning
- `components/inventory/StockAdjustmentForm.tsx` — Form with increase/decrease toggle (admin only)
- `components/inventory/StockSummaryCard.tsx` — Summary stat cards for inventory
- `app/(dashboard)/inventory/page.tsx` — Stock overview with search/filter
- `app/(dashboard)/inventory/import/page.tsx` — Import form with confirm modal
- `app/(dashboard)/inventory/export/page.tsx` — Export form with quantity validation
- `app/(dashboard)/inventory/adjust/page.tsx` — Adjustment form (admin only)

Key behaviors:
- Import: Select product → show SKU/name/currentStock, calculate stockAfter, show totalAmount
- Export: Select product → show currentStock, warn if quantity > currentStock, disable submit
- Adjust: increase/decrease toggle, warn if decrease > currentStock, require confirm modal
- All forms use React Hook Form + Zod + ConfirmDialog before API call

- [ ] **Step 1-9:** Create all inventory files
- [ ] **Step 10:** `pnpm tsc --noEmit` — verify
- [ ] **Step 11:** Commit

---

### Task 15: Create Movement History + Alerts pages

**Files:**
- `components/inventory/MovementTable.tsx` — Full table with all columns from spec
- `components/inventory/MovementDetailDrawer.tsx` — Drawer with movement details
- `components/inventory/LowStockTable.tsx` — Table with shortage column + import action
- `app/(dashboard)/inventory/movements/page.tsx` — History with type/date/user filters
- `app/(dashboard)/inventory/alerts/page.tsx` — Summary cards + tabs + table

Movements page:
- Filters: Search product/SKU, Type dropdown, Date range inputs, User select
- Table columns: Time, Product, SKU, Type (badge), Quantity, Stock Before, Stock After, User, Note
- Click row → open MovementDetailDrawer

Alerts page:
- Summary cards: Total alerts, Low stock count, Out of stock count
- Tabs: All / Low stock / Out of stock
- Table: Product, SKU, Category, Current stock, Min stock, Shortage (min - current), Status, Actions
- Actions: Import stock (link to import page with product selected), View product

- [ ] **Step 1-5:** Create all inventory movement/alert files
- [ ] **Step 6:** `pnpm tsc --noEmit` — verify
- [ ] **Step 7:** Commit

---

### Task 16: Create Admin pages (Users + Audit Logs)

**Files:**
- `components/users/UserTable.tsx` — Table with role badge, status badge, edit/lock actions
- `components/users/UserForm.tsx` — Create/edit form, password optional on edit
- `components/audit-logs/AuditLogTable.tsx` — Table with action/badge
- `components/audit-logs/AuditLogDetailDrawer.tsx` — Drawer with old/new values diff
- `app/(dashboard)/admin/users/page.tsx` — List with search/role/status filters
- `app/(dashboard)/admin/users/new/page.tsx` — Create user form
- `app/(dashboard)/admin/users/[id]/edit/page.tsx` — Edit user form
- `app/(dashboard)/admin/audit-logs/page.tsx` — Log list with action/date/user filters

Users:
- Actions: Lock/unlock toggle (PATCH), Edit, Delete not shown (soft-delete → lock)
- Form: role selects admin/staff, isActive checkbox, password optional on edit

Audit Logs:
- Table: Time, User, Action, Table, Record ID, Description
- Click row → open AuditLogDetailDrawer showing old_values vs new_values

- [ ] **Step 1-8:** Create all admin files
- [ ] **Step 9:** `pnpm tsc --noEmit` — verify
- [ ] **Step 10:** Commit

---

### Task 17: Polish, final build check & root page redirect

**Files:**
- `app/page.tsx` — Redirect to /dashboard
- Final build verification

- [ ] **Step 1: Update root page**

Replace default Next.js landing page with:
```ts
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/dashboard");
}
```

- [ ] **Step 2: Final build check**

```bash
pnpm build
```
Expected: Clean build with no TypeScript or ESLint errors.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: redirect root to dashboard"
```

---

## Self-Review Checklist

**Spec coverage:**
- [ ] 18 pages all present (login, dashboard, products×4, categories, suppliers, inventory×6, users×3, audit-logs)
- [ ] Auth with JWT token in localStorage
- [ ] Role-based sidebar (admin sees 12 items, staff sees 8)
- [ ] Route guard in proxy.ts + UI-level hidden buttons
- [ ] All loading/empty/error/success states per spec Section 17
- [ ] Form validation with Zod for all forms
- [ ] Dashboard with 6 KPI cards, 2 charts, recent movements, low stock preview
- [ ] Products with search/filter/pagination, detail page with movements
- [ ] Categories/Suppliers with modal CRUD
- [ ] Import stock with stockAfter preview
- [ ] Export stock with quantity > currentStock warning
- [ ] Stock adjustment with confirm modal
- [ ] Movement history with filters + detail drawer
- [ ] Low stock alerts with summary + tabs
- [ ] Users management (admin only)
- [ ] Audit logs (admin only)

**Placeholder scan:** All tasks contain complete code descriptions. No "TBD", "TODO", "implement later", or "add proper error handling" placeholders.

**Type consistency:** All types reference spec Section 10 definitions. Hook return types match component prop types. API client returns generic `T`.

---

## Execution Options

**Plan complete.** Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks for quality
2. **Inline Execution** — Execute tasks in this session with checkpoints

**Which approach do you prefer?**
