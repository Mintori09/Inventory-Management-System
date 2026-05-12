import { BadRequestError } from "../../common/errors/BadRequestError";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { AUDIT_ACTIONS } from "../../common/constants/audit-actions";
import { createAuditLog } from "../audit-logs/audit-log.repository";
import * as categoryRepository from "./category.repository";

export async function getCategories() {
  return categoryRepository.findAll();
}

export async function getCategoryById(id: number) {
  const category = await categoryRepository.findById(id);
  if (!category) throw new NotFoundError("Danh mục không tồn tại");
  return category;
}

export async function createCategory(
  data: { name: string; description?: string; isActive?: boolean },
  userId: number
) {
  const existing = await categoryRepository.findByName(data.name);
  if (existing) throw new BadRequestError("Tên danh mục đã tồn tại");

  const category = await categoryRepository.create(data);

  await createAuditLog(
    userId,
    AUDIT_ACTIONS.CREATE_CATEGORY,
    "categories",
    category.id,
    `Tạo danh mục ${category.name}`
  );

  return category;
}

export async function updateCategory(
  id: number,
  data: { name?: string; description?: string; isActive?: boolean },
  userId: number
) {
  const existing = await categoryRepository.findById(id);
  if (!existing) throw new NotFoundError("Danh mục không tồn tại");

  if (data.name && data.name !== existing.name) {
    const nameExists = await categoryRepository.findByName(data.name);
    if (nameExists) throw new BadRequestError("Tên danh mục đã tồn tại");
  }

  const category = await categoryRepository.update(id, data);

  await createAuditLog(
    userId,
    AUDIT_ACTIONS.UPDATE_CATEGORY,
    "categories",
    id,
    `Cập nhật danh mục ${category.name}`
  );

  return category;
}

export async function deactivateCategory(id: number, userId: number) {
  const existing = await categoryRepository.findById(id);
  if (!existing) throw new NotFoundError("Danh mục không tồn tại");

  const category = await categoryRepository.deactivate(id);

  await createAuditLog(
    userId,
    AUDIT_ACTIONS.DELETE_CATEGORY,
    "categories",
    id,
    `Ẩn danh mục ${category.name}`
  );

  return category;
}
