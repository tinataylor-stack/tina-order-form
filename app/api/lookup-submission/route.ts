import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = normalizeDigits(String(body?.phone ?? ""));

    if (!phone) {
      return NextResponse.json(
        { error: "กรุณากรอกเบอร์โทรที่เคยใช้สั่งซื้อ" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("form_submissions")
      .select(
        `
          first_name,
          last_name,
          nickname,
          email,
          phone,
          payment_method,
          birth_date,
          occupation,
          business_description,
          wants_invoice,
          invoice_type,
          personal_tax_name,
          personal_tax_id,
          personal_address,
          personal_invoice_email,
          company_name,
          company_tax_id,
          company_address,
          company_invoice_email,
          company_contact_name,
          company_contact_phone
        `
      )
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("lookup-submission: supabase error", error);
      return NextResponse.json(
        { error: "ไม่สามารถค้นหาข้อมูลเดิมได้" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลจากเบอร์โทรนี้" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      submission: {
        firstName: data.first_name,
        lastName: data.last_name,
        nickname: data.nickname,
        email: data.email,
        phone: data.phone,
        paymentMethod: data.payment_method,
        birthDate: data.birth_date,
        occupation: data.occupation,
        businessDescription: data.business_description,
        wantsInvoice: data.wants_invoice,
        invoiceType: data.invoice_type,
        personalTaxName: data.personal_tax_name,
        personalTaxId: data.personal_tax_id,
        personalAddress: data.personal_address,
        personalInvoiceEmail: data.personal_invoice_email,
        companyName: data.company_name,
        companyTaxId: data.company_tax_id,
        companyAddress: data.company_address,
        companyInvoiceEmail: data.company_invoice_email,
        companyContactName: data.company_contact_name,
        companyContactPhone: data.company_contact_phone,
      },
    });
  } catch (error) {
    console.error("lookup-submission: route error", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการค้นหาข้อมูลเดิม" },
      { status: 500 }
    );
  }
}
