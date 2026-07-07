import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getDashboardPath } from "@/lib/auth";

const roleAccess: Record<string, string[]> = {
  "/admin": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  "/teacher": ["TEACHER"],
  "/student": ["STUDENT", "PARENT"],
};

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
    return NextResponse.redirect(new URL(getDashboardPath(String(token.role)), request.url));
  }

  for (const [prefix, allowedRoles] of Object.entries(roleAccess)) {
    if (!pathname.startsWith(prefix)) {
      continue;
    }

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    if (!allowedRoles.includes(String(token.role))) {
      return NextResponse.redirect(new URL(getDashboardPath(String(token.role)), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password/:path*",
  ],
};
