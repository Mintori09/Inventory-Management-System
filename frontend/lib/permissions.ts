import type { UserRole } from "@/types/auth.type";

export function canAccessRoute(route: string, role: UserRole): boolean {
  if (role === "admin") return true;

  const exact: string[] = [
    "/dashboard",
    "/products",
    "/categories",
    "/suppliers",
    "/inventory",
    "/inventory/import",
    "/inventory/export",
    "/inventory/movements",
    "/inventory/alerts",
  ];

  const adminPrefixes: string[] = ["/admin", "/products/new", "/products/"];
  for (const p of adminPrefixes) {
    if (p.endsWith("/") ? route.startsWith(p) : route === p || route.startsWith(p + "/")) {
      return false;
    }
  }

  return exact.some((r) => route === r);
}

export function can(
  action: "create" | "edit" | "delete" | "view",
  resource: string,
  role: UserRole
): boolean {
  if (role === "admin") return true;
  if (action === "view") return true;
  return false;
}
