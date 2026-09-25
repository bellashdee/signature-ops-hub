"use server";

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { resolveLoginEmail } from "./auth";

export type LoginState = { error: string | null };

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const loginId = String(formData.get("loginId") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!loginId || !password) {
    return { error: "Enter your username (or email) and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: resolveLoginEmail(loginId),
    password,
  });

  if (error) {
    return { error: "That username/email or password isn't right." };
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
