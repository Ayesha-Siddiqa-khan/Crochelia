import { createClient } from "@/lib/supabase/server";

export interface PlatformStats {
  total_users: number;
  total_projects: number;
  active_projects: number;
  total_yarn_items: number;
  sellers: number;
  designers: number;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_platform_stats");
  if (error) throw error;
  return data as unknown as PlatformStats;
}

export async function listAllUsers() {
  const supabase = await createClient();
  const [{ data: profiles, error }, { data: capabilities, error: capError }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("user_capabilities").select("user_id, capability"),
  ]);
  if (error) throw error;
  if (capError) throw capError;

  const capsByUser = new Map<string, string[]>();
  for (const row of capabilities ?? []) {
    const list = capsByUser.get(row.user_id) ?? [];
    list.push(row.capability);
    capsByUser.set(row.user_id, list);
  }

  return (profiles ?? []).map((profile) => ({
    ...profile,
    capabilities: capsByUser.get(profile.id) ?? [],
  }));
}

export async function grantCapability(targetUserId: string, capability: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_grant_capability", {
    target_user_id: targetUserId,
    cap: capability,
  });
  if (error) throw error;
}

export async function revokeCapability(targetUserId: string, capability: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_revoke_capability", {
    target_user_id: targetUserId,
    cap: capability,
  });
  if (error) throw error;
}
