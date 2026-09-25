"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";
import { resolveLoginEmail, type Role } from "./auth";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { data: member } = await supabase.from("sos_members").select("role").eq("id", user.id).single();
  if (member?.role !== "admin") throw new Error("Only admins can manage members.");

  return user;
}

export type Member = {
  id: string;
  loginId: string;
  displayName: string | null;
  role: Role;
  createdAt: string;
};

export async function listMembers(): Promise<Member[]> {
  await requireAdmin();
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("sos_members")
    .select("id, login_id, display_name, role, created_at")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    loginId: row.login_id,
    displayName: row.display_name,
    role: row.role as Role,
    createdAt: row.created_at,
  }));
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function addMember(input: {
  loginId: string;
  password: string;
  displayName: string;
  role: Role;
}): Promise<ActionResult> {
  await requireAdmin();

  const loginId = input.loginId.trim();
  if (!loginId || !input.password) {
    return { ok: false, error: "Username/email and password are required." };
  }
  if (input.password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const admin = createAdminClient();
  const email = resolveLoginEmail(loginId);

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
  });
  if (error || !data.user) {
    return { ok: false, error: error?.message ?? "Could not create the account." };
  }

  const { error: insertError } = await admin.from("sos_members").insert({
    id: data.user.id,
    login_id: loginId,
    display_name: input.displayName.trim() || loginId,
    role: input.role,
  });
  if (insertError) {
    await admin.auth.admin.deleteUser(data.user.id); // roll back the auth user
    return { ok: false, error: insertError.message };
  }

  revalidatePath("/admin/members");
  return { ok: true };
}

export async function updateMember(
  id: string,
  input: { password?: string; displayName?: string; role?: Role }
): Promise<ActionResult> {
  await requireAdmin();
  const admin = createAdminClient();

  if (input.password) {
    if (input.password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }
    const { error } = await admin.auth.admin.updateUserById(id, { password: input.password });
    if (error) return { ok: false, error: error.message };
  }

  const patch: Record<string, string> = {};
  if (input.displayName !== undefined) patch.display_name = input.displayName.trim();
  if (input.role !== undefined) patch.role = input.role;

  if (Object.keys(patch).length > 0) {
    const { error } = await admin.from("sos_members").update(patch).eq("id", id);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/admin/members");
  return { ok: true };
}

export async function deleteMember(id: string): Promise<ActionResult> {
  const caller = await requireAdmin();
  if (caller.id === id) {
    return { ok: false, error: "You can't remove your own account." };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { ok: false, error: error.message };

  await admin.from("sos_members").delete().eq("id", id);

  revalidatePath("/admin/members");
  return { ok: true };
}
