Dưới đây là **Backend Specification** chi tiết cho dự án **Inventory Management System** bản sinh viên, theo scope đã chốt: **8 bảng database**, **2 role `admin/staff`**, nghiệp vụ chính gồm quản lý sản phẩm, danh mục, nhà cung cấp, nhập kho, xuất kho, điều chỉnh kho, lịch sử tồn kho, dashboard và audit log. Phần quan trọng nhất của backend là xử lý nhập/xuất kho bằng transaction để tránh lệch tồn kho, đúng với định hướng dự án ban đầu.

# 1. Backend Overview

## 1.1. Mục tiêu backend

Backend chịu trách nhiệm:

```text
- Xác thực đăng nhập
- Phân quyền admin/staff
- Cung cấp REST API cho frontend
- Validate dữ liệu đầu vào
- Quản lý users, categories, suppliers, products
- Xử lý nhập kho, xuất kho, điều chỉnh kho
- Đảm bảo không xuất âm tồn kho
- Ghi lịch sử tồn kho vào stock_movements
- Ghi nhật ký thao tác vào audit_logs
- Cung cấp dữ liệu dashboard
```

## 1.2. Tech stack backend

```text
Runtime: Node.js
Language: TypeScript
Framework: Express.js
Database: PostgreSQL
ORM: Prisma
Validation: Zod
Authentication: JWT
Password Hashing: bcrypt hoặc argon2
Testing: Vitest/Jest + Supertest
```

Khuyến nghị dùng:

```text
Node.js + Express + TypeScript + Prisma + PostgreSQL
```

---

# 2. Backend Architecture

## 2.1. Kiến trúc tổng thể

```text
Request
  ↓
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository / Prisma
  ↓
Database
```

## 2.2. Vai trò từng layer

| Layer          | Vai trò                                     |
| -------------- | ------------------------------------------- |
| `routes`       | Khai báo endpoint                           |
| `middlewares`  | Auth, role check, validation, error handler |
| `controllers`  | Nhận request, gọi service, trả response     |
| `services`     | Xử lý business logic                        |
| `repositories` | Giao tiếp database                          |
| `schemas`      | Validate request body/query/params          |
| `utils`        | Hàm dùng chung                              |
| `errors`       | Custom error class                          |

## 2.3. Nguyên tắc

```text
Controller không xử lý business logic phức tạp.
Service là nơi xử lý nghiệp vụ chính.
Repository chỉ thao tác database.
Mọi input từ client phải validate.
Mọi endpoint cần đăng nhập phải đi qua auth middleware.
Endpoint admin-only phải đi qua role middleware.
Nhập/xuất/điều chỉnh kho phải chạy trong transaction.
```

---

# 3. Database Scope

Backend làm việc với 8 bảng:

```text
1. users
2. categories
3. suppliers
4. products
5. stock_imports
6. stock_exports
7. stock_movements
8. audit_logs
```

## 3.1. Quan hệ chính

```text
users 1-n products
users 1-n stock_imports
users 1-n stock_exports
users 1-n stock_movements
users 1-n audit_logs

categories 1-n products
suppliers 1-n products
suppliers 1-n stock_imports

products 1-n stock_imports
products 1-n stock_exports
products 1-n stock_movements
```

---

# 4. Folder Structure Backend

```text
apps/api/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── cors.ts
│   │   └── prisma.ts
│   │
│   ├── common/
│   │   ├── constants/
│   │   │   ├── roles.ts
│   │   │   ├── stock.ts
│   │   │   ├── audit-actions.ts
│   │   │   └── messages.ts
│   │   │
│   │   ├── errors/
│   │   │   ├── AppError.ts
│   │   │   ├── BadRequestError.ts
│   │   │   ├── UnauthorizedError.ts
│   │   │   ├── ForbiddenError.ts
│   │   │   └── NotFoundError.ts
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── role.middleware.ts
│   │   │   ├── validate.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── not-found.middleware.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── hash.ts
│   │   │   ├── response.ts
│   │   │   ├── pagination.ts
│   │   │   ├── stock-status.ts
│   │   │   └── async-handler.ts
│   │   │
│   │   └── types/
│   │       ├── express.d.ts
│   │       ├── auth.type.ts
│   │       └── pagination.type.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.schema.ts
│   │   │   └── auth.types.ts
│   │   │
│   │   ├── users/
│   │   │   ├── user.routes.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── user.schema.ts
│   │   │   └── user.types.ts
│   │   │
│   │   ├── categories/
│   │   │   ├── category.routes.ts
│   │   │   ├── category.controller.ts
│   │   │   ├── category.service.ts
│   │   │   ├── category.repository.ts
│   │   │   └── category.schema.ts
│   │   │
│   │   ├── suppliers/
│   │   │   ├── supplier.routes.ts
│   │   │   ├── supplier.controller.ts
│   │   │   ├── supplier.service.ts
│   │   │   ├── supplier.repository.ts
│   │   │   └── supplier.schema.ts
│   │   │
│   │   ├── products/
│   │   │   ├── product.routes.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   ├── product.repository.ts
│   │   │   ├── product.schema.ts
│   │   │   └── product.types.ts
│   │   │
│   │   ├── inventory/
│   │   │   ├── inventory.routes.ts
│   │   │   ├── inventory.controller.ts
│   │   │   ├── inventory.service.ts
│   │   │   ├── inventory.repository.ts
│   │   │   ├── inventory.schema.ts
│   │   │   └── inventory.types.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── dashboard.routes.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── dashboard.repository.ts
│   │   │
│   │   └── audit-logs/
│   │       ├── audit-log.routes.ts
│   │       ├── audit-log.controller.ts
│   │       ├── audit-log.service.ts
│   │       └── audit-log.repository.ts
│   │
│   └── routes/
│       └── index.ts
│
├── tests/
│   ├── auth.test.ts
│   ├── product.test.ts
│   └── inventory.test.ts
│
├── .env.example
├── package.json
└── tsconfig.json
```

---

# 5. Environment Variables

```env
PORT=4000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory_db"

JWT_SECRET="change_me_to_a_long_secret"
JWT_EXPIRES_IN="1d"

CORS_ORIGIN="http://localhost:3000"
```

---

# 6. API Response Standard

## 6.1. Success response

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

## 6.2. List response

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 100,
      "totalPages": 10
    }
  }
}
```

## 6.3. Error response

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email không hợp lệ"
    }
  ]
}
```

## 6.4. HTTP status convention

| Status | Ý nghĩa            |
| -----: | ------------------ |
|  `200` | Thành công         |
|  `201` | Tạo mới thành công |
|  `400` | Request sai        |
|  `401` | Chưa đăng nhập     |
|  `403` | Không có quyền     |
|  `404` | Không tìm thấy     |
|  `409` | Dữ liệu bị trùng   |
|  `422` | Validation error   |
|  `500` | Server error       |

---

# 7. Authentication Spec

## 7.1. Auth flow

```text
1. User gửi email/password.
2. Backend tìm user theo email.
3. Nếu user không tồn tại, trả lỗi chung.
4. Nếu user bị khóa, trả lỗi tài khoản không hoạt động.
5. So sánh password với password_hash.
6. Nếu đúng, tạo JWT.
7. Ghi audit log LOGIN.
8. Trả token + user info.
```

## 7.2. JWT payload

```json
{
  "sub": 1,
  "email": "admin@example.com",
  "role": "admin"
}
```

## 7.3. Auth middleware

Header:

```http
Authorization: Bearer <token>
```

Middleware cần làm:

```text
- Kiểm tra có token hay không
- Verify token
- Lấy user trong database
- Kiểm tra user còn active
- Gán req.user
```

## 7.4. Role middleware

Dùng cho endpoint admin-only.

```ts
requireRole("admin")
```

Logic:

```text
Nếu req.user.role không nằm trong danh sách role cho phép
=> throw ForbiddenError
```

---

# 8. Permission Matrix

| Module               | Admin | Staff |
| -------------------- | ----: | ----: |
| Login                |    Có |    Có |
| Dashboard            |    Có |    Có |
| Xem sản phẩm         |    Có |    Có |
| Tạo sản phẩm         |    Có | Không |
| Sửa sản phẩm         |    Có | Không |
| Ẩn sản phẩm          |    Có | Không |
| Xem danh mục         |    Có |    Có |
| Tạo/sửa danh mục     |    Có | Không |
| Xem nhà cung cấp     |    Có |    Có |
| Tạo/sửa nhà cung cấp |    Có | Không |
| Nhập kho             |    Có |    Có |
| Xuất kho             |    Có |    Có |
| Điều chỉnh kho       |    Có | Không |
| Xem lịch sử kho      |    Có |    Có |
| Cảnh báo tồn kho     |    Có |    Có |
| Quản lý user         |    Có | Không |
| Audit logs           |    Có | Không |

---

# 9. Module Specs

# 9.1. Auth Module

## Routes

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## `POST /api/auth/login`

### Body

```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

### Validation

```text
email required, valid email
password required
```

### Success response

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": 1,
      "fullName": "Admin Demo",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

### Error cases

| Case               | Status | Message                        |
| ------------------ | -----: | ------------------------------ |
| Email/password sai |  `401` | Email hoặc mật khẩu không đúng |
| User inactive      |  `403` | Tài khoản đã bị khóa           |
| Validation error   |  `422` | Dữ liệu không hợp lệ           |

---

## `GET /api/auth/me`

### Header

```http
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "Admin Demo",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true
  }
}
```

---

# 9.2. Users Module

Admin-only.

## Routes

```text
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

## `GET /api/users`

### Query

```text
search
role
isActive
page
limit
```

Example:

```text
GET /api/users?search=nguyen&role=staff&isActive=true&page=1&limit=10
```

### Response item

```json
{
  "id": 1,
  "fullName": "Nguyễn Văn A",
  "email": "admin@example.com",
  "role": "admin",
  "isActive": true,
  "createdAt": "2026-05-11T10:00:00.000Z"
}
```

## `POST /api/users`

### Body

```json
{
  "fullName": "Nguyễn Văn B",
  "email": "staff@example.com",
  "password": "123456",
  "role": "staff",
  "isActive": true
}
```

### Business rules

```text
email không được trùng
password phải được hash trước khi lưu
role chỉ được là admin hoặc staff
ghi audit_logs CREATE_USER
```

## `DELETE /api/users/:id`

Không hard-delete. Chỉ khóa tài khoản:

```text
is_active = false
```

---

# 9.3. Categories Module

## Routes

```text
GET    /api/categories
POST   /api/categories
GET    /api/categories/:id
PUT    /api/categories/:id
DELETE /api/categories/:id
```

## Access

```text
GET: admin/staff
POST/PUT/DELETE: admin only
```

## `POST /api/categories`

### Body

```json
{
  "name": "Bàn phím",
  "description": "Các loại bàn phím máy tính",
  "isActive": true
}
```

### Business rules

```text
name không được rỗng
name không được trùng
ghi audit_logs CREATE_CATEGORY
```

## `DELETE /api/categories/:id`

Không xóa thật. Set:

```text
is_active = false
```

Nếu category có product, vẫn cho ẩn nhưng không xóa dữ liệu.

---

# 9.4. Suppliers Module

## Routes

```text
GET    /api/suppliers
POST   /api/suppliers
GET    /api/suppliers/:id
PUT    /api/suppliers/:id
DELETE /api/suppliers/:id
```

## Access

```text
GET: admin/staff
POST/PUT/DELETE: admin only
```

## `POST /api/suppliers`

### Body

```json
{
  "name": "Công ty TNHH TechWorld",
  "phone": "0901234567",
  "email": "info@techworld.vn",
  "address": "TP. Hồ Chí Minh",
  "isActive": true
}
```

### Business rules

```text
name bắt buộc
email nếu có thì phải đúng định dạng
ghi audit_logs CREATE_SUPPLIER
```

---

# 9.5. Products Module

## Routes

```text
GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

## Access

```text
GET: admin/staff
POST/PUT/DELETE: admin only
```

## `GET /api/products`

### Query

```text
search
categoryId
supplierId
stockStatus
isActive
page
limit
```

Example:

```text
GET /api/products?search=keyboard&categoryId=1&stockStatus=low_stock&page=1&limit=10
```

### `stockStatus` values

```text
in_stock
low_stock
out_of_stock
```

### Response item

```json
{
  "id": 1,
  "sku": "KB-EK87",
  "name": "Bàn phím cơ DareU EK87",
  "category": {
    "id": 1,
    "name": "Bàn phím"
  },
  "supplier": {
    "id": 1,
    "name": "TechWorld"
  },
  "unit": "cái",
  "costPrice": 900000,
  "sellingPrice": 1590000,
  "currentStock": 5,
  "minStock": 10,
  "stockStatus": "low_stock",
  "isActive": true
}
```

## `POST /api/products`

### Body

```json
{
  "categoryId": 1,
  "supplierId": 1,
  "sku": "KB-EK87",
  "name": "Bàn phím cơ DareU EK87",
  "description": "Bàn phím cơ gaming",
  "unit": "cái",
  "costPrice": 900000,
  "sellingPrice": 1590000,
  "currentStock": 10,
  "minStock": 5,
  "imageUrl": "https://example.com/image.jpg",
  "isActive": true
}
```

### Business rules

```text
sku unique
categoryId phải tồn tại
supplierId nếu có phải tồn tại
costPrice >= 0
sellingPrice >= 0
currentStock >= 0
minStock >= 0
ghi audit_logs CREATE_PRODUCT
```

## `PUT /api/products/:id`

Không nên sửa tồn kho bằng endpoint này trừ khi tạo sản phẩm ban đầu.

Các field cho phép sửa:

```text
categoryId
supplierId
sku
name
description
unit
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

Tồn kho phải thay đổi qua:

```text
POST /api/inventory/import
POST /api/inventory/export
POST /api/inventory/adjust
```

## `DELETE /api/products/:id`

Không hard-delete. Set:

```text
is_active = false
```

Ghi audit:

```text
DELETE_PRODUCT
```

---

# 9.6. Inventory Module

## Routes

```text
GET  /api/inventory/stock-overview
POST /api/inventory/import
POST /api/inventory/export
POST /api/inventory/adjust
GET  /api/inventory/movements
GET  /api/inventory/low-stock
```

---

## `GET /api/inventory/stock-overview`

### Access

```text
admin/staff
```

### Query

```text
search
categoryId
stockStatus
page
limit
```

### Response item

```json
{
  "productId": 1,
  "sku": "KB-EK87",
  "name": "Bàn phím cơ DareU EK87",
  "categoryName": "Bàn phím",
  "currentStock": 5,
  "minStock": 10,
  "unit": "cái",
  "stockStatus": "low_stock"
}
```

---

## `POST /api/inventory/import`

### Access

```text
admin/staff
```

### Body

```json
{
  "productId": 1,
  "supplierId": 1,
  "quantity": 50,
  "importPrice": 900000,
  "note": "Nhập hàng đợt 1"
}
```

### Validation

```text
productId required
supplierId optional
quantity required, > 0
importPrice required, >= 0
note optional
```

### Transaction logic

```text
1. Lấy product hiện tại.
2. Nếu product không tồn tại hoặc inactive => lỗi.
3. stock_before = product.current_stock.
4. stock_after = stock_before + quantity.
5. total_amount = quantity * import_price.
6. Tạo stock_imports.
7. Update products.current_stock = stock_after.
8. Tạo stock_movements:
   type = import
   quantity_change = +quantity
   stock_before
   stock_after
   reference_type = stock_import
   reference_id = stock_imports.id
9. Tạo audit_logs IMPORT_STOCK.
10. Commit transaction.
```

### Success response

```json
{
  "success": true,
  "message": "Nhập kho thành công",
  "data": {
    "id": 1,
    "productId": 1,
    "quantity": 50,
    "stockBefore": 10,
    "stockAfter": 60
  }
}
```

---

## `POST /api/inventory/export`

### Access

```text
admin/staff
```

### Body

```json
{
  "productId": 1,
  "quantity": 5,
  "exportPrice": 1590000,
  "note": "Xuất hàng cho khách"
}
```

### Validation

```text
productId required
quantity required, > 0
exportPrice required, >= 0
note optional
```

### Transaction logic

```text
1. Lấy product hiện tại.
2. Nếu product không tồn tại hoặc inactive => lỗi.
3. Kiểm tra current_stock >= quantity.
4. Nếu không đủ tồn kho => lỗi.
5. stock_before = product.current_stock.
6. stock_after = stock_before - quantity.
7. total_amount = quantity * export_price.
8. Tạo stock_exports.
9. Update products.current_stock = stock_after.
10. Tạo stock_movements:
    type = export
    quantity_change = -quantity
    stock_before
    stock_after
    reference_type = stock_export
    reference_id = stock_exports.id
11. Tạo audit_logs EXPORT_STOCK.
12. Commit transaction.
```

### Error case

```json
{
  "success": false,
  "message": "Không đủ tồn kho"
}
```

---

## `POST /api/inventory/adjust`

### Access

```text
admin only
```

### Body

```json
{
  "productId": 1,
  "adjustmentType": "decrease",
  "quantity": 2,
  "note": "Kiểm kê thiếu 2 sản phẩm"
}
```

### `adjustmentType`

```text
increase
decrease
```

### Transaction logic

```text
1. Lấy product.
2. stock_before = current_stock.
3. Nếu increase => quantity_change = +quantity.
4. Nếu decrease => quantity_change = -quantity.
5. stock_after = stock_before + quantity_change.
6. Nếu stock_after < 0 => lỗi.
7. Update products.current_stock = stock_after.
8. Tạo stock_movements:
   type = adjustment
   reference_type = manual
9. Tạo audit_logs ADJUST_STOCK.
```

---

## `GET /api/inventory/movements`

### Access

```text
admin/staff
```

### Query

```text
search
productId
type
userId
from
to
page
limit
```

### Response item

```json
{
  "id": 1,
  "type": "import",
  "quantityChange": 50,
  "stockBefore": 10,
  "stockAfter": 60,
  "note": "Nhập hàng đợt 1",
  "createdAt": "2026-05-11T10:00:00.000Z",
  "product": {
    "id": 1,
    "sku": "KB-EK87",
    "name": "Bàn phím cơ DareU EK87"
  },
  "createdBy": {
    "id": 1,
    "fullName": "Admin Demo"
  }
}
```

---

## `GET /api/inventory/low-stock`

### Access

```text
admin/staff
```

### Logic

Trả về sản phẩm:

```text
current_stock <= min_stock
```

Có thể chia:

```text
out_of_stock: current_stock = 0
low_stock: current_stock > 0 AND current_stock <= min_stock
```

---

# 9.7. Dashboard Module

## Routes

```text
GET /api/dashboard/summary
GET /api/dashboard/recent-movements
GET /api/dashboard/import-export-chart
GET /api/dashboard/category-chart
```

## `GET /api/dashboard/summary`

### Access

```text
admin/staff
```

### Response

```json
{
  "success": true,
  "data": {
    "totalProducts": 124,
    "lowStockCount": 12,
    "outOfStockCount": 3,
    "todayImportCount": 50,
    "todayExportCount": 18,
    "inventoryValue": 124500000
  }
}
```

## Summary calculations

```text
totalProducts:
COUNT products WHERE is_active = true

lowStockCount:
COUNT products WHERE current_stock > 0 AND current_stock <= min_stock

outOfStockCount:
COUNT products WHERE current_stock = 0

todayImportCount:
SUM stock_imports.quantity WHERE created_at is today

todayExportCount:
SUM stock_exports.quantity WHERE created_at is today

inventoryValue:
SUM products.current_stock * products.cost_price
```

---

# 9.8. Audit Logs Module

## Routes

```text
GET /api/audit-logs
GET /api/audit-logs/:id
```

## Access

```text
admin only
```

## Query

```text
search
action
userId
from
to
page
limit
```

## Response item

```json
{
  "id": 1,
  "action": "IMPORT_STOCK",
  "tableName": "stock_imports",
  "recordId": 1,
  "description": "Nhập 50 sản phẩm Bàn phím cơ DareU EK87",
  "createdAt": "2026-05-11T10:00:00.000Z",
  "user": {
    "id": 1,
    "fullName": "Admin Demo"
  }
}
```

---

# 10. Validation Schemas

## Auth login

```ts
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
```

## Create product

```ts
const createProductSchema = z.object({
  categoryId: z.number().int().positive(),
  supplierId: z.number().int().positive().optional(),
  sku: z.string().min(1).max(80),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  unit: z.string().min(1).default("cái"),
  costPrice: z.number().int().min(0),
  sellingPrice: z.number().int().min(0),
  currentStock: z.number().int().min(0).default(0),
  minStock: z.number().int().min(0).default(0),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
});
```

## Import stock

```ts
const importStockSchema = z.object({
  productId: z.number().int().positive(),
  supplierId: z.number().int().positive().optional(),
  quantity: z.number().int().positive(),
  importPrice: z.number().int().min(0),
  note: z.string().optional(),
});
```

## Export stock

```ts
const exportStockSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  exportPrice: z.number().int().min(0),
  note: z.string().optional(),
});
```

## Adjust stock

```ts
const adjustStockSchema = z.object({
  productId: z.number().int().positive(),
  adjustmentType: z.enum(["increase", "decrease"]),
  quantity: z.number().int().positive(),
  note: z.string().min(1),
});
```

---

# 11. Common Utilities

## `stock-status.ts`

```ts
export function getStockStatus(currentStock: number, minStock: number) {
  if (currentStock === 0) return "out_of_stock";
  if (currentStock <= minStock) return "low_stock";
  return "in_stock";
}
```

## `pagination.ts`

```ts
export function getPagination(page = 1, limit = 10) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
}
```

## `response.ts`

```ts
export function successResponse(res, data, message = "OK", status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}
```

---

# 12. Error Handling

## `AppError`

```ts
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

## Error middleware behavior

```text
Nếu lỗi là AppError:
- trả statusCode tương ứng
- trả message rõ ràng

Nếu lỗi là ZodError:
- trả 422
- trả danh sách field errors

Nếu lỗi không xác định:
- trả 500
- message: Internal server error
```

---

# 13. Audit Log Rules

Backend nên ghi audit log cho các thao tác:

```text
LOGIN
LOGOUT
CREATE_USER
UPDATE_USER
LOCK_USER
CREATE_CATEGORY
UPDATE_CATEGORY
DELETE_CATEGORY
CREATE_SUPPLIER
UPDATE_SUPPLIER
DELETE_SUPPLIER
CREATE_PRODUCT
UPDATE_PRODUCT
DELETE_PRODUCT
IMPORT_STOCK
EXPORT_STOCK
ADJUST_STOCK
```

Không nhất thiết ghi audit log cho:

```text
GET list
GET detail
Dashboard query
Search/filter
```

---

# 14. Important Business Constraints

## 14.1. Không xuất âm kho

Backend phải chặn:

```text
quantity > product.current_stock
```

Không được chỉ kiểm tra ở frontend.

## 14.2. Không sửa tồn kho trực tiếp

Endpoint update product không nên nhận field:

```text
currentStock
```

Nếu cần sửa tồn kho, dùng:

```text
POST /api/inventory/adjust
```

## 14.3. Giao dịch kho phải có lịch sử

Mọi nhập/xuất/điều chỉnh đều phải tạo dòng trong:

```text
stock_movements
```

## 14.4. Nhập/xuất phải dùng transaction

Các thao tác sau phải cùng thành công hoặc cùng thất bại:

```text
stock_imports/stock_exports
update products.current_stock
stock_movements
audit_logs
```

---

# 15. Testing Spec

## Unit test

```text
- getStockStatus()
- pagination helper
- auth password compare
- inventory calculation
```

## Integration test

```text
Auth:
- login đúng
- login sai
- inactive user không login được

Product:
- tạo product thành công
- SKU trùng bị lỗi
- staff không được tạo product

Inventory:
- nhập kho tăng current_stock
- xuất kho giảm current_stock
- xuất quá tồn kho bị lỗi
- điều chỉnh kho chỉ admin
- mỗi giao dịch tạo stock_movements
```

## Example test cases

| Test case                   | Expected               |
| --------------------------- | ---------------------- |
| Import 50 khi tồn 10        | stock sau = 60         |
| Export 5 khi tồn 10         | stock sau = 5          |
| Export 20 khi tồn 10        | lỗi `Không đủ tồn kho` |
| Staff gọi adjust stock      | lỗi `403 Forbidden`    |
| Admin tạo product SKU trùng | lỗi `409 Conflict`     |

---

# 16. Seed Data Spec

## Users

```text
admin@example.com / 123456 / admin
staff@example.com / 123456 / staff
```

## Categories

```text
Bàn phím
Chuột máy tính
Màn hình
RAM
Ổ cứng SSD
Thiết bị mạng
```

## Suppliers

```text
Công ty TNHH TechWorld
Công ty CP GearTech
Siêu Thị Máy Tính Hà Nội
```

## Products

```text
Bàn phím cơ DareU EK87
Chuột Logitech MX Master 3S
RAM Kingston 16GB DDR4
Ổ cứng SSD Samsung 1TB
Màn hình LG 27 inch
```

---

# 17. Backend Development Order

## Step 1 — Project setup

```text
- Init Express + TypeScript
- Setup Prisma
- Setup PostgreSQL
- Setup env
- Setup error handler
- Setup response format
```

## Step 2 — Database

```text
- Viết schema.prisma
- Chạy migration
- Viết seed data
```

## Step 3 — Auth

```text
- Login API
- Hash password
- JWT helper
- Auth middleware
- Role middleware
```

## Step 4 — Master data

```text
- Users API
- Categories API
- Suppliers API
- Products API
```

## Step 5 — Inventory

```text
- Import stock
- Export stock
- Adjust stock
- Movement history
- Low-stock alerts
```

## Step 6 — Dashboard + audit

```text
- Dashboard summary
- Dashboard charts data
- Audit logs list/detail
```

## Step 7 — Testing + polish

```text
- Integration test cho auth/product/inventory
- Improve error message
- Validate edge cases
- Final seed data
```

---

# 18. Final Backend Checklist

```text
[ ] API chạy được tại /api
[ ] Login trả JWT
[ ] Auth middleware hoạt động
[ ] Role middleware hoạt động
[ ] Admin/staff phân quyền đúng
[ ] CRUD users
[ ] CRUD categories
[ ] CRUD suppliers
[ ] CRUD products
[ ] Không cho SKU trùng
[ ] Import stock update đúng current_stock
[ ] Export stock không cho âm kho
[ ] Adjust stock chỉ admin
[ ] Mọi giao dịch kho tạo stock_movements
[ ] Mọi thao tác quan trọng tạo audit_logs
[ ] Dashboard summary trả đúng số liệu
[ ] Low-stock API hoạt động
[ ] Pagination/search/filter hoạt động
[ ] Error response thống nhất
[ ] Seed data có admin/staff
```

Chốt backend nên tập trung nhiều nhất vào **Inventory Service**. Đây là phần lõi: nhập kho, xuất kho, điều chỉnh kho, cập nhật `products.current_stock`, ghi `stock_movements`, và chạy toàn bộ trong transaction.
