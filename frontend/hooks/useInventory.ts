"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { showToast } from "@/hooks/useToast";
import type { StockOverviewItem, MovementsResponse, LowStockResponse, ImportStockPayload, ExportStockPayload, AdjustStockPayload, StockMovement } from "@/types/inventory.type";

export function useStockOverview(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.stockOverview(params),
    queryFn: () => apiClient<{ items: StockOverviewItem[] }>("/inventory/stock-overview"),
  });
}

export function useMovements(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.movements(params),
    queryFn: () => apiClient<MovementsResponse>("/inventory/movements"),
  });
}

export function useMovement(id: number) {
  return useQuery({
    queryKey: ["inventory", "movement", id],
    queryFn: () => apiClient<StockMovement>(`/inventory/movements/${id}`),
    enabled: !!id,
  });
}

export function useLowStock(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.lowStock(params),
    queryFn: () => apiClient<LowStockResponse>("/inventory/low-stock"),
  });
}

export function useImportStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ImportStockPayload) =>
      apiClient<void>("/inventory/import", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast("Nhập kho thành công", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
}

export function useExportStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ExportStockPayload) =>
      apiClient<void>("/inventory/export", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast("Xuất kho thành công", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdjustStockPayload) =>
      apiClient<void>("/inventory/adjust", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast("Điều chỉnh kho thành công", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
}
