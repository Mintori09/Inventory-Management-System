import { http, HttpResponse, delay } from "msw";
import {
  products, categories, suppliers, movements, users, auditLogs,
  dashboardSummary, recentMovements, importExportChartData, categoryStockData,
  paginate, getId,
} from "./data";

const API = "http://localhost:4000/api";

export const handlers = [
  // ── Auth ──
  http.post(`${API}/auth/login`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { email: string; password: string };
    const user = users.find(u => u.email === body.email);
    if (!user || body.password !== "123456") {
      return HttpResponse.json({ success: false, message: "Email hoặc mật khẩu không đúng" }, { status: 401 });
    }
    if (!user.isActive) {
      return HttpResponse.json({ success: false, message: "Tài khoản đã bị vô hiệu hóa" }, { status: 403 });
    }
    return HttpResponse.json({
      success: true,
      data: {
        user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
        accessToken: "mock-token-" + user.id,
      },
    });
  }),

  // ── Products ──
  http.get(`${API}/products`, async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    const search = url.searchParams.get("search") || "";
    const categoryId = url.searchParams.get("categoryId");
    const stockStatus = url.searchParams.get("stockStatus");

    let filtered = products;
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
    if (categoryId) filtered = filtered.filter(p => p.category.id === Number(categoryId));
    if (stockStatus === "in_stock") filtered = filtered.filter(p => p.currentStock >= p.minStock);
    else if (stockStatus === "low_stock") filtered = filtered.filter(p => p.currentStock > 0 && p.currentStock < p.minStock);
    else if (stockStatus === "out_of_stock") filtered = filtered.filter(p => p.currentStock === 0);

    const result = paginate(filtered, page, limit);
    return HttpResponse.json({ success: true, data: result });
  }),

  http.get(`${API}/products/:id`, async ({ params }) => {
    await delay(150);
    const product = products.find(p => p.id === Number(params.id));
    if (!product) return HttpResponse.json({ success: false, message: "Không tìm thấy sản phẩm" }, { status: 404 });
    return HttpResponse.json({ success: true, data: product });
  }),

  http.post(`${API}/products`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, unknown>;
    const newId = Math.max(...products.map(p => p.id)) + 1;
    const cat = categories.find(c => c.id === Number(body.categoryId));
    const sup = suppliers.find(s => s.id === Number(body.supplierId));
    const product: Product = {
      id: newId,
      sku: body.sku as string,
      name: body.name as string,
      description: body.description as string || undefined,
      unit: body.unit as string,
      costPrice: Number(body.costPrice),
      sellingPrice: Number(body.sellingPrice),
      currentStock: Number(body.currentStock) || 0,
      minStock: Number(body.minStock),
      isActive: body.isActive as boolean,
      stockStatus: Number(body.currentStock) === 0 ? "out_of_stock" : "in_stock",
      category: { id: cat?.id || 0, name: cat?.name || "" },
      supplier: sup ? { id: sup.id, name: sup.name } : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.unshift(product);
    return HttpResponse.json({ success: true, data: product }, { status: 201 });
  }),

  http.put(`${API}/products/:id`, async ({ params, request }) => {
    await delay(300);
    const idx = products.findIndex(p => p.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ success: false, message: "Không tìm thấy sản phẩm" }, { status: 404 });
    const body = (await request.json()) as Record<string, unknown>;
    const cat = body.categoryId ? categories.find(c => c.id === Number(body.categoryId)) : undefined;
    const sup = body.supplierId ? suppliers.find(s => s.id === Number(body.supplierId)) : undefined;
    products[idx] = {
      ...products[idx],
      ...(body.name !== undefined && { name: body.name as string }),
      ...(body.description !== undefined && { description: body.description as string }),
      ...(body.unit !== undefined && { unit: body.unit as string }),
      ...(body.costPrice !== undefined && { costPrice: Number(body.costPrice) }),
      ...(body.sellingPrice !== undefined && { sellingPrice: Number(body.sellingPrice) }),
      ...(body.minStock !== undefined && { minStock: Number(body.minStock) }),
      ...(body.isActive !== undefined && { isActive: body.isActive as boolean }),
      ...(cat && { category: { id: cat.id, name: cat.name } }),
      ...(sup && { supplier: { id: sup.id, name: sup.name } }),
      stockStatus: products[idx].currentStock === 0 ? "out_of_stock" : "in_stock",
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, data: products[idx] });
  }),

  http.delete(`${API}/products/:id`, async ({ params }) => {
    await delay(200);
    const idx = products.findIndex(p => p.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ success: false, message: "Không tìm thấy sản phẩm" }, { status: 404 });
    products[idx] = { ...products[idx], isActive: false, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: null });
  }),

  // ── Categories ──
  http.get(`${API}/categories`, async () => {
    await delay(200);
    return HttpResponse.json({ success: true, data: { items: categories.filter(c => c.isActive), pagination: { totalItems: categories.length, page: 1, limit: 50, totalPages: 1 } } });
  }),

  http.post(`${API}/categories`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, unknown>;
    const newCat: Category = { id: Math.max(...categories.map(c => c.id)) + 1, name: body.name as string, description: body.description as string || undefined, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    categories.push(newCat);
    return HttpResponse.json({ success: true, data: newCat }, { status: 201 });
  }),

  http.put(`${API}/categories/:id`, async ({ params, request }) => {
    await delay(300);
    const idx = categories.findIndex(c => c.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ success: false, message: "Không tìm thấy danh mục" }, { status: 404 });
    const body = (await request.json()) as Record<string, unknown>;
    categories[idx] = { ...categories[idx], name: body.name as string, description: body.description as string | undefined, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: categories[idx] });
  }),

  http.delete(`${API}/categories/:id`, async ({ params }) => {
    await delay(200);
    const idx = categories.findIndex(c => c.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ success: false, message: "Không tìm thấy danh mục" }, { status: 404 });
    categories[idx] = { ...categories[idx], isActive: false, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: null });
  }),

  // ── Suppliers ──
  http.get(`${API}/suppliers`, async () => {
    await delay(200);
    return HttpResponse.json({ success: true, data: { items: suppliers.filter(s => s.isActive), pagination: { totalItems: suppliers.length, page: 1, limit: 50, totalPages: 1 } } });
  }),

  http.post(`${API}/suppliers`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, unknown>;
    const newSup: Supplier = { id: Math.max(...suppliers.map(s => s.id)) + 1, name: body.name as string, phone: body.phone as string || undefined, email: body.email as string || undefined, address: body.address as string || undefined, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    suppliers.push(newSup);
    return HttpResponse.json({ success: true, data: newSup }, { status: 201 });
  }),

  http.put(`${API}/suppliers/:id`, async ({ params, request }) => {
    await delay(300);
    const idx = suppliers.findIndex(s => s.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ success: false, message: "Không tìm thấy nhà cung cấp" }, { status: 404 });
    const body = (await request.json()) as Record<string, unknown>;
    suppliers[idx] = { ...suppliers[idx], name: body.name as string, phone: body.phone as string | undefined, email: body.email as string | undefined, address: body.address as string | undefined, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: suppliers[idx] });
  }),

  http.delete(`${API}/suppliers/:id`, async ({ params }) => {
    await delay(200);
    const idx = suppliers.findIndex(s => s.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ success: false, message: "Không tìm thấy nhà cung cấp" }, { status: 404 });
    suppliers[idx] = { ...suppliers[idx], isActive: false, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: null });
  }),

  // ── Inventory: Stock Overview ──
  http.get(`${API}/inventory/stock-overview`, async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const stockStatus = url.searchParams.get("stockStatus");
    let filtered = products;
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
    if (stockStatus === "in_stock") filtered = filtered.filter(p => p.currentStock >= p.minStock);
    else if (stockStatus === "low_stock") filtered = filtered.filter(p => p.currentStock > 0 && p.currentStock < p.minStock);
    else if (stockStatus === "out_of_stock") filtered = filtered.filter(p => p.currentStock === 0);
    const items = filtered.map(p => ({ id: p.id, sku: p.sku, name: p.name, category: p.category.name, currentStock: p.currentStock, minStock: p.minStock, unit: p.unit, stockStatus: (p.currentStock === 0 ? "out_of_stock" : p.currentStock < p.minStock ? "low_stock" : "in_stock") as "in_stock" | "low_stock" | "out_of_stock" }));
    return HttpResponse.json({ success: true, data: { items, pagination: { totalItems: items.length, page: 1, limit: 50, totalPages: 1 } } });
  }),

  // ── Inventory: Movements ──
  http.get(`${API}/inventory/movements`, async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    const search = url.searchParams.get("search") || "";
    const type = url.searchParams.get("type");
    let filtered = movements;
    if (search) filtered = filtered.filter(m => m.product.name.toLowerCase().includes(search.toLowerCase()));
    if (type) filtered = filtered.filter(m => m.type === type);
    const result = paginate(filtered, page, limit);
    return HttpResponse.json({ success: true, data: result });
  }),

  http.get(`${API}/inventory/movements/:id`, async ({ params }) => {
    await delay(150);
    const movement = movements.find(m => m.id === Number(params.id));
    if (!movement) return HttpResponse.json({ success: false, message: "Không tìm thấy" }, { status: 404 });
    return HttpResponse.json({ success: true, data: movement });
  }),

  // ── Inventory: Low Stock ──
  http.get(`${API}/inventory/low-stock`, async () => {
    await delay(200);
    const lowItems = products.filter(p => p.currentStock > 0 && p.currentStock < p.minStock);
    const outItems = products.filter(p => p.currentStock === 0);
    const items = [...lowItems, ...outItems].map(p => ({ id: p.id, sku: p.sku, name: p.name, category: p.category.name, currentStock: p.currentStock, minStock: p.minStock, unit: p.unit, stockStatus: (p.currentStock === 0 ? "out_of_stock" : "low_stock") as "low_stock" | "out_of_stock", shortage: p.minStock - p.currentStock }));
    return HttpResponse.json({
      success: true,
      data: { items, pagination: { totalItems: items.length, page: 1, limit: 50, totalPages: 1 }, summary: { total: items.length, lowStock: lowItems.length, outOfStock: outItems.length } },
    });
  }),

  // ── Inventory: Import ──
  http.post(`${API}/inventory/import`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { productId: number; quantity: number };
    const product = products.find(p => p.id === body.productId);
    if (!product) return HttpResponse.json({ success: false, message: "Không tìm thấy sản phẩm" }, { status: 404 });
    product.currentStock += body.quantity;
    product.stockStatus = product.currentStock === 0 ? "out_of_stock" : "in_stock";
    const mid = Math.max(...movements.map(m => m.id)) + 1;
    movements.unshift({ id: mid, type: "import", quantityChange: body.quantity, stockBefore: product.currentStock - body.quantity, stockAfter: product.currentStock, referenceId: mid, referenceType: "stock_import", createdAt: new Date().toISOString(), product: { id: product.id, sku: product.sku, name: product.name }, createdBy: { id: 1, fullName: "Admin" } });
    return HttpResponse.json({ success: true, data: product, message: "Nhập kho thành công" });
  }),

  // ── Inventory: Export ──
  http.post(`${API}/inventory/export`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { productId: number; quantity: number };
    const product = products.find(p => p.id === body.productId);
    if (!product) return HttpResponse.json({ success: false, message: "Không tìm thấy sản phẩm" }, { status: 404 });
    if (product.currentStock < body.quantity) return HttpResponse.json({ success: false, message: "Số lượng tồn không đủ" }, { status: 400 });
    product.currentStock -= body.quantity;
    product.stockStatus = product.currentStock === 0 ? "out_of_stock" : product.currentStock < product.minStock ? "low_stock" : "in_stock";
    const mid = Math.max(...movements.map(m => m.id)) + 1;
    movements.unshift({ id: mid, type: "export", quantityChange: -body.quantity, stockBefore: product.currentStock + body.quantity, stockAfter: product.currentStock, referenceType: "stock_export", createdAt: new Date().toISOString(), product: { id: product.id, sku: product.sku, name: product.name }, createdBy: { id: 1, fullName: "Admin" } });
    return HttpResponse.json({ success: true, data: product, message: "Xuất kho thành công" });
  }),

  // ── Inventory: Adjust ──
  http.post(`${API}/inventory/adjust`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { productId: number; adjustmentType: "increase" | "decrease"; quantity: number; note: string };
    const product = products.find(p => p.id === body.productId);
    if (!product) return HttpResponse.json({ success: false, message: "Không tìm thấy sản phẩm" }, { status: 404 });
    if (body.adjustmentType === "decrease" && product.currentStock < body.quantity) return HttpResponse.json({ success: false, message: "Số lượng tồn không đủ" }, { status: 400 });
    const oldStock = product.currentStock;
    product.currentStock += body.adjustmentType === "increase" ? body.quantity : -body.quantity;
    product.stockStatus = product.currentStock === 0 ? "out_of_stock" : product.currentStock < product.minStock ? "low_stock" : "in_stock";
    const mid = Math.max(...movements.map(m => m.id)) + 1;
    movements.unshift({ id: mid, type: "adjustment", quantityChange: body.adjustmentType === "increase" ? body.quantity : -body.quantity, stockBefore: oldStock, stockAfter: product.currentStock, referenceType: "manual", note: body.note, createdAt: new Date().toISOString(), product: { id: product.id, sku: product.sku, name: product.name }, createdBy: { id: 1, fullName: "Admin" } });
    return HttpResponse.json({ success: true, data: product, message: "Điều chỉnh tồn kho thành công" });
  }),

  // ── Users ──
  http.get(`${API}/users`, async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    const search = url.searchParams.get("search") || "";
    const role = url.searchParams.get("role");
    let filtered = users;
    if (search) filtered = filtered.filter(u => u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
    if (role) filtered = filtered.filter(u => u.role === role);
    const result = paginate(filtered, page, limit);
    return HttpResponse.json({ success: true, data: result });
  }),

  http.get(`${API}/users/:id`, async ({ params }) => {
    await delay(150);
    const user = users.find(u => u.id === Number(params.id));
    if (!user) return HttpResponse.json({ success: false, message: "Không tìm thấy" }, { status: 404 });
    return HttpResponse.json({ success: true, data: user });
  }),

  http.post(`${API}/users`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, unknown>;
    const newUser: User = { id: Math.max(...users.map(u => u.id)) + 1, fullName: body.fullName as string, email: body.email as string, role: body.role as "admin" | "staff", isActive: body.isActive as boolean, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    users.push(newUser);
    return HttpResponse.json({ success: true, data: newUser }, { status: 201 });
  }),

  http.put(`${API}/users/:id`, async ({ params, request }) => {
    await delay(300);
    const idx = users.findIndex(u => u.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ success: false, message: "Không tìm thấy" }, { status: 404 });
    const body = (await request.json()) as Record<string, unknown>;
    users[idx] = { ...users[idx], fullName: body.fullName as string, email: body.email as string, role: body.role as "admin" | "staff", isActive: body.isActive as boolean, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: users[idx] });
  }),

  http.patch(`${API}/users/:id`, async ({ params, request }) => {
    await delay(200);
    const idx = users.findIndex(u => u.id === Number(params.id));
    if (idx === -1) return HttpResponse.json({ success: false, message: "Không tìm thấy" }, { status: 404 });
    const body = (await request.json()) as { isActive?: boolean };
    if (body.isActive !== undefined) users[idx] = { ...users[idx], isActive: body.isActive, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: users[idx] });
  }),

  // ── Audit Logs ──
  http.get(`${API}/audit-logs`, async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    const search = url.searchParams.get("search") || "";
    const action = url.searchParams.get("action");
    let filtered = auditLogs;
    if (search) filtered = filtered.filter(l => l.description.toLowerCase().includes(search.toLowerCase()));
    if (action) filtered = filtered.filter(l => l.action === action);
    const result = paginate(filtered, page, limit);
    return HttpResponse.json({ success: true, data: result });
  }),

  http.get(`${API}/audit-logs/:id`, async ({ params }) => {
    await delay(150);
    const log = auditLogs.find(l => l.id === Number(params.id));
    if (!log) return HttpResponse.json({ success: false, message: "Không tìm thấy" }, { status: 404 });
    return HttpResponse.json({ success: true, data: log });
  }),

  // ── Dashboard ──
  http.get(`${API}/dashboard/summary`, async () => {
    await delay(200);
    return HttpResponse.json({ success: true, data: dashboardSummary });
  }),

  http.get(`${API}/dashboard/recent-movements`, async () => {
    await delay(200);
    return HttpResponse.json({ success: true, data: recentMovements });
  }),

  http.get(`${API}/dashboard/import-export-chart`, async () => {
    await delay(200);
    return HttpResponse.json({ success: true, data: importExportChartData });
  }),

  http.get(`${API}/dashboard/category-chart`, async () => {
    await delay(200);
    return HttpResponse.json({ success: true, data: categoryStockData });
  }),
];

import type { Product, Category, Supplier, User } from "@/types";
