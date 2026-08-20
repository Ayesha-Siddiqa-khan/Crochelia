"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { grantCapability, revokeCapability } from "@/lib/db/admin";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (!user.capabilities.includes("admin")) redirect("/dashboard");
  return user;
}

export async function grantCapabilityAction(targetUserId: string, capability: string) {
  await requireAdmin();
  await grantCapability(targetUserId, capability);
  revalidatePath("/admin");
}

export async function revokeCapabilityAction(targetUserId: string, capability: string) {
  await requireAdmin();
  await revokeCapability(targetUserId, capability);
  revalidatePath("/admin");
}
