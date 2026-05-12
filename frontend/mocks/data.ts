import type {
  Product, Category, Supplier, StockMovement, User, AuditLog,
  DashboardSummary, RecentMovement, ImportExportChartData, CategoryStockData,
} from "@/types";

export let categories: Category[] = [
  { id: 1, name: "Điện thoại", description: "Điện thoại thông minh", isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 2, name: "Laptop", description: "Máy tính xách tay", isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 3, name: "Phụ kiện", description: "Phụ kiện điện tử", isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 4, name: "Máy tính bảng", description: "Tablet", isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 5, name: "Âm thanh", description: "Thiết bị âm thanh", isActive: false, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
];

export let suppliers: Supplier[] = [
  { id: 1, name: "Công ty TNHH ABC", phone: "0901234567", email: "abc@example.com", address: "Hà Nội", isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 2, name: "Tổng công ty XYZ", phone: "0909876543", email: "xyz@example.com", address: "TP. Hồ Chí Minh", isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 3, name: "Nhà phân phối Đông Nam", phone: "0912345678", email: "dnam@example.com", address: "Đà Nẵng", isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 4, name: "Thế giới công nghệ", phone: "0923456789", email: "tgcnt@example.com", address: "Hà Nội", isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 5, name: "Công ty Cổ phần Thiết bị số", phone: "0934567890", email: "tbs@example.com", address: "TP. Hồ Chí Minh", isActive: false, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
];

export let products: Product[] = [
  { id: 1, sku: "SP001", name: "iPhone 15 Pro Max", description: "Apple iPhone 15 Pro Max 256GB", unit: "cái", costPrice: 25000000, sellingPrice: 29900000, currentStock: 50, minStock: 10, isActive: true, stockStatus: "in_stock", category: { id: 1, name: "Điện thoại" }, supplier: { id: 1, name: "Công ty TNHH ABC" }, createdAt: "2025-01-15T00:00:00Z", updatedAt: "2025-03-10T00:00:00Z" },
  { id: 2, sku: "SP002", name: "Samsung Galaxy S24 Ultra", description: "Samsung Galaxy S24 Ultra 512GB", unit: "cái", costPrice: 22000000, sellingPrice: 26900000, currentStock: 35, minStock: 10, isActive: true, stockStatus: "in_stock", category: { id: 1, name: "Điện thoại" }, supplier: { id: 2, name: "Tổng công ty XYZ" }, createdAt: "2025-01-20T00:00:00Z", updatedAt: "2025-03-12T00:00:00Z" },
  { id: 3, sku: "SP003", name: "MacBook Pro 14 M3", description: "Apple MacBook Pro 14 inch M3 Pro", unit: "cái", costPrice: 35000000, sellingPrice: 42900000, currentStock: 15, minStock: 5, isActive: true, stockStatus: "in_stock", category: { id: 2, name: "Laptop" }, supplier: { id: 1, name: "Công ty TNHH ABC" }, createdAt: "2025-02-01T00:00:00Z", updatedAt: "2025-03-15T00:00:00Z" },
  { id: 4, sku: "SP004", name: "Dell XPS 15", description: "Dell XPS 15 Intel Core i9", unit: "cái", costPrice: 28000000, sellingPrice: 33900000, currentStock: 8, minStock: 5, isActive: true, stockStatus: "in_stock", category: { id: 2, name: "Laptop" }, supplier: { id: 3, name: "Nhà phân phối Đông Nam" }, createdAt: "2025-02-05T00:00:00Z", updatedAt: "2025-03-18T00:00:00Z" },
  { id: 5, sku: "SP005", name: "Tai nghe AirPods Pro 2", description: "Apple AirPods Pro 2 USB-C", unit: "cái", costPrice: 4500000, sellingPrice: 5990000, currentStock: 100, minStock: 20, isActive: true, stockStatus: "in_stock", category: { id: 3, name: "Phụ kiện" }, supplier: { id: 1, name: "Công ty TNHH ABC" }, createdAt: "2025-02-10T00:00:00Z", updatedAt: "2025-03-20T00:00:00Z" },
  { id: 6, sku: "SP006", name: "Sạc dự phòng 20000mAh", description: "Pin dự phòng dung lượng cao", unit: "cái", costPrice: 350000, sellingPrice: 499000, currentStock: 3, minStock: 10, isActive: true, stockStatus: "low_stock", category: { id: 3, name: "Phụ kiện" }, supplier: { id: 4, name: "Thế giới công nghệ" }, createdAt: "2025-02-15T00:00:00Z", updatedAt: "2025-03-22T00:00:00Z" },
  { id: 7, sku: "SP007", name: "iPad Air M2", description: "Apple iPad Air M2 11 inch", unit: "cái", costPrice: 15000000, sellingPrice: 18900000, currentStock: 0, minStock: 5, isActive: true, stockStatus: "out_of_stock", category: { id: 4, name: "Máy tính bảng" }, supplier: { id: 1, name: "Công ty TNHH ABC" }, createdAt: "2025-03-01T00:00:00Z", updatedAt: "2025-03-25T00:00:00Z" },
  { id: 8, sku: "SP008", name: "Samsung Galaxy Tab S9", description: "Samsung Galaxy Tab S9 FE", unit: "cái", costPrice: 9000000, sellingPrice: 11900000, currentStock: 12, minStock: 5, isActive: true, stockStatus: "in_stock", category: { id: 4, name: "Máy tính bảng" }, supplier: { id: 2, name: "Tổng công ty XYZ" }, createdAt: "2025-03-05T00:00:00Z", updatedAt: "2025-03-28T00:00:00Z" },
  { id: 9, sku: "SP009", name: "Google Pixel 8", description: "Google Pixel 8 128GB", unit: "cái", costPrice: 16000000, sellingPrice: 19900000, currentStock: 0, minStock: 5, isActive: false, stockStatus: "out_of_stock", category: { id: 1, name: "Điện thoại" }, supplier: { id: 3, name: "Nhà phân phối Đông Nam" }, createdAt: "2025-03-10T00:00:00Z", updatedAt: "2025-04-01T00:00:00Z" },
  { id: 10, sku: "SP010", name: "Chuột Logitech MX Master 3", description: "Chuột không dây cao cấp", unit: "cái", costPrice: 1200000, sellingPrice: 1690000, currentStock: 45, minStock: 10, isActive: true, stockStatus: "in_stock", category: { id: 3, name: "Phụ kiện" }, supplier: { id: 4, name: "Thế giới công nghệ" }, createdAt: "2025-03-15T00:00:00Z", updatedAt: "2025-04-05T00:00:00Z" },
];

export let movements: StockMovement[] = [
  { id: 1, type: "import", quantityChange: 20, stockBefore: 30, stockAfter: 50, referenceId: 1, referenceType: "stock_import", note: "Nhập kho đợt 1", createdAt: "2025-03-01T08:00:00Z", product: { id: 1, sku: "SP001", name: "iPhone 15 Pro Max" }, createdBy: { id: 1, fullName: "Admin" } },
  { id: 2, type: "import", quantityChange: 10, stockBefore: 5, stockAfter: 15, referenceId: 2, referenceType: "stock_import", note: "Nhập kho đợt 1", createdAt: "2025-03-05T09:00:00Z", product: { id: 3, sku: "SP003", name: "MacBook Pro 14 M3" }, createdBy: { id: 1, fullName: "Admin" } },
  { id: 3, type: "export", quantityChange: -3, stockBefore: 50, stockAfter: 47, referenceType: "stock_export", note: "Xuất bán", createdAt: "2025-03-10T10:00:00Z", product: { id: 1, sku: "SP001", name: "iPhone 15 Pro Max" }, createdBy: { id: 2, fullName: "Nhân viên kho" } },
  { id: 4, type: "import", quantityChange: 50, stockBefore: 50, stockAfter: 100, referenceId: 3, referenceType: "stock_import", note: "Nhập kho", createdAt: "2025-03-12T11:00:00Z", product: { id: 5, sku: "SP005", name: "Tai nghe AirPods Pro 2" }, createdBy: { id: 1, fullName: "Admin" } },
  { id: 5, type: "adjustment", quantityChange: -2, stockBefore: 35, stockAfter: 33, referenceType: "manual", note: "Kiểm kê phát hiện thiếu", createdAt: "2025-03-15T14:00:00Z", product: { id: 2, sku: "SP002", name: "Samsung Galaxy S24 Ultra" }, createdBy: { id: 2, fullName: "Nhân viên kho" } },
  { id: 6, type: "export", quantityChange: -1, stockBefore: 1, stockAfter: 0, referenceType: "stock_export", note: "Xuất bán", createdAt: "2025-03-20T15:00:00Z", product: { id: 7, sku: "SP007", name: "iPad Air M2" }, createdBy: { id: 2, fullName: "Nhân viên kho" } },
  { id: 7, type: "import", quantityChange: 20, stockBefore: 3, stockAfter: 23, referenceId: 4, referenceType: "stock_import", note: "Nhập kho", createdAt: "2025-03-22T08:00:00Z", product: { id: 6, sku: "SP006", name: "Sạc dự phòng 20000mAh" }, createdBy: { id: 1, fullName: "Admin" } },
  { id: 8, type: "export", quantityChange: -5, stockBefore: 50, stockAfter: 45, referenceType: "stock_export", note: "Xuất bán", createdAt: "2025-03-25T09:00:00Z", product: { id: 10, sku: "SP010", name: "Chuột Logitech MX Master 3" }, createdBy: { id: 2, fullName: "Nhân viên kho" } },
  { id: 9, type: "export", quantityChange: -20, stockBefore: 23, stockAfter: 3, referenceType: "stock_export", note: "Xuất bán sỉ", createdAt: "2025-03-28T10:00:00Z", product: { id: 6, sku: "SP006", name: "Sạc dự phòng 20000mAh" }, createdBy: { id: 1, fullName: "Admin" } },
  { id: 10, type: "import", quantityChange: 12, stockBefore: 0, stockAfter: 12, referenceId: 5, referenceType: "stock_import", note: "Nhập kho lần đầu", createdAt: "2025-04-01T11:00:00Z", product: { id: 8, sku: "SP008", name: "Samsung Galaxy Tab S9" }, createdBy: { id: 1, fullName: "Admin" } },
  { id: 11, type: "export", quantityChange: -10, stockBefore: 47, stockAfter: 37, referenceType: "stock_export", note: "Xuất bán", createdAt: "2025-04-05T14:00:00Z", product: { id: 1, sku: "SP001", name: "iPhone 15 Pro Max" }, createdBy: { id: 2, fullName: "Nhân viên kho" } },
  { id: 12, type: "adjustment", quantityChange: 1, stockBefore: 7, stockAfter: 8, referenceType: "manual", note: "Kiểm kê phát hiện thừa", createdAt: "2025-04-08T15:00:00Z", product: { id: 4, sku: "SP004", name: "Dell XPS 15" }, createdBy: { id: 1, fullName: "Admin" } },
];

export let users: User[] = [
  { id: 1, fullName: "Admin", email: "admin@example.com", role: "admin", isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 2, fullName: "Nhân viên kho", email: "staff@example.com", role: "staff", isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 3, fullName: "Trần Văn A", email: "tranvana@example.com", role: "staff", isActive: true, createdAt: "2025-02-01T00:00:00Z", updatedAt: "2025-02-01T00:00:00Z" },
  { id: 4, fullName: "Nguyễn Thị B", email: "nguyenthib@example.com", role: "staff", isActive: false, createdAt: "2025-02-15T00:00:00Z", updatedAt: "2025-03-01T00:00:00Z" },
  { id: 5, fullName: "Lê Văn C", email: "levanc@example.com", role: "admin", isActive: true, createdAt: "2025-03-01T00:00:00Z", updatedAt: "2025-03-01T00:00:00Z" },
];

export let auditLogs: AuditLog[] = [
  { id: 1, action: "product.create", tableName: "products", recordId: 10, description: "Tạo sản phẩm Chuột Logitech MX Master 3", oldValues: undefined, newValues: { name: "Chuột Logitech MX Master 3", sku: "SP010" }, createdAt: "2025-03-15T10:00:00Z", user: { id: 1, fullName: "Admin" } },
  { id: 2, action: "inventory.import", tableName: "stock_movements", recordId: 1, description: "Nhập kho iPhone 15 Pro Max (+20)", oldValues: { stock: 30 }, newValues: { stock: 50 }, createdAt: "2025-03-01T08:00:00Z", user: { id: 1, fullName: "Admin" } },
  { id: 3, action: "inventory.export", tableName: "stock_movements", recordId: 3, description: "Xuất kho iPhone 15 Pro Max (-3)", oldValues: { stock: 50 }, newValues: { stock: 47 }, createdAt: "2025-03-10T10:00:00Z", user: { id: 2, fullName: "Nhân viên kho" } },
  { id: 4, action: "user.create", tableName: "users", recordId: 5, description: "Tạo tài khoản Lê Văn C", oldValues: undefined, newValues: { fullName: "Lê Văn C", email: "levanc@example.com", role: "admin" }, createdAt: "2025-03-01T09:00:00Z", user: { id: 1, fullName: "Admin" } },
  { id: 5, action: "inventory.adjust", tableName: "stock_movements", recordId: 5, description: "Điều chỉnh tồn kho Samsung Galaxy S24 Ultra (-2)", oldValues: { stock: 35 }, newValues: { stock: 33 }, createdAt: "2025-03-15T14:00:00Z", user: { id: 2, fullName: "Nhân viên kho" } },
];

export const dashboardSummary: DashboardSummary = {
  totalProducts: 10,
  lowStockCount: 1,
  outOfStockCount: 2,
  importToday: 0,
  exportToday: 0,
  totalStockValue: 26800000,
};

export const recentMovements: RecentMovement[] = movements.slice(0, 5).map(m => ({
  id: m.id,
  type: m.type,
  quantityChange: m.quantityChange,
  createdAt: m.createdAt,
  product: m.product,
  createdBy: m.createdBy,
}));

export const importExportChartData: ImportExportChartData[] = [
  { date: "01/04", imports: 0, exports: 0 },
  { date: "02/04", imports: 0, exports: 5000000 },
  { date: "03/04", imports: 15000000, exports: 0 },
  { date: "04/04", imports: 0, exports: 0 },
  { date: "05/04", imports: 0, exports: 29900000 },
  { date: "06/04", imports: 0, exports: 0 },
  { date: "07/04", imports: 0, exports: 0 },
];

export const categoryStockData: CategoryStockData[] = [
  { categoryName: "Điện thoại", totalStock: 85 },
  { categoryName: "Laptop", totalStock: 23 },
  { categoryName: "Phụ kiện", totalStock: 148 },
  { categoryName: "Máy tính bảng", totalStock: 12 },
  { categoryName: "Âm thanh", totalStock: 0 },
];

function paginate<T>(items: T[], page: number, limit: number) {
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);
  return {
    items: paged,
    pagination: {
      totalItems: items.length,
      page,
      limit,
      totalPages: Math.ceil(items.length / limit),
    },
  };
}

function getId(path: string): number {
  return Number(path.split("/").filter(Boolean).pop());
}

export { paginate, getId };
