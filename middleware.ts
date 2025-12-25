import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN } from "./constants/keys";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuthenticated = req.cookies.get(AUTH_TOKEN)?.value;

  // If user is logged in and tries to go to login page, redirect to dashboard
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  if (
    !isAuthenticated &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Otherwise, continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
