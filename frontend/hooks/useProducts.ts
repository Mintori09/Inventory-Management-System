"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { showToast } from "@/hooks/useToast";
import type { Product, ProductsResponse, ProductListParams, CreateProductPayload, UpdateProductPayload } from "@/types/product.type";

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: queryKeys.products(params as Record<string, unknown>),
    queryFn: () => apiClient<ProductsResponse>("/products", { params: params as any }),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => apiClient<Product>(`/products/${id}`),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductPayload) =>
      apiClient<Product>("/products", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast("Tạo sản phẩm thành công", "success");
    },
    onError: (err: Error) => {
      showToast(err.message, "error");
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductPayload }) =>
      apiClient<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast("Cập nhật thành công", "success");
    },
    onError: (err: Error) => {
      showToast(err.message, "error");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient<void>(`/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast("Đã ẩn sản phẩm", "success");
    },
    onError: (err: Error) => {
      showToast(err.message, "error");
    },
  });
}
