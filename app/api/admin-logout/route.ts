import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminSessionCookieOptions,
} from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/admin-login", request.url),
    { status: 303 }
  );

  response.cookies.set(
    ADMIN_SESSION_COOKIE_NAME,
    "",
    getAdminSessionCookieOptions(true)
  );

  return response;
}
