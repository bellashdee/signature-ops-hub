import { createClient } from "./supabase/server";

export type Role = "admin" | "user";

export type CurrentMember = {
  id: string;
  loginId: string;
  displayName: string | null;
  role: Role;
};

/**
 * Members log in with either a real email (the admin) or a bare username (everyone
 * else). Supabase Auth itself only understands email addresses, so a bare username is
 * mapped to a synthetic, never-emailed address under a fixed internal domain.
 */
export function resolveLoginEmail(loginId: string): string {
  const trimmed = loginId.trim();
  if (trimmed.includes("@")) return trimmed.toLowerCase();
  const domain = process.env.MEMBERS_LOGIN_DOMAIN ?? "members.internal";
  return `${trimmed.toLowerCase()}@${domain}`;
}

export async function getCurrentMember(): Promise<CurrentMember | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member } = await supabase
    .from("sos_members")
    .select("login_id, display_name, role")
    .eq("id", user.id)
    .single();

  if (!member) return null;

  return {
    id: user.id,
    loginId: member.login_id,
    displayName: member.display_name,
    role: member.role as Role,
  };
}
