import Link from "next/link";
import { getCurrentMember } from "@/lib/auth";
import { logout } from "@/lib/auth-actions";
import { IconUser } from "@/components/icons";

export default async function Nav() {
  const me = await getCurrentMember();

  return (
    <header className="border-b border-line bg-paper-raised">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-extrabold tracking-tight">Signature Solution</span>
          <span className="hidden text-sm text-ink-muted sm:inline">Daily Ops Hub</span>
        </Link>

        {me && (
          <div className="flex items-center gap-4">
            <Link href="/ingredient-calculator" className="text-sm font-medium text-ink-muted hover:text-ink">
              Ingredient Calculator
            </Link>
            {me.role === "admin" && (
              <Link href="/admin/members" className="text-sm font-medium text-ink-muted hover:text-ink">
                Members
              </Link>
            )}
            <Link
              href="/entry"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink shadow-sm transition hover:opacity-90"
            >
              Add today&apos;s entry
            </Link>

            <div className="flex items-center gap-2 border-l border-line pl-4">
              <span className="flex items-center gap-1.5 text-sm text-ink-muted">
                <IconUser className="h-4 w-4" />
                {me.displayName || me.loginId}
              </span>
              <form action={logout}>
                <button type="submit" className="text-sm font-medium text-ink-muted underline-offset-2 hover:text-ink hover:underline">
                  Log out
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
