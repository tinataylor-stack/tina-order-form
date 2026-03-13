import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminLoginPage = pathname === "/admin-login";
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");

  const adminAuth = request.cookies.get("admin-auth")?.value;

  if (isAdminPage && adminAuth !== "granted") {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  if (isAdminLoginPage && adminAuth === "granted") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/admin-login"],
};