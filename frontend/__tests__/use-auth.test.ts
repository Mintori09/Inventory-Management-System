import { describe, it, expect, beforeEach } from "vitest";
import { useAuth } from "@/hooks/useAuth";

beforeEach(() => {
  window.localStorage.clear();
  useAuth.setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
});

describe("useAuth store", () => {
  it("starts unauthenticated", () => {
    const state = useAuth.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("initialize restores session from localStorage", () => {
    window.localStorage.setItem("inventory_token", "test-token");
    window.localStorage.setItem("inventory_user", JSON.stringify({ id: 1, fullName: "Admin", email: "admin@test.com", role: "admin" }));
    useAuth.getState().initialize();
    const state = useAuth.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe("test-token");
    expect(state.user?.fullName).toBe("Admin");
  });

  it("initialize sets loading false when no session", () => {
    useAuth.getState().initialize();
    expect(useAuth.getState().isLoading).toBe(false);
  });

  it("hasRole checks user role", () => {
    useAuth.setState({ user: { id: 1, fullName: "A", email: "a@t.com", role: "admin", isActive: true } });
    expect(useAuth.getState().hasRole("admin")).toBe(true);
    expect(useAuth.getState().hasRole("staff")).toBe(false);
  });

  it("hasRole returns false when no user", () => {
    expect(useAuth.getState().hasRole("admin")).toBe(false);
  });

  it("logout clears state and localStorage", () => {
    window.localStorage.setItem("inventory_token", "x");
    window.localStorage.setItem("inventory_user", JSON.stringify({ id: 1, fullName: "A", email: "a@t.com", role: "admin" }));
    useAuth.setState({ user: { id: 1, fullName: "A", email: "a@t.com", role: "admin", isActive: true }, token: "x", isAuthenticated: true });

    useAuth.getState().logout();

    expect(window.localStorage.getItem("inventory_token")).toBeNull();
    expect(useAuth.getState().isAuthenticated).toBe(false);
    expect(useAuth.getState().user).toBeNull();
  });
});
