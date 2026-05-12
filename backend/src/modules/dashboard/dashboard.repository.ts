import { prisma } from "../../config/prisma";

export async function getSummary() {
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const [
    totalProducts,
    outOfStockCount,
    todayImportData,
    todayExportData,
    products,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({
      where: { isActive: true, currentStock: 0 },
    }),
    prisma.stockImport.aggregate({
      _sum: { quantity: true },
      where: { createdAt: { gte: todayStart } },
    }),
    prisma.stockExport.aggregate({
      _sum: { quantity: true },
      where: { createdAt: { gte: todayStart } },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { currentStock: true, minStock: true, costPrice: true },
    }),
  ]);

  const lowStockCount = products.filter(
    (p) => p.currentStock > 0 && p.currentStock <= p.minStock
  ).length;

  const todayImportCount = todayImportData._sum.quantity || 0;
  const todayExportCount = todayExportData._sum.quantity || 0;
  const inventoryValue = products.reduce(
    (sum, p) => sum + p.currentStock * p.costPrice,
    0
  );

  return {
    totalProducts,
    lowStockCount,
    outOfStockCount,
    todayImportCount,
    todayExportCount,
    inventoryValue,
  };
}

export async function getRecentMovements(limit = 10) {
  return prisma.stockMovement.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { id: true, sku: true, name: true } },
      createdBy: { select: { id: true, fullName: true } },
    },
  });
}
