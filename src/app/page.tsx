import Link from "next/link";
import {
  OUTLETS,
  companyTotals,
  costPercentForOutlet,
  totalCostForOutlet,
  salesToDateForOutlet,
  categoryTotalsForOutlet,
  lastEntryDateForOutlet,
  daysSince,
  formatRM,
  formatDateLong,
  CATEGORY_META,
} from "@/lib/sample-data";
import { IconCoins, IconReceipt, IconGauge, IconAlert, IconStorefront, IconArrowRight } from "@/components/icons";

function pctLabel(pct: number) {
  return `${(pct * 100).toFixed(0)}%`;
}

export default function DashboardPage() {
  const totals = companyTotals();

  const outletStats = OUTLETS.map((outlet) => {
    const cost = totalCostForOutlet(outlet.id);
    const pct = costPercentForOutlet(outlet.id);
    const lastEntry = lastEntryDateForOutlet(outlet.id);
    const gapDays = lastEntry ? daysSince(lastEntry) : null;
    const topCategory = categoryTotalsForOutlet(outlet.id)[0];
    return { outlet, cost, pct, lastEntry, gapDays, topCategory };
  });

  const worst = [...outletStats].sort((a, b) => b.pct - a.pct)[0];
  const best = [...outletStats].sort((a, b) => a.pct - b.pct)[0];
  const staleOutlets = outletStats.filter((s) => (s.gapDays ?? 0) >= 5);
  const overTargetOutlets = outletStats.filter((s) => s.pct > s.outlet.costTargetPct);
  const needsAttentionCount = new Set([...staleOutlets, ...overTargetOutlets].map((s) => s.outlet.id)).size;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
      <p className="text-sm font-medium text-ink-muted">Month to date · 3 outlets</p>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Monthly Costing Summary
      </h1>

      {/* Hero stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<IconCoins className="h-5 w-5" />} label="Total sales" value={formatRM(totals.totalSales)} />
        <StatCard icon={<IconReceipt className="h-5 w-5" />} label="Total cost" value={formatRM(totals.totalCost)} />
        <StatCard
          icon={<IconGauge className="h-5 w-5" />}
          label="Cost vs sales"
          value={pctLabel(totals.costPercent)}
          tone={totals.costPercent > 0.4 ? "negative" : "positive"}
        />
        <StatCard
          icon={<IconAlert className="h-5 w-5" />}
          label="Need a look"
          value={String(needsAttentionCount)}
          tone={needsAttentionCount > 0 ? "negative" : undefined}
        />
      </div>

      {/* Headline insight, grounded in the real spread between outlets */}
      {worst.pct > best.pct + 0.1 && (
        <div className="card mt-6 flex gap-3 border-l-4 border-l-negative p-5">
          <IconAlert className="mt-0.5 h-5 w-5 shrink-0 text-negative" />
          <p className="text-sm leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink">{worst.outlet.name}</span> is spending{" "}
            <span className="font-semibold text-ink">{pctLabel(worst.pct)}</span> of sales on cost this month —
            well above {best.outlet.name} at {pctLabel(best.pct)}.{" "}
            {worst.topCategory && (
              <>
                Biggest driver: {CATEGORY_META[worst.topCategory.code].label} (
                {formatRM(worst.topCategory.amount)}).
              </>
            )}
          </p>
        </div>
      )}

      {/* Outlets */}
      <h2 className="mt-12 font-display text-lg font-semibold text-ink">Outlets</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {outletStats.map(({ outlet, cost, pct, lastEntry, gapDays, topCategory }) => (
          <Link
            key={outlet.id}
            href={`/outlets/${outlet.id}`}
            className="card group flex flex-col p-5 transition hover:border-accent/40 hover:shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <IconStorefront className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-medium text-ink-muted">{outlet.type}</p>
                <h3 className="font-display text-base font-semibold text-ink">{outlet.name}</h3>
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <p
                  className={`font-display text-3xl font-semibold ${
                    pct > outlet.costTargetPct ? "text-negative" : "text-positive"
                  }`}
                >
                  {pctLabel(pct)}
                </p>
                <p className="text-xs text-ink-muted">cost vs sales</p>
              </div>
              {gapDays !== null && gapDays >= 5 && (
                <span className="rounded-full bg-negative-soft px-2.5 py-1 text-xs font-medium text-negative">
                  {gapDays}d quiet
                </span>
              )}
            </div>

            <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm text-ink-muted">
              <p className="flex justify-between">
                <span>Sales</span> <span className="font-medium text-ink">{formatRM(salesToDateForOutlet(outlet.id))}</span>
              </p>
              <p className="flex justify-between">
                <span>Cost</span> <span className="font-medium text-ink">{formatRM(cost)}</span>
              </p>
              {topCategory && (
                <p className="flex justify-between gap-2">
                  <span className="shrink-0">Top spend</span>
                  <span className="truncate text-right font-medium text-ink">
                    {CATEGORY_META[topCategory.code].label} · {formatRM(topCategory.amount)}
                  </span>
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
              <span>{lastEntry ? `Last entry ${formatDateLong(lastEntry)}` : "No entries yet"}</span>
              <span className="flex items-center gap-1 font-medium text-accent">
                View outlet
                <IconArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Needs attention */}
      {(staleOutlets.length > 0 || overTargetOutlets.length > 0) && (
        <>
          <h2 className="mt-12 font-display text-lg font-semibold text-ink">Needs attention</h2>
          <div className="card mt-4 divide-y divide-line">
            {overTargetOutlets.map(({ outlet, pct }) => (
              <div key={`over-${outlet.id}`} className="flex items-center gap-3 px-5 py-4">
                <IconGauge className="h-4.5 w-4.5 shrink-0 text-negative" />
                <span className="flex-1 text-sm text-ink-muted">
                  <span className="font-medium text-ink">{outlet.name}</span> is over its{" "}
                  {pctLabel(outlet.costTargetPct)} cost target
                </span>
                <span className="rounded-full bg-negative-soft px-2.5 py-1 text-xs font-semibold text-negative">
                  {pctLabel(pct)}
                </span>
              </div>
            ))}
            {staleOutlets.map(({ outlet, gapDays }) => (
              <div key={`stale-${outlet.id}`} className="flex items-center gap-3 px-5 py-4">
                <IconAlert className="h-4.5 w-4.5 shrink-0 text-negative" />
                <span className="flex-1 text-sm text-ink-muted">
                  <span className="font-medium text-ink">{outlet.name}</span> hasn&apos;t logged a purchase in a
                  while
                </span>
                <span className="rounded-full bg-negative-soft px-2.5 py-1 text-xs font-semibold text-negative">
                  {gapDays} days
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "negative" | "positive";
}) {
  return (
    <div className="card p-5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          tone === "negative"
            ? "bg-negative-soft text-negative"
            : tone === "positive"
              ? "bg-positive-soft text-positive"
              : "bg-accent-soft text-accent"
        }`}
      >
        {icon}
      </span>
      <p className="mt-3 text-xs font-medium text-ink-muted">{label}</p>
      <p
        className={`mt-0.5 font-display text-2xl font-semibold ${
          tone === "negative" ? "text-negative" : tone === "positive" ? "text-positive" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
