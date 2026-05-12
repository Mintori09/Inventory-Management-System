"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { showToast } from "@/hooks/useToast";
import type { Category, CategoriesResponse, CreateCategoryPayload, UpdateCategoryPayload } from "@/types/category.type";

export function useCategories(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.categories(params),
    queryFn: () => apiClient<CategoriesResponse>("/categories"),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryPayload) =>
      apiClient<Category>("/categories", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showToast("Tạo danh mục thành công", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryPayload }) =>
      apiClient<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showToast("Cập nhật danh mục thành công", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient<void>(`/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showToast("Đã ẩn danh mục", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
}
