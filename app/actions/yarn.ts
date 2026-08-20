"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createYarnStashItem, deleteYarnStashItem } from "@/lib/db/yarn";
import { yarnStashSchema } from "@/lib/validation/yarn";

export interface YarnActionResult {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createYarnStashAction(
  _prev: YarnActionResult,
  formData: FormData,
): Promise<YarnActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const parsed = yarnStashSchema.safeParse({
    name: formData.get("name"),
    brand: formData.get("brand"),
    colorName: formData.get("colorName"),
    colorSwatchHex: formData.get("colorSwatchHex"),
    weightClass: formData.get("weightClass"),
    fiber: formData.get("fiber"),
    totalGrams: formData.get("totalGrams"),
    remainingGrams: formData.get("remainingGrams"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  if (parsed.data.remainingGrams > parsed.data.totalGrams) {
    return { fieldErrors: { remainingGrams: "Can't be more than the total you started with." } };
  }

  await createYarnStashItem({
    user_id: user.id,
    name: parsed.data.name,
    brand: parsed.data.brand || null,
    color_name: parsed.data.colorName,
    color_swatch_hex: parsed.data.colorSwatchHex || null,
    weight_class: parsed.data.weightClass,
    fiber: parsed.data.fiber || null,
    total_grams: parsed.data.totalGrams,
    remaining_grams: parsed.data.remainingGrams,
    notes: parsed.data.notes || null,
    currency: user.profile.currency,
  });

  revalidatePath("/yarn");
  return {};
}

export async function deleteYarnStashAction(id: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  await deleteYarnStashItem(user.id, id);
  revalidatePath("/yarn");
}
