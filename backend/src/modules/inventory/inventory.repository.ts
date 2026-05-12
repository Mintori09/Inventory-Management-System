import { prisma } from "../../config/prisma";
import { getPagination } from "../../common/utils/pagination";
import { getStockStatus } from "../../common/utils/stock-status";
import { Prisma } from "@prisma/client";
import { StockStats } from "./inventory.types";

export async function findStockOverview(query: {
  search?: string;
  categoryId?: string;
  stockStatus?: string;
  page?: string;
  limit?: string;
}) {
  const { page, limit, skip } = getPagination(
    query.page ? Number(query.page) : undefined,
    query.limit ? Number(query.limit) : undefined
  );

  const where: Prisma.ProductWhereInput = { isActive: true };

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { sku: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.categoryId) {
    where.categoryId = parseInt(query.categoryId);
  }

  const [products, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true } } },
      skip,
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.product.count({ where }),
  ]);

  let items = products.map((p) => ({
    productId: p.id,
    sku: p.sku,
    name: p.name,
    categoryName: p.category.name,
    currentStock: p.currentStock,
    minStock: p.minStock,
    unit: p.unit,
    stockStatus: getStockStatus(p.currentStock, p.minStock),
  }));

  if (query.stockStatus) {
    items = items.filter((i) => i.stockStatus === query.stockStatus);
  }

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
}

export async function findMovements(query: {
  search?: string;
  productId?: string;
  type?: string;
  userId?: string;
  from?: string;
  to?: string;
  page?: string;
  limit?: string;
}) {
  const { page, limit, skip } = getPagination(
    query.page ? Number(query.page) : undefined,
    query.limit ? Number(query.limit) : undefined
  );

  const where: Prisma.StockMovementWhereInput = {};

  if (query.productId) where.productId = parseInt(query.productId);
  if (query.type) where.type = query.type as any;
  if (query.userId) where.createdById = parseInt(query.userId);

  if (query.from || query.to) {
    where.createdAt = {};
    if (query.from) where.createdAt.gte = new Date(query.from);
    if (query.to) where.createdAt.lte = new Date(query.to);
  }

  const [items, totalItems] = await Promise.all([
    prisma.stockMovement.findMany({
      where,
      include: {
        product: { select: { id: true, sku: true, name: true } },
        createdBy: { select: { id: true, fullName: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.stockMovement.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
}

export async function getStockStats(params: {
  from?: string;
  to?: string;
  groupBy?: "day" | "month";
}) {
  const whereImports: Prisma.StockImportWhereInput = {};
  const whereExports: Prisma.StockExportWhereInput = {};

  if (params.from || params.to) {
    const dateFilter: Prisma.DateTimeFilter = {};
    if (params.from) dateFilter.gte = new Date(params.from);
    if (params.to) dateFilter.lte = new Date(params.to);
    whereImports.createdAt = dateFilter;
    whereExports.createdAt = dateFilter;
  }

  const [importAgg, exportAgg] = await Promise.all([
    prisma.stockImport.aggregate({
      _sum: { quantity: true, totalAmount: true },
      where: whereImports,
    }),
    prisma.stockExport.aggregate({
      _sum: { quantity: true, totalAmount: true },
      where: whereExports,
    }),
  ]);

  const result: StockStats = {
    totalImportQuantity: importAgg._sum.quantity || 0,
    totalImportValue: importAgg._sum.totalAmount || 0,
    totalExportQuantity: exportAgg._sum.quantity || 0,
    totalExportValue: exportAgg._sum.totalAmount || 0,
    netStockChange:
      (importAgg._sum.quantity || 0) - (exportAgg._sum.quantity || 0),
  };

  if (params.groupBy) {
    const imports = await prisma.stockImport.findMany({
      where: whereImports,
      select: {
        quantity: true,
        totalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const exports = await prisma.stockExport.findMany({
      where: whereExports,
      select: {
        quantity: true,
        totalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    type BreakdownItem = {
      period: string;
      importQuantity: number;
      importValue: number;
      exportQuantity: number;
      exportValue: number;
    };

    const formatKey =
      params.groupBy === "month"
        ? (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        : (d: Date) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const grouped: Record<string, BreakdownItem> = {};

    for (const imp of imports) {
      const key = formatKey(imp.createdAt);
      if (!grouped[key])
        grouped[key] = {
          period: key,
          importQuantity: 0,
          importValue: 0,
          exportQuantity: 0,
          exportValue: 0,
        };
      grouped[key].importQuantity += imp.quantity;
      grouped[key].importValue += imp.totalAmount;
    }

    for (const exp of exports) {
      const key = formatKey(exp.createdAt);
      if (!grouped[key])
        grouped[key] = {
          period: key,
          importQuantity: 0,
          importValue: 0,
          exportQuantity: 0,
          exportValue: 0,
        };
      grouped[key].exportQuantity += exp.quantity;
      grouped[key].exportValue += exp.totalAmount;
    }

    result.breakdown = Object.values(grouped).sort((a, b) =>
      a.period.localeCompare(b.period)
    );
  }

  return result;
}

export async function findLowStockProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      currentStock: { lte: prisma.product.fields.minStock },
    },
    include: { category: { select: { name: true } } },
    orderBy: { currentStock: "asc" },
  });

  return products.map((p) => ({
    ...p,
    stockStatus: getStockStatus(p.currentStock, p.minStock),
  }));
}
