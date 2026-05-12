# API Reference

Base URL: `http://localhost:4000/api`

## Authentication

All endpoints except login require a Bearer token.

```
Authorization: Bearer <token>
```

Get a token:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'
```

## Response Format

### Success

```json
{
  "success": true,
  "message": "Thành công",
  "data": { ... }
}
```

### Error

```json
{
  "success": false,
  "message": "Email đã tồn tại"
}
```

### Validation Error

```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    { "field": "email", "message": "Email không hợp lệ" }
  ]
}
```

## Pagination

Query params: `?page=1&limit=10`

Response:

```json
{
  "items": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 42,
    "totalPages": 5
  }
}
```

## Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (invalid data, duplicate) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not found |
| 422 | Validation error |

---

## Auth

### POST /api/auth/login

Authenticate with email and password.

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "123456"
}
```

**Response 200:**

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "eyJhbG...",
    "user": {
      "id": 1,
      "fullName": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

**401:** Invalid email or password.

---

### GET /api/auth/me

Get the authenticated user's profile.

```
GET /api/auth/me
Authorization: Bearer <token>
```

**Response 200:** User object with id, fullName, email, role, createdAt.

**401:** Missing or expired token.

---

## Users (Admin only)

All endpoints require `Authorization: Bearer <admin_token>`.

### GET /api/users

List users with pagination and filters.

Query params: `search`, `role` (admin/staff), `isActive` (true/false), `page`, `limit`.

### POST /api/users

Create a new user.

```json
{
  "fullName": "Staff User",
  "email": "staff@example.com",
  "password": "123456",
  "role": "staff"
}
```

**201:** Returns created user. **400:** Email already exists. **422:** Validation error.

### GET /api/users/:id

Get user details.

**200:** Returns user. **404:** Not found.

### PUT /api/users/:id

Update user fields.

```json
{
  "fullName": "Updated Name",
  "role": "admin"
}
```

**200:** Returns updated user.

### DELETE /api/users/:id

Deactivate user (soft-delete, sets `isActive = false`).

**200:** User deactivated.

---

## Categories

Read endpoints require auth. Write endpoints require admin.

### GET /api/categories

List all active categories.

**200:** Array of categories.

### GET /api/categories/:id

**200:** Category object. **404:** Not found.

### POST /api/categories (admin)

```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

**201:** Created. **400:** Name already exists.

### PUT /api/categories/:id (admin)

Update name, description, or isActive.

### DELETE /api/categories/:id (admin)

Deactivate category.

---

## Suppliers

Read endpoints require auth. Write endpoints require admin.

### GET /api/suppliers

List all active suppliers.

### GET /api/suppliers/:id

### POST /api/suppliers (admin)

```json
{
  "name": "Tech Corp",
  "phone": "0123456789",
  "email": "contact@techcorp.com",
  "address": "123 Main Street"
}
```

### PUT /api/suppliers/:id (admin)

### DELETE /api/suppliers/:id (admin)

Deactivate supplier.

---

## Products

Read endpoints require auth. Write endpoints require admin.

### GET /api/products

List products with pagination and filters.

Query params: `search` (name/SKU), `categoryId`, `supplierId`, `stockStatus` (in_stock/low_stock/out_of_stock), `isActive`, `page`, `limit`.

**200:** Paginated products with nested category and supplier.

### GET /api/products/:id

**200:** Product with category, supplier, stockStatus.

### POST /api/products (admin)

```json
{
  "categoryId": 1,
  "supplierId": 1,
  "sku": "ELEC-001",
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "unit": "cái",
  "costPrice": 150000,
  "sellingPrice": 250000,
  "currentStock": 50,
  "minStock": 10
}
```

**201:** Created. **400:** SKU already exists.

### PUT /api/products/:id (admin)

Update product fields. Does **not** accept `currentStock` — use inventory endpoints instead.

### DELETE /api/products/:id (admin)

Deactivate product.

---

## Inventory

All endpoints require auth. Adjust requires admin.

### GET /api/inventory/stock-overview

Paginated stock overview with product name, SKU, category, stock level, and status.

Query params: `search`, `categoryId`, `stockStatus`, `page`, `limit`.

### GET /api/inventory/movements

Paginated stock movement history.

Query params: `productId`, `type` (import/export/adjustment), `userId`, `from` (date), `to` (date), `page`, `limit`.

### GET /api/inventory/low-stock

Products where `currentStock <= minStock`.

**200:** Array of products with low stock.

---

### POST /api/inventory/import

Import stock (increase quantity).

```json
{
  "productId": 1,
  "supplierId": 1,
  "quantity": 100,
  "importPrice": 150000,
  "note": "Monthly restock"
}
```

**201:**

```json
{
  "data": {
    "id": 1,
    "productId": 1,
    "quantity": 100,
    "stockBefore": 50,
    "stockAfter": 150
  }
}
```

**400:** Product not found or inactive.

---

### POST /api/inventory/export

Export stock (decrease quantity).

```json
{
  "productId": 1,
  "quantity": 30,
  "exportPrice": 250000,
  "note": "Customer order #123"
}
```

**201:** Same format as import.

**400:** Insufficient stock.

---

### POST /api/inventory/adjust (admin)

Manually adjust stock.

```json
{
  "productId": 1,
  "adjustmentType": "increase",
  "quantity": 20,
  "note": "Inventory count correction"
}
```

`adjustmentType`: `increase` or `decrease`.

**201:**

```json
{
  "data": {
    "productId": 1,
    "stockBefore": 150,
    "stockAfter": 170,
    "adjustmentType": "increase",
    "quantity": 20
  }
}
```

**403:** Staff role cannot adjust. **400:** Insufficient stock on decrease.

---

## Dashboard

All endpoints require auth.

### GET /api/dashboard/summary

**200:**

```json
{
  "data": {
    "totalProducts": 42,
    "lowStockCount": 3,
    "outOfStockCount": 1,
    "todayImportCount": 5,
    "todayExportCount": 12,
    "inventoryValue": 15000000
  }
}
```

### GET /api/dashboard/recent-movements

Last 10 stock movements.

**200:** Array of movements with product, user, type, quantity.

---

## Audit Logs (Admin only)

### GET /api/audit-logs

Paginated audit logs.

Query params: `search`, `action`, `userId`, `from` (date), `to` (date), `page`, `limit`.

**200:** Paginated logs with user info.

### GET /api/audit-logs/:id

**200:** Single audit log with user info.
