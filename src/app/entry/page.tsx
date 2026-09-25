import EntryForm from "@/components/EntryForm";

export default async function EntryPage({
  searchParams,
}: {
  searchParams: Promise<{ outlet?: string }>;
}) {
  const { outlet } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8">
      <p className="text-sm font-medium text-ink-muted">Daily entry</p>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">Log today&apos;s numbers</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Pick the outlet, add today&apos;s sales and what was bought by category. Takes about a minute.
      </p>

      <div className="card mt-8 p-6">
        <EntryForm initialOutletId={outlet} />
      </div>
    </div>
  );
}
