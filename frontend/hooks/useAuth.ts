"use client";

import { create } from "zustand";
import { apiClient } from "@/lib/api-client";
import { getToken, setToken, getUser, setUser, clearAuth } from "@/lib/auth-storage";
import type { AuthUser, LoginResponse } from "@/types/auth.type";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: "admin" | "staff") => boolean;
  initialize: () => void;
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    const token = getToken();
    const user = getUser();
    if (token && user) {
      set({ user, token, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    const data = await apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    setUser(data.user);
    document.cookie = `inventory_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `inventory_role=${data.user.role}; path=/; max-age=86400; SameSite=Lax`;
    set({ user: data.user, token: data.token, isAuthenticated: true });
  },

  logout: () => {
    clearAuth();
    document.cookie = "inventory_token=; path=/; max-age=0";
    document.cookie = "inventory_role=; path=/; max-age=0";
    set({ user: null, token: null, isAuthenticated: false });
    window.location.href = "/login";
  },

  hasRole: (role) => get().user?.role === role,
}));
