export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabase-admin";
import AdminSubmissionsList from "./AdminSubmissionsList";
import type { Submission } from "./types";

const LEGACY_PUBLIC_SIGNATURE_PREFIX = "/storage/v1/object/public/signatures/";

function getSignatureObjectPath(signatureValue: string | null) {
  if (!signatureValue) {
    return null;
  }

  if (!signatureValue.startsWith("http")) {
    return signatureValue;
  }

  const prefixIndex = signatureValue.indexOf(LEGACY_PUBLIC_SIGNATURE_PREFIX);

  if (prefixIndex === -1) {
    return null;
  }

  const pathWithQuery = signatureValue.slice(
    prefixIndex + LEGACY_PUBLIC_SIGNATURE_PREFIX.length
  );
  const objectPath = pathWithQuery.split("?")[0];

  return objectPath ? decodeURIComponent(objectPath) : null;
}

async function getSignedSignatureUrl(signatureValue: string | null) {
  const objectPath = getSignatureObjectPath(signatureValue);

  if (!objectPath) {
    return signatureValue;
  }

  const { data, error } = await supabaseAdmin.storage
    .from("signatures")
    .createSignedUrl(objectPath, 60 * 60);

  if (error) {
    console.error("admin page: failed to create signed signature url", error);
    return null;
  }

  return data.signedUrl;
}

export default async function AdminPage() {
  const { data, error } = await supabaseAdmin
    .from("form_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const submissions = await Promise.all(
    ((data ?? []) as Submission[]).map(async (submission) => ({
      ...submission,
      signature_url: await getSignedSignatureUrl(submission.signature_url),
    }))
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              รายการคำสั่งซื้อ / แบบฟอร์ม
            </h1>
            <p className="mt-2 text-gray-600">
              ดูข้อมูลทั้งหมดแบบพับเก็บได้ พร้อมแยกคนที่ต้องการใบกำกับภาษี
            </p>
            <div className="mt-4">
              <a
                href="/admin/follow-up"
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                ดูหน้าติดตามการโทร
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
          <AdminSubmissionsList submissions={submissions} />
        )}
      </div>
    </main>
  );
}
