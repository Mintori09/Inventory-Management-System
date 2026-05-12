import { hashPassword } from "../../common/utils/hash";
import { BadRequestError } from "../../common/errors/BadRequestError";
import { NotFoundError } from "../../common/errors/NotFoundError";
import * as userRepository from "./user.repository";
import { createAuditLog } from "../audit-logs/audit-log.repository";
import { AUDIT_ACTIONS } from "../../common/constants/audit-actions";

export async function getUsers(query: {
  search?: string;
  role?: string;
  isActive?: string;
  page?: string;
  limit?: string;
}) {
  return userRepository.findUsers(query);
}

export async function getUserById(id: number) {
  const user = await userRepository.findUserById(id);
  if (!user) throw new NotFoundError("Người dùng không tồn tại");
  return user;
}

export async function createUser(
  data: {
    fullName: string;
    email: string;
    password: string;
    role: string;
    isActive: boolean;
  },
  currentUserId: number
) {
  const existingUser = await userRepository.findUserByEmail(data.email);
  if (existingUser) {
    throw new BadRequestError("Email đã tồn tại");
  }

  const passwordHash = await hashPassword(data.password);
  const user = await userRepository.createUser({
    ...data,
    passwordHash,
  });

  await createAuditLog(
    currentUserId,
    AUDIT_ACTIONS.CREATE_USER,
    "users",
    user.id,
    `Tạo người dùng ${user.fullName} (${user.email})`
  );

  return user;
}

export async function updateUser(
  id: number,
  data: {
    fullName?: string;
    email?: string;
    password?: string;
    role?: string;
    isActive?: boolean;
  },
  currentUserId: number
) {
  const existing = await userRepository.findUserById(id);
  if (!existing) throw new NotFoundError("Người dùng không tồn tại");

  if (data.email) {
    const emailExists = await userRepository.findUserByEmail(data.email);
    if (emailExists && emailExists.id !== id) {
      throw new BadRequestError("Email đã tồn tại");
    }
  }

  const updateData: Record<string, unknown> = { ...data };
  if (data.password) {
    updateData.passwordHash = await hashPassword(data.password);
  }
  delete updateData.password;

  const user = await userRepository.updateUser(id, updateData);

  await createAuditLog(
    currentUserId,
    AUDIT_ACTIONS.UPDATE_USER,
    "users",
    id,
    `Cập nhật người dùng ${user.fullName}`
  );

  return user;
}

export async function deactivateUser(id: number, currentUserId: number) {
  const existing = await userRepository.findUserById(id);
  if (!existing) throw new NotFoundError("Người dùng không tồn tại");

  const user = await userRepository.deactivateUser(id);

  await createAuditLog(
    currentUserId,
    AUDIT_ACTIONS.LOCK_USER,
    "users",
    id,
    `Khóa người dùng ${user.fullName}`
  );

  return user;
}
