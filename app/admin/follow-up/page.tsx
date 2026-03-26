export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabase-admin";
import FollowUpTable from "./FollowUpTable";
import type { Submission } from "../types";

export default async function AdminFollowUpPage() {
  const { data, error } = await supabaseAdmin
    .from("form_submissions")
    .select("*")
    .not("is_hidden_in_admin", "is", true)
    .order("created_at", { ascending: false });

  const submissions = (data ?? []) as Submission[];

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ติดตามการโทร
            </h1>
            <p className="mt-2 text-gray-600">
              แสดงข้อมูลทุกคนในตารางเดียว พร้อมแก้ไขอัปเดตหลังโทรออกได้ทันที
            </p>
            <div className="mt-4">
              <a
                href="/admin"
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                กลับไปหน้ารายการคำสั่งซื้อ
              </a>
            </div>
          </div>

          <form action="/api/admin-logout" method="POST" className="shrink-0">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              ออกจากระบบ
            </button>
          </form>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            Error: {error.message}
          </div>
        ) : (
          <FollowUpTable submissions={submissions} />
        )}
      </div>
    </main>
  );
}
