"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  OUTLETS,
  TODAY,
  CATEGORY_META,
  CATEGORY_GROUP_ORDER,
  formatRM,
  type CategoryCode,
} from "@/lib/sample-data";
import { saveEntry } from "@/lib/actions";

export default function EntryForm({ initialOutletId }: { initialOutletId?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [outletId, setOutletId] = useState(initialOutletId && OUTLETS.some((o) => o.id === initialOutletId) ? initialOutletId : OUTLETS[0].id);
  const [date, setDate] = useState(TODAY);
  const [sales, setSales] = useState("");
  const [costs, setCosts] = useState<Record<string, string>>({});
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<{ outlet: string; date: string; total: number } | null>(null);

  const outlet = OUTLETS.find((o) => o.id === outletId)!;

  const groupedCategories = useMemo(() => {
    const groups: Record<string, CategoryCode[]> = {};
    for (const group of CATEGORY_GROUP_ORDER) {
      const codes = outlet.categories.filter((c) => CATEGORY_META[c].group === group);
      if (codes.length > 0) groups[group] = codes;
    }
    return groups;
  }, [outlet]);

  const totalCost = Object.values(costs).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
  const salesNum = parseFloat(sales) || 0;
  const pct = salesNum > 0 ? totalCost / salesNum : null;

  function selectOutlet(id: string) {
    setOutletId(id);
    setCosts({});
    setError(null);
    setSaved(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const numericCosts: Partial<Record<CategoryCode, number>> = {};
    for (const [code, value] of Object.entries(costs)) {
      const amount = parseFloat(value);
      if (amount > 0) numericCosts[code as CategoryCode] = amount;
    }

    startTransition(async () => {
      const result = await saveEntry({ outletId, date, sales: salesNum, costs: numericCosts, remarks });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved({ outlet: outlet.name, date, total: result.total });
      router.refresh();
    });
  }

  if (saved) {
    return (
      <div className="rounded-lg bg-positive-soft p-5">
        <p className="font-medium text-ink">Entry saved for {saved.outlet}, {date}.</p>
        <p className="mt-1 text-sm text-ink-muted">
          Total cost logged: {formatRM(saved.total)}. The dashboard and outlet page are already up to date —
          have a look.
        </p>
        <button
          onClick={() => {
            setSaved(null);
            setSales("");
            setCosts({});
            setRemarks("");
          }}
          className="mt-4 rounded-lg border border-line bg-paper-raised px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper"
        >
          Add another entry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Outlet picker */}
      <div>
        <label className="text-sm font-semibold text-ink">Outlet</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {OUTLETS.map((o) => (
            <button
              type="button"
              key={o.id}
              onClick={() => selectOutlet(o.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                o.id === outletId
                  ? "border-accent bg-accent text-accent-ink shadow-sm"
                  : "border-line text-ink-muted hover:border-accent hover:text-ink"
              }`}
            >
              {o.name}
            </button>
          ))}
        </div>
      </div>

      {/* Date + sales */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-lg border border-line bg-paper-raised px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="sales">
            Today&apos;s sales (RM)
          </label>
          <input
            id="sales"
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={sales}
            onChange={(e) => setSales(e.target.value)}
            className="mt-2 w-full rounded-lg border border-line bg-paper-raised px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
          />
        </div>
      </div>

      {/* Category costs */}
      {Object.entries(groupedCategories).map(([group, codes]) => (
        <div key={group}>
          <p className="text-sm font-semibold text-ink">{group}</p>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {codes.map((code) => (
              <div key={code}>
                <label className="text-xs font-medium text-ink-muted" htmlFor={code}>
                  {CATEGORY_META[code].label}
                </label>
                <div className="mt-1 flex items-center rounded-lg border border-line bg-paper-raised px-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft">
                  <span className="text-xs text-ink-muted">RM</span>
                  <input
                    id={code}
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={costs[code] ?? ""}
                    onChange={(e) => setCosts((prev) => ({ ...prev, [code]: e.target.value }))}
                    className="w-full bg-transparent px-2 py-2 text-sm text-ink outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Remarks */}
      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="remarks">
          Remarks <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={3}
          placeholder="Anything the boss should know — a big order, a broken fridge, a supplier price hike…"
          className="mt-2 w-full rounded-lg border border-line bg-paper-raised px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
      </div>

      {/* Live total */}
      <div className="rounded-lg bg-paper p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-muted">Total cost entered</span>
          <span className="font-display text-xl font-semibold text-ink">{formatRM(totalCost)}</span>
        </div>
        {pct !== null && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-ink-muted">Cost vs sales for today</span>
            <span className={`font-medium ${pct > outlet.costTargetPct ? "text-negative" : "text-positive"}`}>
              {(pct * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {error && <p className="text-sm font-medium text-negative">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-ink shadow-sm transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {isPending ? "Saving…" : "Save entry"}
      </button>
    </form>
  );
}
