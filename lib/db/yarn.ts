import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

export type YarnStashItem = Tables<"yarn_stash">;
export type YarnStashInsert = TablesInsert<"yarn_stash">;
export type YarnStashUpdate = TablesUpdate<"yarn_stash">;

export async function listYarnStash(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("yarn_stash")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createYarnStashItem(input: YarnStashInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("yarn_stash").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateYarnStashItem(
  userId: string,
  id: string,
  input: YarnStashUpdate,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("yarn_stash")
    .update(input)
    .eq("user_id", userId)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteYarnStashItem(userId: string, id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("yarn_stash")
    .update({ deleted_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("id", id);
  if (error) throw error;
}
