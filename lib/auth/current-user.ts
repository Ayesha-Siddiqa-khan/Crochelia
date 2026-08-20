import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type Profile = Tables<"profiles">;
export type Capability = "designer" | "seller" | "admin";

export interface CurrentUser {
  id: string;
  email: string | undefined;
  profile: Profile;
  capabilities: Capability[];
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: profile }, { data: capabilities }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_capabilities").select("capability").eq("user_id", user.id),
  ]);

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email,
    profile,
    capabilities: (capabilities ?? []).map((c) => c.capability as Capability),
  };
}
