import { prisma } from "../../config/prisma";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { AUDIT_ACTIONS } from "../../common/constants/audit-actions";
import * as inventoryRepository from "./inventory.repository";
import { ImportResult, ExportResult, AdjustResult } from "./inventory.types";

export async function getStockOverview(query: {
  search?: string;
  categoryId?: string;
  stockStatus?: string;
  page?: string;
  limit?: string;
}) {
  return inventoryRepository.findStockOverview(query);
}

export async function getMovements(query: {
  search?: string;
  productId?: string;
  type?: string;
  userId?: string;
  from?: string;
  to?: string;
  page?: string;
  limit?: string;
}) {
  return inventoryRepository.findMovements(query);
}

export async function getStockStatistics(query: {
  from?: string;
  to?: string;
  groupBy?: "day" | "month";
}) {
  return inventoryRepository.getStockStats(query);
}

export async function getLowStockProducts() {
  return inventoryRepository.findLowStockProducts();
}

export async function importStock(
  data: {
    productId: number;
    supplierId?: number;
    quantity: number;
    importPrice: number;
    note?: string;
  },
  userId: number
): Promise<ImportResult> {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: data.productId },
    });

    if (!product || !product.isActive) {
      throw new BadRequestError("Sản phẩm không tồn tại hoặc đã bị ẩn");
    }

    const stockBefore = product.currentStock;
    const stockAfter = stockBefore + data.quantity;
    const totalAmount = data.quantity * data.importPrice;

    const stockImport = await tx.stockImport.create({
      data: {
        productId: data.productId,
        supplierId: data.supplierId,
        quantity: data.quantity,
        importPrice: data.importPrice,
        totalAmount,
        note: data.note,
        createdById: userId,
      },
    });

    await tx.product.update({
      where: { id: data.productId },
      data: { currentStock: stockAfter },
    });

    await tx.stockMovement.create({
      data: {
        productId: data.productId,
        type: "import",
        quantityChange: data.quantity,
        stockBefore,
        stockAfter,
        referenceType: "stock_import",
        referenceId: stockImport.id,
        note: data.note,
        createdById: userId,
      },
    });

    await tx.auditLog.create({
      data: {
        userId,
        action: AUDIT_ACTIONS.IMPORT_STOCK,
        tableName: "stock_imports",
        recordId: stockImport.id,
        description: `Nhập ${data.quantity} sản phẩm ${product.name}`,
      },
    });

    return {
      id: stockImport.id,
      productId: data.productId,
      quantity: data.quantity,
      stockBefore,
      stockAfter,
    };
  });
}

export async function exportStock(
  data: {
    productId: number;
    quantity: number;
    exportPrice: number;
    note?: string;
  },
  userId: number
): Promise<ExportResult> {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: data.productId },
    });

    if (!product || !product.isActive) {
      throw new BadRequestError("Sản phẩm không tồn tại hoặc đã bị ẩn");
    }

    if (product.currentStock < data.quantity) {
      throw new BadRequestError("Không đủ tồn kho");
    }

    const stockBefore = product.currentStock;
    const stockAfter = stockBefore - data.quantity;
    const totalAmount = data.quantity * data.exportPrice;

    const stockExport = await tx.stockExport.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        exportPrice: data.exportPrice,
        totalAmount,
        note: data.note,
        createdById: userId,
      },
    });

    await tx.product.update({
      where: { id: data.productId },
      data: { currentStock: stockAfter },
    });

    await tx.stockMovement.create({
      data: {
        productId: data.productId,
        type: "export",
        quantityChange: -data.quantity,
        stockBefore,
        stockAfter,
        referenceType: "stock_export",
        referenceId: stockExport.id,
        note: data.note,
        createdById: userId,
      },
    });

    await tx.auditLog.create({
      data: {
        userId,
        action: AUDIT_ACTIONS.EXPORT_STOCK,
        tableName: "stock_exports",
        recordId: stockExport.id,
        description: `Xuất ${data.quantity} sản phẩm ${product.name}`,
      },
    });

    return {
      id: stockExport.id,
      productId: data.productId,
      quantity: data.quantity,
      stockBefore,
      stockAfter,
    };
  });
}

export async function adjustStock(
  data: {
    productId: number;
    adjustmentType: "increase" | "decrease";
    quantity: number;
    note: string;
  },
  userId: number
): Promise<AdjustResult> {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: data.productId },
    });

    if (!product || !product.isActive) {
      throw new BadRequestError("Sản phẩm không tồn tại hoặc đã bị ẩn");
    }

    const stockBefore = product.currentStock;
    const quantityChange =
      data.adjustmentType === "increase" ? data.quantity : -data.quantity;
    const stockAfter = stockBefore + quantityChange;

    if (stockAfter < 0) {
      throw new BadRequestError("Không đủ tồn kho");
    }

    await tx.product.update({
      where: { id: data.productId },
      data: { currentStock: stockAfter },
    });

    await tx.stockMovement.create({
      data: {
        productId: data.productId,
        type: "adjustment",
        quantityChange,
        stockBefore,
        stockAfter,
        referenceType: "manual",
        referenceId: 0,
        note: data.note,
        createdById: userId,
      },
    });

    await tx.auditLog.create({
      data: {
        userId,
        action: AUDIT_ACTIONS.ADJUST_STOCK,
        tableName: "products",
        recordId: data.productId,
        description: `Điều chỉnh tồn kho ${
          data.adjustmentType === "increase" ? "tăng" : "giảm"
        } ${data.quantity} sản phẩm ${product.name} - ${data.note}`,
      },
    });

    return {
      productId: data.productId,
      stockBefore,
      stockAfter,
      adjustmentType: data.adjustmentType,
      quantity: data.quantity,
    };
  });
}
