import {
  MENU_SITES,
  MENU_WEEKS,
  aggregateWeekIngredients,
  formatBaseQty,
  formatRequiredQty,
  type Dish,
  type WeekMenu,
} from "@/lib/menu";

function IngredientTable({ ingredients, pax }: { ingredients: Dish["ingredients"]; pax: number }) {
  return (
    <table className="mt-2 w-full text-left text-sm">
      <thead>
        <tr className="border-b border-line text-xs text-ink-muted">
          <th className="py-2 pr-4 font-medium">Ingredient</th>
          <th className="py-2 pr-4 text-right font-medium">Base Qty (10 Pax)</th>
          <th className="py-2 pr-0 text-right font-medium">Required Qty</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {ingredients.map((ing, i) => (
          <tr key={i}>
            <td className="py-2 pr-4 text-ink-muted">
              {ing.name}
              {ing.remark && <span className="text-ink-muted/70"> · {ing.remark}</span>}
            </td>
            <td className="py-2 pr-4 text-right text-ink-muted">{formatBaseQty(ing.qty10, ing.unit)}</td>
            <td className="py-2 pr-0 text-right font-semibold text-ink">
              {formatRequiredQty(ing.qty10, pax, ing.unit)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DishAccordion({ dish, pax }: { dish: Dish; pax: number }) {
  return (
    <details className="group border-b border-line py-2 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between py-1.5 text-sm font-medium text-ink marker:content-none">
        <span>{dish.dish}</span>
        <span className="text-xs text-ink-muted transition group-open:rotate-180">▾</span>
      </summary>
      <IngredientTable ingredients={dish.ingredients} pax={pax} />
    </details>
  );
}

function MealColumn({ title, dishes, pax }: { title: string; dishes: Dish[]; pax: number }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wide text-ink-muted">{title}</p>
      <div className="mt-2">
        {dishes.map((d, i) => (
          <DishAccordion key={i} dish={d} pax={pax} />
        ))}
      </div>
    </div>
  );
}

function PurchaseList({ menu, pax }: { menu: WeekMenu; pax: number }) {
  const items = aggregateWeekIngredients(menu);
  return (
    <details className="mt-4 rounded-lg bg-paper p-4">
      <summary className="cursor-pointer text-sm font-semibold text-ink">
        Purchase list for Week {menu.week} — all ingredients combined
      </summary>
      <div className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={`${item.name}-${item.unit}`}
            className="flex items-baseline justify-between gap-4 border-b border-line py-1.5 text-sm"
          >
            <span className="text-ink-muted">
              {item.name}
              {item.alsoAsNeeded && item.qty10 !== null && (
                <span className="text-ink-muted/70"> · plus more as needed</span>
              )}
            </span>
            <span className="shrink-0 font-medium text-ink">{formatRequiredQty(item.qty10, pax, item.unit)}</span>
          </div>
        ))}
      </div>
    </details>
  );
}

export default async function IngredientCalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ pax?: string }>;
}) {
  const params = await searchParams;
  const pax = Math.max(1, parseInt(params.pax ?? "100", 10) || 100);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
      <p className="text-sm font-medium text-ink-muted">Signature Solution · UTM + JDT 3 + JDT 4</p>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Ingredient Calculator
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        The full 14-week menu — same rotation used at UTM, JDT 3 and JDT 4 — organised by week, then meal.
        Open any menu to see its ingredients. Quantities come straight from the recipe sheet&apos;s 10-pax
        figures.
      </p>

      {/* The one thing the user actually needs to touch */}
      <form method="get" className="card mt-8 border-2 border-accent p-6">
        <label htmlFor="pax" className="text-sm font-semibold text-ink">
          Number of Pax
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            id="pax"
            name="pax"
            type="number"
            min={1}
            defaultValue={pax}
            className="w-40 rounded-lg border border-line bg-paper-raised px-4 py-3 font-display text-2xl font-semibold text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-ink shadow-sm transition hover:opacity-90"
          >
            Recalculate
          </button>
          <p className="text-sm text-ink-muted">Required Qty = Base Qty (10 pax) ÷ 10 × {pax}</p>
        </div>
      </form>

      {/* Quick jump */}
      <div className="mt-6 flex flex-wrap gap-1.5">
        {MENU_WEEKS.map((w) => (
          <a
            key={w.week}
            href={`#week-${w.week}`}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:bg-paper hover:text-ink"
          >
            Wk {w.week}
          </a>
        ))}
      </div>

      {/* Weeks */}
      <div className="mt-6 space-y-6">
        {MENU_WEEKS.map((menu) => (
          <section key={menu.week} id={`week-${menu.week}`} className="card scroll-mt-4 p-5">
            <h2 className="font-display text-lg font-semibold text-ink">Week {menu.week}</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-3">
              <MealColumn title="Breakfast" dishes={menu.breakfast} pax={pax} />
              <MealColumn title="Lunch" dishes={menu.lunch} pax={pax} />
              <MealColumn title="Dinner" dishes={menu.dinner} pax={pax} />
            </div>
            <PurchaseList menu={menu} pax={pax} />
          </section>
        ))}
      </div>

      <p className="mt-6 text-xs text-ink-muted">
        Menus apply to all three sites — {MENU_SITES.join(", ")} — from the same recipe sheet. Quantities are
        never invented or rounded beyond display.
      </p>
    </div>
  );
}
