import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, hidden } = body;

    if (!id || typeof hidden !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("form_submissions")
      .update({ is_hidden_in_admin: hidden })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("admin-hide route error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}