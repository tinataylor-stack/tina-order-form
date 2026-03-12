import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { uploadSignature } from "@/lib/uploadSignature";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      course,
      firstName,
      lastName,
      nickname,
      email,
      phone,
      paymentMethod,
      otherPaymentMethod,
      birthDate,
      occupation,
      otherOccupation,
      businessDescription,
      wantsInvoice,
      invoiceType,
      personalTaxName,
      personalTaxId,
      personalAddress,
      personalInvoiceEmail,
      companyName,
      companyTaxId,
      companyAddress,
      companyInvoiceEmail,
      companyContactName,
      companyContactPhone,
      acceptedTerms,
      signatureData,
    } = body;

    const fullName = `${firstName || ""} ${lastName || ""}`.trim();

    const finalPaymentMethod =
      paymentMethod === "other" ? otherPaymentMethod : paymentMethod;

    const finalOccupation =
      occupation === "other"
        ? otherOccupation
        : occupation === "business-owner"
        ? "เจ้าของกิจการ / พ่อค้าแม่ค้าออนไลน์"
        : occupation;

    let signatureUrl: string | null = null;

    if (signatureData) {
      signatureUrl = await uploadSignature(signatureData);
    }

    const { error } = await supabase.from("form_submissions").insert([
      {
        name: fullName,
        email,
        course,
        first_name: firstName,
        last_name: lastName,
        nickname,
        phone,
        payment_method: finalPaymentMethod,
        birth_date: birthDate,
        occupation: finalOccupation,
        business_description: businessDescription,
        wants_invoice: wantsInvoice,
        invoice_type: invoiceType,
        personal_tax_name: personalTaxName,
        personal_tax_id: personalTaxId,
        personal_address: personalAddress,
        personal_invoice_email: personalInvoiceEmail,
        company_name: companyName,
        company_tax_id: companyTaxId,
        company_address: companyAddress,
        company_invoice_email: companyInvoiceEmail,
        company_contact_name: companyContactName,
        company_contact_phone: companyContactPhone,
        accepted_terms: acceptedTerms,
        signature_url: signatureUrl,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "ส่งข้อมูลเรียบร้อยแล้ว",
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}