"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/lib/validation/auth";

export interface AuthActionResult {
  error?: string;
  fieldErrors?: Record<string, string>;
  // Non-sensitive fields only — never echo a password back to the client.
  values?: { displayName?: string; username?: string; email?: string };
}

export async function signUpAction(
  _prev: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const raw = {
    displayName: formData.get("displayName"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const values = {
    displayName: String(raw.displayName ?? ""),
    username: String(raw.username ?? ""),
    email: String(raw.email ?? ""),
  };

  const parsed = signUpSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors, values };
  }

  const supabase = await createClient();
  const { email, password, username, displayName } = parsed.data;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, display_name: displayName },
    },
  });

  if (error) {
    return { error: error.message, values };
  }

  redirect("/dashboard");
}

export async function signInAction(
  _prev: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const values = { email: String(raw.email ?? "") };

  const parsed = signInSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors, values };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "That email and password combination doesn't match our records.", values };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
