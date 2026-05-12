"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { showToast } from "@/hooks/useToast";
import type { Supplier, SuppliersResponse, CreateSupplierPayload, UpdateSupplierPayload } from "@/types/supplier.type";

export function useSuppliers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.suppliers(params),
    queryFn: () => apiClient<SuppliersResponse>("/suppliers"),
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSupplierPayload) =>
      apiClient<Supplier>("/suppliers", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      showToast("Tạo nhà cung cấp thành công", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSupplierPayload }) =>
      apiClient<Supplier>(`/suppliers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      showToast("Cập nhật nhà cung cấp thành công", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient<void>(`/suppliers/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      showToast("Đã ẩn nhà cung cấp", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
}
