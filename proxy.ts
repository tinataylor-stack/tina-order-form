import { NextRequest, NextResponse } from "next/server";
import { hasValidAdminSession } from "@/lib/admin-session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminLoginPage = pathname === "/admin-login";
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const hasAdminSession = await hasValidAdminSession(request);

  if (isAdminPage && !hasAdminSession) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  if (isAdminLoginPage && hasAdminSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/admin-login"],
};
