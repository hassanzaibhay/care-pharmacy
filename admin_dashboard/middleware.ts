import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// PRESENCE GATE only — not authentication.
// Checks that the admin_jwt cookie EXISTS. If absent, the user is redirected to /login
// before the dashboard shell renders. This does NOT verify the JWT signature — a forged
// or expired cookie still gets a 401 from the backend's protect middleware when it hits
// any API call. The real auth gate is the backend, not this file.
export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("admin_jwt");

  if (!cookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl, { status: 307 });
  }

  return NextResponse.next();
}

// Match only the six protected dashboard segments and their subpaths.
// /login, /, /api/*, and _next static assets are intentionally excluded —
// do not add a broad catch-all here.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/medicines/:path*",
    "/orders/:path*",
    "/users/:path*",
    "/reviews/:path*",
    "/config/:path*",
  ],
};
