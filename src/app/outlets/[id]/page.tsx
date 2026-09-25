import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getOutlet,
  entriesForOutlet,
  totalCostForOutlet,
  costPercentForOutlet,
  salesToDateForOutlet,
  categoryTotalsForOutlet,
  formatRM,
  formatDateLong,
  formatDateShort,
  CATEGORY_META,
} from "@/lib/sample-data";
import { IconCoins, IconReceipt, IconGauge, IconStorefront } from "@/components/icons";

function pctLabel(pct: number) {
  return `${(pct * 100).toFixed(0)}%`;
}

export default async function OutletPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const outlet = getOutlet(id);
  if (!outlet) notFound();

  const entries = entriesForOutlet(id);
  const cost = totalCostForOutlet(id);
  const pct = costPercentForOutlet(id);
  const sales = salesToDateForOutlet(id);
  const categories = categoryTotalsForOutlet(id);
  const maxCategory = categories[0]?.amount ?? 1;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
      <Link href="/" className="text-sm font-medium text-ink-muted hover:text-ink">
        ← All outlets
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <IconStorefront className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-medium text-ink-muted">{outlet.type}</p>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">{outlet.name}</h1>
            <p className="text-sm text-ink-muted">{outlet.legalName}</p>
          </div>
        </div>
        <Link
          href={`/entry?outlet=${outlet.id}`}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink shadow-sm transition hover:opacity-90"
        >
          Add entry for {outlet.name}
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <IconCoins className="h-5 w-5" />
          </span>
          <p className="mt-3 text-xs font-medium text-ink-muted">Sales to date ({formatDateShort(outlet.salesAsOf)})</p>
          <p className="mt-0.5 font-display text-2xl font-semibold text-ink">{formatRM(sales)}</p>
        </div>
        <div className="card p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <IconReceipt className="h-5 w-5" />
          </span>
          <p className="mt-3 text-xs font-medium text-ink-muted">Cost to date</p>
          <p className="mt-0.5 font-display text-2xl font-semibold text-ink">{formatRM(cost)}</p>
        </div>
        <div className="card p-5">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              pct > outlet.costTargetPct ? "bg-negative-soft text-negative" : "bg-positive-soft text-positive"
            }`}
          >
            <IconGauge className="h-5 w-5" />
          </span>
          <p className="mt-3 text-xs font-medium text-ink-muted">Cost vs sales · target {pctLabel(outlet.costTargetPct)}</p>
          <p className={`mt-0.5 font-display text-2xl font-semibold ${pct > outlet.costTargetPct ? "text-negative" : "text-positive"}`}>
            {pctLabel(pct)}
          </p>
        </div>
      </div>

      {/* Category breakdown */}
      <h2 className="mt-10 font-display text-lg font-semibold text-ink">Where the money went</h2>
      <div className="card mt-4 p-5">
        <div className="space-y-3">
          {categories.map(({ code, amount }) => (
            <div key={code} className="flex items-center gap-4 text-sm">
              <span className="w-40 shrink-0 text-ink-muted">{CATEGORY_META[code].label}</span>
              <div className="h-2 flex-1 rounded-full bg-paper">
                <div
                  className="h-2 rounded-full bg-accent"
                  style={{ width: `${Math.max(3, (amount / maxCategory) * 100)}%` }}
                />
              </div>
              <span className="w-28 shrink-0 text-right font-medium text-ink">{formatRM(amount)}</span>
              <span className="w-12 shrink-0 text-right text-ink-muted">{pctLabel(amount / sales)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily log */}
      <h2 className="mt-10 font-display text-lg font-semibold text-ink">Daily log</h2>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-ink-muted">
              <th className="py-3 pr-4 pl-5 font-medium">Date</th>
              <th className="py-3 pr-4 font-medium">Top category</th>
              <th className="py-3 pr-4 font-medium">Remarks</th>
              <th className="py-3 pr-4 text-right font-medium">Sales</th>
              <th className="py-3 pr-5 text-right font-medium">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {entries.map((entry) => {
              const top = (Object.entries(entry.costs) as [keyof typeof CATEGORY_META, number][]).sort(
                (a, b) => b[1] - a[1]
              )[0];
              return (
                <tr key={entry.date} className="hover:bg-paper">
                  <td className="py-3 pr-4 pl-5 whitespace-nowrap text-ink">{formatDateLong(entry.date)}</td>
                  <td className="py-3 pr-4 text-ink-muted">{top ? CATEGORY_META[top[0]].label : "—"}</td>
                  <td className="py-3 pr-4 text-ink-muted">{entry.remarks ?? "—"}</td>
                  <td className="py-3 pr-4 text-right text-ink-muted">
                    {typeof entry.sales === "number" ? formatRM(entry.sales) : "—"}
                  </td>
                  <td className="py-3 pr-5 text-right font-semibold text-ink">{formatRM(entry.total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
