import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getDashboardPath } from "@/lib/auth";
import { protectedRouteAccess } from "@/middleware/route-access";

const roleAccess: Record<string, string[]> = {
  "/admin": [...protectedRouteAccess.admin],
  "/teacher": [...protectedRouteAccess.teacher],
  "/student": [...protectedRouteAccess.student],
};

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("Content-Security-Policy", [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; "));
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
  );
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  return response;
}

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname, search } = request.nextUrl;
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/reset-password");

  if (isAuthPage && token?.role) {
    return applySecurityHeaders(
      NextResponse.redirect(new URL(getDashboardPath(String(token.role)), request.url)),
    );
  }

  for (const [prefix, allowedRoles] of Object.entries(roleAccess)) {
    if (!pathname.startsWith(prefix)) {
      continue;
    }

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    if (!allowedRoles.includes(String(token.role))) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL(getDashboardPath(String(token.role)), request.url)),
      );
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
