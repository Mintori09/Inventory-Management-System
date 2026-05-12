import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "inventory_token";
const ROLE_KEY = "inventory_role";

const publicRoutes = ["/login", "/403", "/_not-found"];

const adminOnlyPrefixes = ["/admin", "/inventory/adjust"];

const adminOnlyExact = ["/products/new"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_KEY)?.value;

  if (publicRoutes.some((r) => pathname.startsWith(r))) {
    if (pathname === "/login" && token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = request.cookies.get(ROLE_KEY)?.value;

  const isAdminRoute =
    adminOnlyPrefixes.some((p) => pathname.startsWith(p)) ||
    adminOnlyExact.some((p) => pathname === p) ||
    (pathname.startsWith("/products/") && pathname.endsWith("/edit"));

  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)"],
};
