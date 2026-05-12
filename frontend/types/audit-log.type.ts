import type { PaginationMeta } from "@/types/api.type";

export type AuditLog = {
  id: number;
  action: string;
  tableName: string;
  recordId: number;
  description: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  createdAt: string;
  user: { id: number; fullName: string };
};

export type AuditLogListParams = {
  search?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  userId?: number;
  page?: number;
  limit?: number;
};

export type AuditLogsResponse = {
  items: AuditLog[];
  pagination: PaginationMeta;
};
