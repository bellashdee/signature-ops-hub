import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth";
import { listMembers } from "@/lib/members-actions";
import MembersManager from "@/components/MembersManager";

export default async function MembersPage() {
  const me = await getCurrentMember();
  if (!me) redirect("/login");
  if (me.role !== "admin") redirect("/");

  const members = await listMembers();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
      <p className="text-sm font-medium text-ink-muted">Signature Solution</p>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Members</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">
        Add, edit, or remove who can sign in. There&apos;s no public sign-up — every account here is created by
        an admin.
      </p>

      <div className="mt-8">
        <MembersManager initialMembers={members} currentUserId={me.id} />
      </div>
    </div>
  );
}
