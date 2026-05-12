"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { showToast } from "@/hooks/useToast";
import type { User, UsersResponse, CreateUserPayload, UpdateUserPayload } from "@/types/user.type";

export function useUsers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.users(params),
    queryFn: () => apiClient<UsersResponse>("/users"),
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => apiClient<User>(`/users/${id}`),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserPayload) =>
      apiClient<User>("/users", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showToast("Tạo người dùng thành công", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserPayload }) =>
      apiClient<User>(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showToast("Cập nhật người dùng thành công", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      apiClient<void>(`/users/${id}`, { method: "PATCH", body: JSON.stringify({ isActive }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
}
