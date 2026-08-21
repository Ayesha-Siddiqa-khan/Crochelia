"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createPattern, deletePattern } from "@/lib/db/patterns";
import { patternSchema, type PatternInput } from "@/lib/validation/pattern";
import { uploadPatternImage, ImageUploadError } from "@/lib/storage/patterns";

export interface PatternActionResult {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Partial<PatternInput>;
}

export async function createPatternAction(
  _prev: PatternActionResult,
  formData: FormData,
): Promise<PatternActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    projectType: formData.get("projectType") || undefined,
    difficulty: formData.get("difficulty") || undefined,
    technique: formData.get("technique"),
    yarnWeight: formData.get("yarnWeight") || undefined,
    hookSizeMm: formData.get("hookSizeMm") || undefined,
    gauge: formData.get("gauge"),
    materials: formData.get("materials"),
    abbreviations: formData.get("abbreviations"),
    instructions: formData.get("instructions"),
    notes: formData.get("notes"),
    visibility: formData.get("visibility") || "private",
  };

  const values: Partial<PatternInput> = {
    name: String(raw.name ?? ""),
    description: String(raw.description ?? ""),
    technique: String(raw.technique ?? ""),
    gauge: String(raw.gauge ?? ""),
    materials: String(raw.materials ?? ""),
    abbreviations: String(raw.abbreviations ?? ""),
    instructions: String(raw.instructions ?? ""),
    notes: String(raw.notes ?? ""),
    visibility: (raw.visibility as PatternInput["visibility"]) ?? "private",
  };

  const parsed = patternSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors, values };
  }

  let imageUrl: string | null = null;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      imageUrl = await uploadPatternImage(user.id, imageFile);
    } catch (err) {
      const message = err instanceof ImageUploadError ? err.message : "Couldn't upload that image.";
      return { fieldErrors: { image: message }, values };
    }
  }

  const d = parsed.data;
  const pattern = await createPattern({
    user_id: user.id,
    name: d.name,
    description: d.description || null,
    project_type: d.projectType || null,
    difficulty: d.difficulty || null,
    technique: d.technique || null,
    yarn_weight: d.yarnWeight || null,
    hook_size_mm: d.hookSizeMm ?? null,
    gauge: d.gauge || null,
    materials: d.materials || null,
    abbreviations: d.abbreviations || null,
    instructions: d.instructions,
    notes: d.notes || null,
    visibility: d.visibility,
    origin: "human",
    image_url: imageUrl,
  });

  revalidatePath("/patterns");
  redirect(`/patterns/${pattern.id}`);
}

export async function deletePatternAction(id: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  await deletePattern(user.id, id);
  revalidatePath("/patterns");
  redirect("/patterns");
}
