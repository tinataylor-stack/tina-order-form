import { NextRequest, NextResponse } from "next/server";
import { hasValidAdminSession } from "@/lib/admin-session";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const hasAdminSession = await hasValidAdminSession(request);

    if (!hasAdminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id.trim() : "";
    const course = typeof body?.course === "string" ? body.course.trim() : "";

    if (!id || !course) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (course.length > 255) {
      return NextResponse.json(
        { error: "ชื่อคอร์สยาวเกินไป" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("form_submissions")
      .update({ course })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      submission: {
        id,
        course,
      },
    });
  } catch (error) {
    console.error("admin-update-course route error:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
