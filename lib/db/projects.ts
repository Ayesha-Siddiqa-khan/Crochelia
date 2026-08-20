import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert } from "@/lib/supabase/database.types";

export type Project = Tables<"projects">;
export type ProjectInsert = TablesInsert<"projects">;

export async function listProjects(userId: string, opts?: { status?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (opts?.status) {
    query = query.eq("status", opts.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getMostRecentActiveProject(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .in("status", ["planning", "in_progress", "paused"])
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getProject(userId: string, projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_pieces(*), project_progress(*), project_materials(*)")
    .eq("user_id", userId)
    .eq("id", projectId)
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  return data;
}

export async function createProject(input: ProjectInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateProjectStatus(userId: string, projectId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("user_id", userId)
    .eq("id", projectId);
  if (error) throw error;
}

export async function archiveProject(userId: string, projectId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ deleted_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("id", projectId);
  if (error) throw error;
}

export async function recordProgress(
  userId: string,
  projectId: string,
  completedSquares: number,
) {
  const supabase = await createClient();

  const { error: progressError } = await supabase.from("project_progress").insert({
    user_id: userId,
    project_id: projectId,
    completed_squares: completedSquares,
  });
  if (progressError) throw progressError;

  const { error: projectError } = await supabase
    .from("projects")
    .update({ completed_squares: completedSquares })
    .eq("user_id", userId)
    .eq("id", projectId);
  if (projectError) throw projectError;
}
