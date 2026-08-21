import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert } from "@/lib/supabase/database.types";

export type Pattern = Tables<"patterns">;
export type PatternInsert = TablesInsert<"patterns">;

export interface PatternBrowseFilters {
  projectType?: string;
  difficulty?: string;
}

export type PatternWithCreator = Pattern & {
  profiles: { username: string; display_name: string | null } | null;
};

export async function listPublicPatterns(filters: PatternBrowseFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("patterns")
    .select("*, profiles!patterns_user_id_fkey(username, display_name)")
    .eq("visibility", "public")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (filters.projectType) query = query.eq("project_type", filters.projectType);
  if (filters.difficulty) query = query.eq("difficulty", filters.difficulty);

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as PatternWithCreator[];
}

export async function listMyPatterns(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("patterns")
    .select("*, profiles!patterns_user_id_fkey(username, display_name)")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as unknown as PatternWithCreator[];
}

export async function getPattern(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("patterns")
    .select("*, profiles!patterns_user_id_fkey(username, display_name)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  return data as unknown as PatternWithCreator;
}

export async function createPattern(input: PatternInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("patterns").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function deletePattern(userId: string, id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("patterns")
    .update({ deleted_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("id", id);
  if (error) throw error;
}
