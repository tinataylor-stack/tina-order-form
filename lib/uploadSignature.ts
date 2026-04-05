import { supabaseAdmin } from "@/lib/supabase-admin";

export async function uploadSignature(base64: string) {
  const blob = await fetch(base64).then((res) => res.blob());

  const fileName = `signature-${Date.now()}.png`;

  const { error } = await supabaseAdmin.storage
    .from("signatures")
    .upload(fileName, blob, {
      contentType: "image/png",
    });

  if (error) {
    throw error;
  }

  return fileName;
}
