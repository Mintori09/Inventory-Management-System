import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { server } from "@/mocks/server";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/app/(auth)/login/page";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterAll(() => server.close());
beforeEach(() => {
  useAuth.setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
});
afterEach(() => {
  server.resetHandlers();
  window.localStorage.clear();
  useAuth.setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
});

function Wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe("LoginPage", () => {
  it("renders login form", () => {
    render(<LoginPage />, { wrapper: Wrapper });
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Mật khẩu")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /đăng nhập/i })).toBeInTheDocument();
  });

  it("shows error on invalid credentials", async () => {
    render(<LoginPage />, { wrapper: Wrapper });
    await userEvent.type(screen.getByPlaceholderText(/admin@example.com/), "admin@example.com");
    await userEvent.type(screen.getByPlaceholderText(/••••••/), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));
    await waitFor(() => {
      expect(screen.getByText(/phiên đăng nhập/i)).toBeInTheDocument();
    });
  });

  it("redirects to dashboard on successful login", async () => {
    render(<LoginPage />, { wrapper: Wrapper });
    await userEvent.type(screen.getByPlaceholderText(/admin@example.com/), "admin@example.com");
    await userEvent.type(screen.getByPlaceholderText(/••••••/), "123456");
    await userEvent.click(screen.getByRole("button", { name: /đăng nhập/i }));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});
