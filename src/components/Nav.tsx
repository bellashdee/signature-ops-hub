import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-line bg-paper-raised">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-extrabold tracking-tight">Signature Solution</span>
          <span className="hidden text-sm text-ink-muted sm:inline">Daily Ops Hub</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/ingredient-calculator" className="text-sm font-medium text-ink-muted hover:text-ink">
            Ingredient Calculator
          </Link>
          <Link
            href="/entry"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink shadow-sm transition hover:opacity-90"
          >
            Add today&apos;s entry
          </Link>
        </div>
      </div>
    </header>
  );
}
