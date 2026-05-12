import { NotFoundError } from "../../common/errors/NotFoundError";
import { AUDIT_ACTIONS } from "../../common/constants/audit-actions";
import { createAuditLog } from "../audit-logs/audit-log.repository";
import * as supplierRepository from "./supplier.repository";

export async function getSuppliers() {
  return supplierRepository.findAll();
}

export async function getSupplierById(id: number) {
  const supplier = await supplierRepository.findById(id);
  if (!supplier) throw new NotFoundError("Nhà cung cấp không tồn tại");
  return supplier;
}

export async function createSupplier(
  data: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    isActive?: boolean;
  },
  userId: number
) {
  const supplier = await supplierRepository.create(data);

  await createAuditLog(
    userId,
    AUDIT_ACTIONS.CREATE_SUPPLIER,
    "suppliers",
    supplier.id,
    `Tạo nhà cung cấp ${supplier.name}`
  );

  return supplier;
}

export async function updateSupplier(
  id: number,
  data: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    isActive?: boolean;
  },
  userId: number
) {
  const existing = await supplierRepository.findById(id);
  if (!existing) throw new NotFoundError("Nhà cung cấp không tồn tại");

  const supplier = await supplierRepository.update(id, data);

  await createAuditLog(
    userId,
    AUDIT_ACTIONS.UPDATE_SUPPLIER,
    "suppliers",
    id,
    `Cập nhật nhà cung cấp ${supplier.name}`
  );

  return supplier;
}

export async function deactivateSupplier(id: number, userId: number) {
  const existing = await supplierRepository.findById(id);
  if (!existing) throw new NotFoundError("Nhà cung cấp không tồn tại");

  const supplier = await supplierRepository.deactivate(id);

  await createAuditLog(
    userId,
    AUDIT_ACTIONS.DELETE_SUPPLIER,
    "suppliers",
    id,
    `Ẩn nhà cung cấp ${supplier.name}`
  );

  return supplier;
}
