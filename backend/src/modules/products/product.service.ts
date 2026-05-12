import { BadRequestError } from "../../common/errors/BadRequestError";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { AUDIT_ACTIONS } from "../../common/constants/audit-actions";
import { createAuditLog } from "../audit-logs/audit-log.repository";
import { getStockStatus } from "../../common/utils/stock-status";
import * as productRepository from "./product.repository";
import { prisma } from "../../config/prisma";

export async function getProducts(query: {
  search?: string;
  categoryId?: string;
  supplierId?: string;
  stockStatus?: string;
  isActive?: string;
  page?: string;
  limit?: string;
}) {
  return productRepository.findProducts(query);
}

export async function getProductById(id: number) {
  const product = await productRepository.findById(id);
  if (!product) throw new NotFoundError("Sản phẩm không tồn tại");
  return {
    ...product,
    stockStatus: getStockStatus(product.currentStock, product.minStock),
  };
}

export async function createProduct(
  data: {
    categoryId: number;
    supplierId?: number;
    sku: string;
    name: string;
    description?: string;
    unit: string;
    costPrice: number;
    sellingPrice: number;
    currentStock?: number;
    minStock?: number;
    imageUrl?: string;
    isActive?: boolean;
  },
  userId: number
) {
  const existingSku = await productRepository.findBySku(data.sku);
  if (existingSku) throw new BadRequestError("SKU đã tồn tại");

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  if (!category) throw new BadRequestError("Danh mục không tồn tại");

  if (data.supplierId) {
    const supplier = await prisma.supplier.findUnique({
      where: { id: data.supplierId },
    });
    if (!supplier) throw new BadRequestError("Nhà cung cấp không tồn tại");
  }

  const createData: Record<string, unknown> = {};
  const fields: (keyof typeof data)[] = ["sku", "name", "description", "unit", "costPrice", "sellingPrice", "currentStock", "minStock", "imageUrl", "isActive"];
  for (const f of fields) {
    if ((data as any)[f] !== undefined) createData[f] = (data as any)[f];
  }

  createData.createdBy = { connect: { id: userId } };
  createData.category = { connect: { id: data.categoryId } };
  if (data.supplierId) {
    createData.supplier = { connect: { id: data.supplierId } };
  }

  const product = await productRepository.create(createData as any);

  await createAuditLog(
    userId,
    AUDIT_ACTIONS.CREATE_PRODUCT,
    "products",
    product.id,
    `Tạo sản phẩm ${product.name} (${product.sku})`
  );

  return productRepository.findById(product.id);
}

export async function updateProduct(
  id: number,
  data: {
    categoryId?: number;
    supplierId?: number;
    sku?: string;
    name?: string;
    description?: string;
    unit?: string;
    costPrice?: number;
    sellingPrice?: number;
    minStock?: number;
    imageUrl?: string;
    isActive?: boolean;
  },
  userId: number
) {
  const existing = await productRepository.findById(id);
  if (!existing) throw new NotFoundError("Sản phẩm không tồn tại");

  if (data.sku && data.sku !== existing.sku) {
    const skuExists = await productRepository.findBySku(data.sku);
    if (skuExists) throw new BadRequestError("SKU đã tồn tại");
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw new BadRequestError("Danh mục không tồn tại");
  }

  if (data.supplierId) {
    const supplier = await prisma.supplier.findUnique({
      where: { id: data.supplierId },
    });
    if (!supplier) throw new BadRequestError("Nhà cung cấp không tồn tại");
  }

  const updateData: Record<string, unknown> = {};
  const updatableFields: (keyof typeof data)[] = ["sku", "name", "description", "unit", "costPrice", "sellingPrice", "minStock", "imageUrl", "isActive"];
  for (const f of updatableFields) {
    if ((data as any)[f] !== undefined) updateData[f] = (data as any)[f];
  }

  if (data.categoryId) {
    updateData.category = { connect: { id: data.categoryId } };
  }
  if (data.supplierId) {
    updateData.supplier = { connect: { id: data.supplierId } };
  }

  const product = await productRepository.update(id, updateData as any);

  await createAuditLog(
    userId,
    AUDIT_ACTIONS.UPDATE_PRODUCT,
    "products",
    id,
    `Cập nhật sản phẩm ${product.name}`
  );

  return productRepository.findById(id);
}

export async function deactivateProduct(id: number, userId: number) {
  const existing = await productRepository.findById(id);
  if (!existing) throw new NotFoundError("Sản phẩm không tồn tại");

  const product = await productRepository.deactivate(id);

  await createAuditLog(
    userId,
    AUDIT_ACTIONS.DELETE_PRODUCT,
    "products",
    id,
    `Ẩn sản phẩm ${product.name}`
  );

  return { id, message: "Đã ẩn sản phẩm" };
}
