import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { server } from "@/mocks/server";
import { useProducts, useProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

describe("useProducts", () => {
  it("fetches product list", async () => {
    const { result } = renderHook(() => useProducts({ page: 1, limit: 10 }), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items.length).toBeGreaterThan(0);
    expect(result.current.data?.pagination.totalItems).toBe(10);
  });

  it("supports search filter", async () => {
    const { result } = renderHook(() => useProducts({ page: 1, limit: 10, search: "iPhone" }), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items.some((p) => p.name.includes("iPhone"))).toBe(true);
  });
});

describe("useProduct", () => {
  it("fetches single product by id", async () => {
    const { result } = renderHook(() => useProduct(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe(1);
    expect(result.current.data?.name).toBeTruthy();
  });

  it("returns 404 for unknown product", async () => {
    const { result } = renderHook(() => useProduct(999), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useCategories", () => {
  it("fetches categories list", async () => {
    const { result } = renderHook(() => useCategories({}), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items.length).toBeGreaterThan(0);
  });
});

describe("useSuppliers", () => {
  it("fetches suppliers list", async () => {
    const { result } = renderHook(() => useSuppliers({}), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items.length).toBeGreaterThan(0);
  });
});
