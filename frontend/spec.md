Dưới đây là **Frontend Specification** chi tiết cho dự án **Inventory Management System** bản sinh viên, theo scope đã chốt: **18 page**, **2 role `admin/staff`**, kết nối với backend REST API, UI dạng modern admin dashboard.

# 1. Frontend Overview

## 1.1. Mục tiêu frontend

Frontend chịu trách nhiệm:

```text
- Hiển thị giao diện quản lý kho
- Đăng nhập / đăng xuất
- Lưu và gửi JWT token khi gọi API
- Render menu theo role admin/staff
- CRUD sản phẩm, danh mục, nhà cung cấp, người dùng
- Form nhập kho, xuất kho, điều chỉnh kho
- Hiển thị dashboard, cảnh báo tồn kho, lịch sử giao dịch
- Hiển thị loading, empty, error, success states
- Validate form cơ bản trước khi gửi API
```

Scope này bám theo yêu cầu dự án: auth, phân quyền, quản lý sản phẩm/danh mục, nhập/xuất kho có lịch sử, dashboard, search/filter và cảnh báo sắp hết hàng. 

---

# 2. Tech Stack Frontend

## 2.1. Stack khuyến nghị

```text
Framework: Next.js
Language: TypeScript
Styling: Tailwind CSS
Form: React Hook Form
Validation: Zod
Data fetching: TanStack Query hoặc custom API client
Chart: Recharts
Icons: Lucide React
UI components: shadcn/ui hoặc tự xây component
State management: Zustand hoặc Context API
```

## 2.2. Lựa chọn đơn giản cho sinh viên

Nếu muốn dễ triển khai:

```text
Next.js + TypeScript + Tailwind CSS + React Hook Form + Zod + Recharts
```

Nếu chưa quen Next.js, có thể dùng:

```text
React + Vite + TypeScript + Tailwind CSS
```

Tuy nhiên spec này sẽ viết theo **Next.js App Router**.

---

# 3. Frontend Architecture

## 3.1. Kiến trúc tổng thể

```text
Page
  ↓
Feature Component
  ↓
Shared UI Component
  ↓
Hook
  ↓
API Client
  ↓
Backend REST API
```

## 3.2. Nguyên tắc chia code

```text
Page:
- Chỉ compose layout và component chính
- Không chứa logic nghiệp vụ dài

Component:
- Render UI
- Nhận props rõ ràng
- Tách table, form, filter, modal

Hook:
- Gọi API
- Quản lý loading/error state
- Xử lý mutation create/update/delete

API Client:
- Cấu hình base URL
- Gắn Authorization token
- Chuẩn hóa response/error

Schema:
- Validate form bằng Zod

Types:
- Khai báo type cho API response và entity
```

---

# 4. Frontend Folder Structure

```text
apps/web/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   │
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   │
│   │   ├── suppliers/
│   │   │   └── page.tsx
│   │   │
│   │   ├── inventory/
│   │   │   ├── page.tsx
│   │   │   ├── import/
│   │   │   │   └── page.tsx
│   │   │   ├── export/
│   │   │   │   └── page.tsx
│   │   │   ├── adjust/
│   │   │   │   └── page.tsx
│   │   │   ├── movements/
│   │   │   │   └── page.tsx
│   │   │   └── alerts/
│   │   │       └── page.tsx
│   │   │
│   │   └── admin/
│   │       ├── users/
│   │       │   ├── page.tsx
│   │       │   ├── new/
│   │       │   │   └── page.tsx
│   │       │   └── [id]/
│   │       │       └── edit/
│   │       │           └── page.tsx
│   │       │
│   │       └── audit-logs/
│   │           └── page.tsx
│   │
│   ├── 403/
│   │   └── page.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── layout/
│   │   ├── AppSidebar.tsx
│   │   ├── AppTopbar.tsx
│   │   ├── DashboardShell.tsx
│   │   ├── Breadcrumbs.tsx
│   │   └── UserMenu.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   ├── Table.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Drawer.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── Pagination.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   └── StatCard.tsx
│   │
│   ├── dashboard/
│   │   ├── DashboardKpiCards.tsx
│   │   ├── RecentMovements.tsx
│   │   ├── LowStockPreview.tsx
│   │   ├── ImportExportChart.tsx
│   │   └── CategoryStockChart.tsx
│   │
│   ├── products/
│   │   ├── ProductTable.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductForm.tsx
│   │   ├── ProductStatusBadge.tsx
│   │   ├── ProductInfoCard.tsx
│   │   └── ProductMovementMiniTable.tsx
│   │
│   ├── categories/
│   │   ├── CategoryTable.tsx
│   │   └── CategoryFormModal.tsx
│   │
│   ├── suppliers/
│   │   ├── SupplierTable.tsx
│   │   └── SupplierFormModal.tsx
│   │
│   ├── inventory/
│   │   ├── StockOverviewTable.tsx
│   │   ├── ImportStockForm.tsx
│   │   ├── ExportStockForm.tsx
│   │   ├── StockAdjustmentForm.tsx
│   │   ├── StockSummaryCard.tsx
│   │   ├── MovementTable.tsx
│   │   ├── MovementDetailDrawer.tsx
│   │   └── LowStockTable.tsx
│   │
│   ├── users/
│   │   ├── UserTable.tsx
│   │   └── UserForm.tsx
│   │
│   └── audit-logs/
│       ├── AuditLogTable.tsx
│       └── AuditLogDetailDrawer.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   ├── usePagination.ts
│   ├── useToast.ts
│   ├── useProducts.ts
│   ├── useCategories.ts
│   ├── useSuppliers.ts
│   ├── useInventory.ts
│   ├── useUsers.ts
│   └── useAuditLogs.ts
│
├── lib/
│   ├── api-client.ts
│   ├── auth-storage.ts
│   ├── constants.ts
│   ├── format.ts
│   ├── menu.ts
│   ├── permissions.ts
│   ├── query-keys.ts
│   └── utils.ts
│
├── schemas/
│   ├── auth.schema.ts
│   ├── product.schema.ts
│   ├── category.schema.ts
│   ├── supplier.schema.ts
│   ├── inventory.schema.ts
│   └── user.schema.ts
│
├── types/
│   ├── api.type.ts
│   ├── auth.type.ts
│   ├── user.type.ts
│   ├── product.type.ts
│   ├── category.type.ts
│   ├── supplier.type.ts
│   ├── inventory.type.ts
│   ├── dashboard.type.ts
│   └── audit-log.type.ts
│
├── public/
│   ├── logo.svg
│   └── images/
│
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

# 5. Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

# 6. Route Structure

## Public routes

```text
/login
/403
/404
```

## Protected routes

```text
/dashboard

/products
/products/new
/products/:id
/products/:id/edit

/categories
/suppliers

/inventory
/inventory/import
/inventory/export
/inventory/adjust
/inventory/movements
/inventory/alerts

/admin/users
/admin/users/new
/admin/users/:id/edit
/admin/audit-logs
```

---

# 7. Role-based Route Access

| Route                  | Admin | Staff |
| ---------------------- | ----: | ----: |
| `/dashboard`           |    Có |    Có |
| `/products`            |    Có |    Có |
| `/products/new`        |    Có | Không |
| `/products/:id`        |    Có |    Có |
| `/products/:id/edit`   |    Có | Không |
| `/categories`          |    Có |   Xem |
| `/suppliers`           |    Có |   Xem |
| `/inventory`           |    Có |    Có |
| `/inventory/import`    |    Có |    Có |
| `/inventory/export`    |    Có |    Có |
| `/inventory/adjust`    |    Có | Không |
| `/inventory/movements` |    Có |    Có |
| `/inventory/alerts`    |    Có |    Có |
| `/admin/users`         |    Có | Không |
| `/admin/audit-logs`    |    Có | Không |

## Behavior

```text
Chưa login:
- redirect về /login

Login rồi nhưng không đủ quyền:
- redirect về /403

Login rồi và vào /login:
- redirect về /dashboard
```

---

# 8. Auth Frontend Spec

## 8.1. Token storage

Đơn giản cho dự án sinh viên:

```text
localStorage lưu accessToken
localStorage lưu user info
```

Tên key:

```text
inventory_token
inventory_user
```

Nếu muốn tốt hơn:

```text
Lưu token trong httpOnly cookie do backend set
```

Nhưng bản sinh viên dùng `localStorage` là dễ làm hơn.

## 8.2. Auth state

`useAuth` cần cung cấp:

```ts
type UseAuthReturn = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: "admin" | "staff") => boolean;
};
```

## 8.3. Login page behavior

```text
Submit form:
- validate email/password
- gọi POST /api/auth/login
- lưu token + user
- redirect /dashboard

Nếu lỗi:
- hiển thị message "Email hoặc mật khẩu không đúng"
```

---

# 9. API Client Spec

## 9.1. File

```text
lib/api-client.ts
```

## 9.2. Responsibilities

```text
- Set base URL từ NEXT_PUBLIC_API_URL
- Attach Authorization Bearer token
- Parse JSON response
- Throw error nếu API trả success = false
- Handle 401 bằng logout/redirect login
```

## 9.3. Pseudo-code

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json = await response.json();

  if (!response.ok || json.success === false) {
    throw new Error(json.message || "Có lỗi xảy ra");
  }

  return json.data as T;
}
```

---

# 10. Type Definitions

## 10.1. Auth types

```ts
export type UserRole = "admin" | "staff";

export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};
```

## 10.2. Product types

```ts
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type Product = {
  id: number;
  sku: string;
  name: string;
  description?: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minStock: number;
  imageUrl?: string;
  isActive: boolean;
  stockStatus: StockStatus;
  category: {
    id: number;
    name: string;
  };
  supplier?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};
```

## 10.3. Inventory types

```ts
export type MovementType = "import" | "export" | "adjustment";

export type StockMovement = {
  id: number;
  type: MovementType;
  quantityChange: number;
  stockBefore: number;
  stockAfter: number;
  referenceId?: number;
  referenceType?: "stock_import" | "stock_export" | "manual";
  note?: string;
  createdAt: string;
  product: {
    id: number;
    sku: string;
    name: string;
  };
  createdBy: {
    id: number;
    fullName: string;
  };
};
```

## 10.4. API list response

```ts
export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type ListResponse<T> = {
  items: T[];
  pagination: PaginationMeta;
};
```

---

# 11. Shared UI Component Spec

## 11.1. Button

Variants:

```text
primary
secondary
outline
ghost
danger
success
```

Sizes:

```text
sm
md
lg
```

Props:

```ts
type ButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
};
```

---

## 11.2. Badge

Variants:

```text
success
warning
danger
info
neutral
```

Use cases:

```text
Còn hàng
Sắp hết
Hết hàng
Nhập kho
Xuất kho
Điều chỉnh
Admin
Staff
Hoạt động
Tạm khóa
```

---

## 11.3. Table

Common behavior:

```text
- Header
- Body
- Row hover
- Action menu
- Loading skeleton
- Empty state
- Pagination
```

Table component có thể là generic hoặc mỗi module tự có table riêng.

---

## 11.4. Modal

Dùng cho:

```text
- Create/Edit Category
- Create/Edit Supplier
- Confirm delete
- Confirm import/export/adjustment
```

---

## 11.5. Drawer

Dùng cho:

```text
- Movement detail
- Audit log detail
```

---

## 11.6. EmptyState

Props:

```ts
type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};
```

---

# 12. Layout Spec

## 12.1. DashboardShell

Tất cả protected page dùng layout:

```text
Sidebar bên trái
Topbar phía trên
Main content
```

Desktop:

```text
Sidebar width: 260px
Topbar height: 64px
Content padding: 24px
```

Tablet:

```text
Sidebar thu gọn hoặc drawer
Content padding: 16px
```

Mobile:

```text
Sidebar thành drawer
Table có horizontal scroll hoặc card list
```

---

## 12.2. Sidebar menu

Admin menu:

```text
Dashboard
Sản phẩm
Danh mục
Nhà cung cấp
Tồn kho
Nhập kho
Xuất kho
Điều chỉnh kho
Lịch sử giao dịch
Cảnh báo tồn kho
Người dùng
Nhật ký
```

Staff menu:

```text
Dashboard
Sản phẩm
Tồn kho
Nhập kho
Xuất kho
Lịch sử giao dịch
Cảnh báo tồn kho
```

Menu item type:

```ts
type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType;
  roles: UserRole[];
};
```

---

## 12.3. Topbar

Components:

```text
- Sidebar toggle
- Global search input
- Notification icon
- User avatar
- User dropdown
```

User dropdown:

```text
- Tên user
- Email
- Role
- Đăng xuất
```

---

# 13. Page Spec

# 13.1. Login Page

Route:

```text
/login
```

Components:

```text
LoginForm
```

Form fields:

```text
email
password
rememberMe optional
```

Validation:

```text
email required, valid email
password required
```

Actions:

```text
Đăng nhập
```

States:

```text
loading
invalid credentials
inactive account
```

After login:

```text
redirect /dashboard
```

---

# 13.2. Dashboard Page

Route:

```text
/dashboard
```

API:

```text
GET /api/dashboard/summary
GET /api/dashboard/recent-movements
GET /api/dashboard/import-export-chart
GET /api/dashboard/category-chart
```

Components:

```text
DashboardKpiCards
LowStockPreview
RecentMovements
ImportExportChart
CategoryStockChart
QuickActions
```

KPI cards:

```text
Tổng sản phẩm
Sắp hết hàng
Hết hàng
Nhập hôm nay
Xuất hôm nay
Giá trị tồn kho
```

Quick actions:

```text
Nhập kho
Xuất kho
Thêm sản phẩm
Xem cảnh báo
```

States:

```text
loading skeleton
empty chart
API error
```

---

# 13.3. Products List Page

Route:

```text
/products
```

API:

```text
GET /api/products
```

Query params:

```text
search
categoryId
supplierId
stockStatus
page
limit
```

Components:

```text
ProductFilters
ProductTable
Pagination
```

Filter fields:

```text
Search by name/SKU
Category select
Supplier select
Stock status select
```

Table columns:

```text
Ảnh
SKU
Tên sản phẩm
Danh mục
Nhà cung cấp
Tồn kho
Tồn tối thiểu
Giá bán
Trạng thái
Thao tác
```

Actions:

```text
Xem chi tiết
Chỉnh sửa admin only
Nhập kho
Xuất kho
Ẩn sản phẩm admin only
```

Empty state:

```text
Chưa có sản phẩm nào
```

No result state:

```text
Không tìm thấy sản phẩm phù hợp
```

---

# 13.4. Product Detail Page

Route:

```text
/products/[id]
```

API:

```text
GET /api/products/:id
GET /api/inventory/movements?productId=:id
```

Components:

```text
ProductInfoCard
ProductStockCard
ProductMovementMiniTable
```

Sections:

```text
Product image
Basic information
Stock summary
Price information
Supplier information
Recent movements
```

Actions:

```text
Edit product admin only
Import stock
Export stock
Adjust stock admin only
```

---

# 13.5. Create Product Page

Route:

```text
/products/new
```

Access:

```text
admin only
```

API:

```text
GET /api/categories
GET /api/suppliers
POST /api/products
```

Components:

```text
ProductForm
```

Fields:

```text
sku
name
categoryId
supplierId
unit
description
costPrice
sellingPrice
currentStock
minStock
imageUrl
isActive
```

Validation:

```text
sku required
name required
category required
costPrice >= 0
sellingPrice >= 0
currentStock >= 0
minStock >= 0
```

After success:

```text
Toast: Tạo sản phẩm thành công
Redirect /products hoặc /products/:id
```

---

# 13.6. Edit Product Page

Route:

```text
/products/[id]/edit
```

Access:

```text
admin only
```

API:

```text
GET /api/products/:id
PUT /api/products/:id
```

Fields editable:

```text
sku
name
categoryId
supplierId
unit
description
costPrice
sellingPrice
minStock
imageUrl
isActive
```

Không cho sửa trực tiếp:

```text
currentStock
```

UI note:

```text
Muốn thay đổi tồn kho? Sử dụng Nhập kho / Xuất kho / Điều chỉnh kho.
```

---

# 13.7. Categories Page

Route:

```text
/categories
```

API:

```text
GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id
```

Components:

```text
CategoryTable
CategoryFormModal
ConfirmDialog
```

Table columns:

```text
Tên danh mục
Mô tả
Số sản phẩm
Trạng thái
Ngày tạo
Thao tác
```

Staff:

```text
Chỉ xem
Không hiện nút thêm/sửa/xóa
```

Admin:

```text
Thêm danh mục
Sửa danh mục
Ẩn danh mục
```

---

# 13.8. Suppliers Page

Route:

```text
/suppliers
```

API:

```text
GET /api/suppliers
POST /api/suppliers
PUT /api/suppliers/:id
DELETE /api/suppliers/:id
```

Components:

```text
SupplierTable
SupplierFormModal
ConfirmDialog
```

Table columns:

```text
Tên nhà cung cấp
Số điện thoại
Email
Địa chỉ
Số sản phẩm
Trạng thái
Thao tác
```

Staff:

```text
Chỉ xem
```

Admin:

```text
Thêm
Sửa
Ẩn
```

---

# 13.9. Stock Overview Page

Route:

```text
/inventory
```

API:

```text
GET /api/inventory/stock-overview
```

Filters:

```text
Search product/SKU
Category
Stock status
```

Table columns:

```text
Sản phẩm
SKU
Danh mục
Tồn hiện tại
Tồn tối thiểu
Đơn vị
Trạng thái
Hành động
```

Actions:

```text
Nhập kho
Xuất kho
Xem chi tiết
```

---

# 13.10. Import Stock Page

Route:

```text
/inventory/import
```

API:

```text
GET /api/products
GET /api/suppliers
POST /api/inventory/import
```

Fields:

```text
productId
supplierId
quantity
importPrice
note
```

Dynamic UI:

```text
Khi chọn product:
- hiện SKU
- hiện tên sản phẩm
- hiện currentStock
- hiện minStock

Khi nhập quantity:
- tính stockAfter = currentStock + quantity
- tính totalAmount = quantity * importPrice
```

Submit flow:

```text
1. Validate form.
2. Mở confirm modal.
3. User xác nhận.
4. Gọi API.
5. Toast success.
6. Redirect /inventory/movements hoặc reset form.
```

---

# 13.11. Export Stock Page

Route:

```text
/inventory/export
```

API:

```text
GET /api/products
POST /api/inventory/export
```

Fields:

```text
productId
quantity
exportPrice
note
```

Dynamic UI:

```text
Khi chọn product:
- hiện currentStock

Khi nhập quantity:
- nếu quantity > currentStock:
  hiển thị warning
  disable submit

stockAfter = currentStock - quantity
totalAmount = quantity * exportPrice
```

Warning:

```text
Không đủ tồn kho. Vui lòng nhập số lượng nhỏ hơn hoặc bằng tồn hiện tại.
```

---

# 13.12. Stock Adjustment Page

Route:

```text
/inventory/adjust
```

Access:

```text
admin only
```

API:

```text
POST /api/inventory/adjust
```

Fields:

```text
productId
adjustmentType: increase/decrease
quantity
note
```

Dynamic UI:

```text
increase:
stockAfter = currentStock + quantity

decrease:
stockAfter = currentStock - quantity

Nếu stockAfter < 0:
- warning
- disable submit
```

Submit:

```text
Confirm modal bắt buộc
```

---

# 13.13. Movement History Page

Route:

```text
/inventory/movements
```

API:

```text
GET /api/inventory/movements
```

Filters:

```text
Search product/SKU
Type: import/export/adjustment
Date range
User
```

Table columns:

```text
Thời gian
Sản phẩm
SKU
Loại
Số lượng thay đổi
Tồn trước
Tồn sau
Người thực hiện
Ghi chú
```

Actions:

```text
Xem chi tiết
```

Detail:

```text
MovementDetailDrawer
```

---

# 13.14. Low Stock Alerts Page

Route:

```text
/inventory/alerts
```

API:

```text
GET /api/inventory/low-stock
```

Sections:

```text
Summary cards:
- Tất cả cảnh báo
- Sắp hết hàng
- Hết hàng

Tabs:
- Tất cả
- Sắp hết
- Hết hàng

Table:
- Sản phẩm
- SKU
- Danh mục
- Tồn hiện tại
- Tồn tối thiểu
- Thiếu hụt
- Trạng thái
- Hành động
```

Actions:

```text
Nhập kho
Xem sản phẩm
```

---

# 13.15. Users List Page

Route:

```text
/admin/users
```

Access:

```text
admin only
```

API:

```text
GET /api/users
DELETE /api/users/:id
```

Filters:

```text
Search name/email
Role
Status
```

Table columns:

```text
Họ tên
Email
Vai trò
Trạng thái
Ngày tạo
Thao tác
```

Actions:

```text
Thêm user
Sửa user
Khóa/Mở khóa user
```

---

# 13.16. Create User Page

Route:

```text
/admin/users/new
```

Access:

```text
admin only
```

Fields:

```text
fullName
email
password
role
isActive
```

Validation:

```text
fullName required
email required and valid
password min 6
role admin/staff
```

---

# 13.17. Edit User Page

Route:

```text
/admin/users/[id]/edit
```

Access:

```text
admin only
```

Fields:

```text
fullName
email
password optional
role
isActive
```

Note:

```text
Password để trống nếu không đổi.
```

---

# 13.18. Audit Logs Page

Route:

```text
/admin/audit-logs
```

Access:

```text
admin only
```

API:

```text
GET /api/audit-logs
GET /api/audit-logs/:id
```

Filters:

```text
Search description/record ID/user
Action
Date range
User
```

Table columns:

```text
Thời gian
Người thực hiện
Hành động
Bảng
Record ID
Mô tả
```

Detail:

```text
AuditLogDetailDrawer
```

---

# 14. Form Validation Schemas

## Login

```ts
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});
```

## Product form

```ts
export const productSchema = z.object({
  sku: z.string().min(1, "Vui lòng nhập SKU"),
  name: z.string().min(1, "Vui lòng nhập tên sản phẩm"),
  categoryId: z.number().positive("Vui lòng chọn danh mục"),
  supplierId: z.number().optional(),
  unit: z.string().min(1, "Vui lòng nhập đơn vị tính"),
  description: z.string().optional(),
  costPrice: z.number().min(0, "Giá nhập không hợp lệ"),
  sellingPrice: z.number().min(0, "Giá bán không hợp lệ"),
  currentStock: z.number().min(0, "Tồn kho không hợp lệ").optional(),
  minStock: z.number().min(0, "Tồn tối thiểu không hợp lệ"),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
});
```

## Import stock

```ts
export const importStockSchema = z.object({
  productId: z.number().positive("Vui lòng chọn sản phẩm"),
  supplierId: z.number().positive("Vui lòng chọn nhà cung cấp").optional(),
  quantity: z.number().positive("Số lượng nhập phải lớn hơn 0"),
  importPrice: z.number().min(0, "Giá nhập không hợp lệ"),
  note: z.string().optional(),
});
```

## Export stock

```ts
export const exportStockSchema = z.object({
  productId: z.number().positive("Vui lòng chọn sản phẩm"),
  quantity: z.number().positive("Số lượng xuất phải lớn hơn 0"),
  exportPrice: z.number().min(0, "Giá xuất không hợp lệ"),
  note: z.string().optional(),
});
```

## User form

```ts
export const userSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").optional(),
  role: z.enum(["admin", "staff"]),
  isActive: z.boolean(),
});
```

---

# 15. Hooks Spec

## useProducts

```ts
useProducts(params)
useProduct(id)
useCreateProduct()
useUpdateProduct()
useDeleteProduct()
```

## useInventory

```ts
useStockOverview(params)
useImportStock()
useExportStock()
useAdjustStock()
useMovements(params)
useLowStock(params)
```

## useCategories

```ts
useCategories(params)
useCreateCategory()
useUpdateCategory()
useDeleteCategory()
```

## useSuppliers

```ts
useSuppliers(params)
useCreateSupplier()
useUpdateSupplier()
useDeleteSupplier()
```

## useUsers

```ts
useUsers(params)
useCreateUser()
useUpdateUser()
useDeleteUser()
```

---

# 16. Query Keys

```ts
export const queryKeys = {
  authMe: ["auth", "me"],

  dashboardSummary: ["dashboard", "summary"],
  dashboardRecentMovements: ["dashboard", "recent-movements"],

  products: (params) => ["products", params],
  product: (id) => ["products", id],

  categories: (params) => ["categories", params],
  suppliers: (params) => ["suppliers", params],

  stockOverview: (params) => ["inventory", "stock-overview", params],
  movements: (params) => ["inventory", "movements", params],
  lowStock: (params) => ["inventory", "low-stock", params],

  users: (params) => ["users", params],
  auditLogs: (params) => ["audit-logs", params],
};
```

---

# 17. Frontend State Requirements

Mỗi page table/form cần đủ state:

```text
Loading
Empty
No search result
Error
Success
Validation error
Permission denied
Submitting
```

## Loading state

```text
- Table skeleton
- Card skeleton
- Button spinner
```

## Empty state

```text
- Icon minh họa
- Title
- Description
- CTA nếu phù hợp
```

Ví dụ Products:

```text
Chưa có sản phẩm nào
Thêm sản phẩm đầu tiên để bắt đầu quản lý kho
Button: Thêm sản phẩm
```

## Error state

```text
Không thể tải dữ liệu
Button: Thử lại
```

---

# 18. UI Behavior Rules

## 18.1. Products

```text
Staff:
- Không thấy nút Thêm sản phẩm
- Không thấy nút Chỉnh sửa
- Không thấy nút Ẩn sản phẩm

Admin:
- Thấy đầy đủ action
```

## 18.2. Export Stock

```text
Nếu quantity > currentStock:
- hiện input error
- hiện warning card
- disable submit button
```

## 18.3. Edit Product

```text
Không cho sửa currentStock trực tiếp.
Hiện note: Tồn kho được thay đổi qua nhập/xuất/điều chỉnh kho.
```

## 18.4. Delete actions

Không dùng từ “Xóa” nếu thực chất là soft delete. Nên dùng:

```text
Ẩn sản phẩm
Ẩn danh mục
Ẩn nhà cung cấp
Khóa tài khoản
```

## 18.5. Success toast

```text
Tạo sản phẩm thành công
Cập nhật thành công
Nhập kho thành công
Xuất kho thành công
Điều chỉnh kho thành công
```

---

# 19. Formatting Utilities

## Currency

```ts
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}
```

## Date time

```ts
export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
```

## Stock status label

```ts
export function getStockStatusLabel(status: StockStatus) {
  const map = {
    in_stock: "Còn hàng",
    low_stock: "Sắp hết",
    out_of_stock: "Hết hàng",
  };

  return map[status];
}
```

---

# 20. Responsive Spec

## Desktop

```text
Sidebar cố định bên trái
Content max width full
Table hiển thị đầy đủ cột
Filter nằm ngang
```

## Tablet

```text
Sidebar thu gọn
Filter wrap xuống nhiều dòng
Table scroll ngang
```

## Mobile

```text
Sidebar thành drawer
Topbar gọn
Table chuyển sang horizontal scroll hoặc card list
Form 1 cột
Action menu gom vào nút ba chấm
```

---

# 21. Accessibility Basic

```text
Input có label rõ ràng
Button có trạng thái disabled/loading
Modal trap focus cơ bản
Màu badge có text label, không chỉ dựa vào màu
Error message nằm gần field lỗi
Icon-only button phải có aria-label
```

---

# 22. Frontend Development Order

## Step 1 — Setup

```text
- Init Next.js TypeScript
- Setup Tailwind CSS
- Setup env
- Setup API client
- Setup folder structure
```

## Step 2 — Auth

```text
- Login page
- useAuth
- token storage
- protected route layout
- redirect logic
```

## Step 3 — Layout

```text
- AppSidebar
- AppTopbar
- DashboardShell
- Role-based menu
- 403 / 404
```

## Step 4 — Master Data

```text
- Products List
- Product Form
- Product Detail
- Categories page
- Suppliers page
```

## Step 5 — Inventory

```text
- Stock Overview
- Import Stock
- Export Stock
- Stock Adjustment
- Movement History
- Low Stock Alerts
```

## Step 6 — Admin

```text
- Users List
- Create/Edit User
- Audit Logs
```

## Step 7 — Polish

```text
- Loading skeleton
- Empty states
- Error states
- Toast
- Confirm modals
- Responsive
```

---

# 23. Frontend Checklist

```text
[ ] Login page hoạt động
[ ] Token được lưu sau login
[ ] Logout xóa token
[ ] Protected route redirect đúng
[ ] Role-based sidebar đúng
[ ] Staff không thấy admin menu
[ ] Staff không vào được admin route
[ ] Dashboard hiển thị KPI
[ ] Products List có search/filter/pagination
[ ] Product create/edit validate đúng
[ ] Product detail có recent movements
[ ] Categories modal hoạt động
[ ] Suppliers modal hoạt động
[ ] Import stock tính stockAfter đúng
[ ] Export stock chặn quantity > currentStock
[ ] Adjustment chỉ admin
[ ] Movement history filter được
[ ] Low-stock alerts hiển thị đúng badge
[ ] Users management chỉ admin
[ ] Audit logs chỉ admin
[ ] Toast success/error hoạt động
[ ] Loading/empty/error states đầy đủ
[ ] UI responsive cơ bản
```

# 24. Chốt Frontend Spec

Frontend nên được xây theo hướng:

```text
Next.js App Router
+ TypeScript
+ Tailwind CSS
+ React Hook Form
+ Zod
+ Recharts
+ REST API client
+ Role-based layout
```

Điểm quan trọng nhất khi làm frontend là **không chỉ ẩn nút theo role**, mà phải xử lý route guard rõ ràng: staff không thấy nút admin, không vào được route admin, và mọi lỗi 401/403 từ backend phải được hiển thị hoặc redirect đúng.

