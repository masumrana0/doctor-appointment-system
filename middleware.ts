import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN } from "./constants/keys";
import { jwtVerify } from "jose";

type EdgeVerifyResult = "valid" | "invalid" | "unknown";

async function verifyEdgeToken(token: string): Promise<EdgeVerifyResult> {
  const secret = process.env.JWT_SECRET;
  // If the secret is not available in the Edge runtime, don't force logout.
  // (This typically means the env var wasn't present at build time.)
  if (!secret) return "unknown";

  try {
    const secretKey = new TextEncoder().encode(secret);
    await jwtVerify(token, secretKey);
    return "valid";
  } catch {
    return "invalid";
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(AUTH_TOKEN)?.value;
  const isLoginRoute = pathname === "/login";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (!token) {
    if (isDashboardRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  const verifyResult = await verifyEdgeToken(token);

  // If we can't verify in Edge (missing secret), allow request to continue.
  // Route handlers / server components will enforce auth as needed.
  if (verifyResult === "unknown") {
    return NextResponse.next();
  }

  if (verifyResult === "invalid") {
    // If user is already on /login, just clear cookie and continue.
    if (isLoginRoute) {
      const res = NextResponse.next();
      res.cookies.delete(AUTH_TOKEN);
      return res;
    }

    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete(AUTH_TOKEN);
    return res;
  }

  if (isLoginRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
