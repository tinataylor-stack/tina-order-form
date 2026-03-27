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
    const {
      id,
      outboundCalled,
      outboundCallNote,
      disqualified,
      noNeedToFollowUp,
    } = body;

    if (
      !id ||
      typeof outboundCalled !== "boolean" ||
      typeof outboundCallNote !== "string" ||
      (disqualified !== undefined && typeof disqualified !== "boolean") ||
      (noNeedToFollowUp !== undefined &&
        typeof noNeedToFollowUp !== "boolean")
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const updatePayload: {
      outbound_called: boolean;
      outbound_call_note: string;
      disqualified?: boolean;
      no_need_follow_up?: boolean;
    } = {
      outbound_called: outboundCalled,
      outbound_call_note: outboundCallNote.trim(),
    };

    if (typeof disqualified === "boolean") {
      updatePayload.disqualified = disqualified;
    }

    if (typeof noNeedToFollowUp === "boolean") {
      updatePayload.no_need_follow_up = noNeedToFollowUp;
    }

    const { error } = await supabaseAdmin
      .from("form_submissions")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      submission: {
        id,
        outbound_called: outboundCalled,
        outbound_call_note: outboundCallNote.trim(),
        ...(typeof disqualified === "boolean"
          ? { disqualified }
          : {}),
        ...(typeof noNeedToFollowUp === "boolean"
          ? { no_need_follow_up: noNeedToFollowUp }
          : {}),
      },
    });
  } catch (error) {
    console.error("admin-follow-up route error:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
