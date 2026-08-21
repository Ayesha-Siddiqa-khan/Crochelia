"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createProject, archiveProject, recordProgress } from "@/lib/db/projects";
import { createProjectSchema } from "@/lib/validation/project";

export interface ProjectActionResult {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: { name?: string; description?: string };
}

export async function createProjectAction(
  _prev: ProjectActionResult,
  formData: FormData,
): Promise<ProjectActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const raw = {
    name: formData.get("name"),
    type: formData.get("type"),
    description: formData.get("description"),
    size: formData.get("size") || undefined,
    difficulty: formData.get("difficulty") || undefined,
    squareSizeCm: formData.get("squareSizeCm") || undefined,
    hookSizeMm: formData.get("hookSizeMm") || undefined,
    totalSquares: formData.get("totalSquares") || undefined,
  };
  const values = {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
  };

  const parsed = createProjectSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors, values };
  }

  const { name, type, description, size, difficulty, squareSizeCm, hookSizeMm, totalSquares } =
    parsed.data;

  const project = await createProject({
    user_id: user.id,
    name,
    type,
    description: description || null,
    size: size ?? null,
    difficulty: difficulty ?? null,
    square_size_cm: squareSizeCm ?? null,
    hook_size_mm: hookSizeMm ?? null,
    total_squares: totalSquares ?? null,
    currency: user.profile.currency,
  });

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function archiveProjectAction(projectId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  await archiveProject(user.id, projectId);
  revalidatePath("/projects");
  redirect("/projects");
}

export async function recordProgressAction(projectId: string, completedSquares: number) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  await recordProgress(user.id, projectId, completedSquares);
  revalidatePath(`/projects/${projectId}`);
}
