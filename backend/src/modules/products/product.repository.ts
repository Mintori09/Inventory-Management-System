import { prisma } from "../../config/prisma";
import { getPagination } from "../../common/utils/pagination";
import { getStockStatus } from "../../common/utils/stock-status";
import { Prisma } from "@prisma/client";

export async function findProducts(query: {
  search?: string;
  categoryId?: string;
  supplierId?: string;
  stockStatus?: string;
  isActive?: string;
  page?: string;
  limit?: string;
}) {
  const { page, limit, skip } = getPagination(
    query.page ? Number(query.page) : undefined,
    query.limit ? Number(query.limit) : undefined
  );

  const where: Prisma.ProductWhereInput = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { sku: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.categoryId) {
    where.categoryId = parseInt(query.categoryId);
  }

  if (query.supplierId) {
    where.supplierId = parseInt(query.supplierId);
  }

  if (query.isActive !== undefined) {
    where.isActive = query.isActive === "true";
  }

  const [products, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  let items = products.map((p) => ({
    ...p,
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

export async function findById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
    },
  });
}

export async function findBySku(sku: string) {
  return prisma.product.findUnique({ where: { sku } });
}

export async function create(data: any) {
  return prisma.product.create({ data });
}

export async function update(id: number, data: any) {
  return prisma.product.update({ where: { id }, data });
}

export async function deactivate(id: number) {
  return prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
}
