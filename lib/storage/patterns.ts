import { createClient } from "@/lib/supabase/server";
import { detectImageType, MAX_IMAGE_BYTES } from "@/lib/storage/validate-image";

export class ImageUploadError extends Error {}

export async function uploadPatternImage(userId: string, file: File): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ImageUploadError("Image must be under 5MB.");
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const detected = detectImageType(buffer);
  if (!detected) {
    throw new ImageUploadError("Only PNG, JPEG, or WEBP images are allowed.");
  }

  const supabase = await createClient();
  const path = `${userId}/${crypto.randomUUID()}.${detected.ext}`;

  const { error } = await supabase.storage
    .from("pattern-images")
    .upload(path, buffer, { contentType: detected.mime, upsert: false });

  if (error) throw new ImageUploadError(error.message);

  const { data } = supabase.storage.from("pattern-images").getPublicUrl(path);
  return data.publicUrl;
}
