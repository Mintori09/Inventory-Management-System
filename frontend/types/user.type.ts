import type { UserRole } from "@/types/auth.type";
import type { PaginationMeta } from "@/types/api.type";

export type User = {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserPayload = {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
};

export type UpdateUserPayload = Partial<CreateUserPayload>;

export type UsersResponse = {
  items: User[];
  pagination: PaginationMeta;
};
