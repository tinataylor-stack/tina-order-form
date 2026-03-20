import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
} from "@/lib/admin-session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = body?.password;
    const adminPassword = process.env.ADMIN_PAGE_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "ADMIN_PAGE_PASSWORD is not set in .env.local" },
        { status: 500 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "กรุณากรอกรหัสผ่าน" },
        { status: 400 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "รหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    const sessionToken = await createAdminSessionToken();

    response.cookies.set(
      ADMIN_SESSION_COOKIE_NAME,
      sessionToken,
      getAdminSessionCookieOptions()
    );

    return response;
  } catch (error) {
    console.error("admin-login route error:", error);

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" },
      { status: 500 }
    );
  }
}
