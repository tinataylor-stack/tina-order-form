export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabase-admin";
import AdminSubmissionsList from "./AdminSubmissionsList";

export type Submission = {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string | null;
  course: string | null;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  phone: string | null;
  payment_method: string | null;
  birth_date: string | null;
  occupation: string | null;
  business_description: string | null;
  wants_invoice: boolean | null;
  invoice_type: string | null;
  personal_tax_name: string | null;
  personal_tax_id: string | null;
  personal_address: string | null;
  personal_invoice_email: string | null;
  company_name: string | null;
  company_tax_id: string | null;
  company_address: string | null;
  company_invoice_email: string | null;
  company_contact_name: string | null;
  company_contact_phone: string | null;
  accepted_terms: boolean | null;
  signature_url: string | null;
};

export default async function AdminPage() {
  const { data, error } = await supabaseAdmin
    .from("form_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const submissions = (data ?? []) as Submission[];

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