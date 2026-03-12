import { supabase } from "@/lib/supabase";

export async function uploadSignature(base64: string) {
  const blob = await fetch(base64).then((res) => res.blob());

  const fileName = `signature-${Date.now()}.png`;

  const { error } = await supabase.storage
    .from("signatures")
    .upload(fileName, blob, {
      contentType: "image/png",
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("signatures")
    .getPublicUrl(fileName);

  return data.publicUrl;
}