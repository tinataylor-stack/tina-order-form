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
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">รายการคำสั่งซื้อ / แบบฟอร์ม</h1>
          <p className="text-gray-600 mt-2">
            ดูข้อมูลทั้งหมดแบบพับเก็บได้ พร้อมแยกคนที่ต้องการใบกำกับภาษี
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            Error: {error.message}
          </div>
        )}

        {!error && <AdminSubmissionsList submissions={submissions} />}
      </div>
    </main>
  );
}