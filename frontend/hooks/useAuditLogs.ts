"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { AuditLog, AuditLogsResponse } from "@/types/audit-log.type";

export function useAuditLogs(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.auditLogs(params),
    queryFn: () => apiClient<AuditLogsResponse>("/audit-logs"),
  });
}

export function useAuditLog(id: number) {
  return useQuery({
    queryKey: ["audit-logs", id],
    queryFn: () => apiClient<AuditLog>(`/audit-logs/${id}`),
    enabled: !!id,
  });
}
