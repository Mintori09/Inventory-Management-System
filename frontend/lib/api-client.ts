import { getToken, clearAuth } from "./auth-storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type ApiOptions = RequestInit & {
  params?: Record<string, string | number | undefined>;
};

function buildUrl(base: string, params?: Record<string, string | number | undefined>): string {
  if (!params) return base;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const token = getToken();
  const { params, ...fetchOptions } = options;

  const response = await fetch(buildUrl(`${API_URL}${endpoint}`, params), {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    },
  });

  if (response.status === 401) {
    clearAuth();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError("Phiên đăng nhập hết hạn", 401);
  }

  const json = await response.json();

  if (!response.ok || json.success === false) {
    throw new ApiError(
      json.message || "Có lỗi xảy ra",
      response.status,
      json.errors
    );
  }

  return json.data as T;
}
