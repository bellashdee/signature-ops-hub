import rawWeeks from "./menu-data.json";

// This 14-week rotation is one shared menu (from "MENU UTM, JDT 3, JDT 4.xlsx"),
// prepared by Signature Solution and served at all three client sites below.
// Quantities in the source file are given per 10 PAX — everything here scales from that.
export const MENU_SITES = ["UTM", "JDT 3", "JDT 4"] as const;
export type MenuSite = (typeof MENU_SITES)[number];

// Reused for sorting — constructing an Intl.Collator per comparison is expensive.
const collator = new Intl.Collator("en-MY");

export type Ingredient = {
  name: string;
  qty10: number | null;
  unit: string | null;
  remark: string | null;
};

export type Dish = {
  dish: string;
  ingredients: Ingredient[];
};

export type WeekMenu = {
  week: number;
  breakfast: Dish[];
  lunch: Dish[];
  dinner: Dish[];
};

export const MENU_WEEKS = rawWeeks as WeekMenu[];

export function getWeekMenu(week: number): WeekMenu | undefined {
  return MENU_WEEKS.find((w) => w.week === week);
}

export type PurchaseItem = {
  name: string;
  unit: string | null;
  qty10: number | null;
  /** True if this ingredient also appears somewhere with no fixed quantity ("as needed"). */
  alsoAsNeeded: boolean;
};

/**
 * The full purchase list for one week's menu (all meals combined) — how much of each
 * ingredient (bahan) to buy in total, grouped by name + unit and summed across every
 * dish. This is the "how much to purchase for 1 menu [week]" view.
 */
type Accumulator = { name: string; unit: string | null; qty10Sum: number; alsoAsNeeded: boolean; hasNumeric: boolean };

export function aggregateWeekIngredients(menu: WeekMenu): PurchaseItem[] {
  const groups = new Map<string, Accumulator>();
  for (const dish of [...menu.breakfast, ...menu.lunch, ...menu.dinner]) {
    for (const ing of dish.ingredients) {
      const key = `${ing.name}||${ing.unit ?? ""}`;
      const existing = groups.get(key);
      if (!existing) {
        groups.set(key, {
          name: ing.name,
          unit: ing.unit,
          qty10Sum: ing.qty10 ?? 0,
          alsoAsNeeded: ing.qty10 === null,
          hasNumeric: ing.qty10 !== null,
        });
      } else {
        if (ing.qty10 === null) {
          existing.alsoAsNeeded = true;
        } else {
          existing.qty10Sum += ing.qty10;
          existing.hasNumeric = true;
        }
      }
    }
  }
  return Array.from(groups.values())
    .map(({ hasNumeric, qty10Sum, ...item }) => ({ ...item, qty10: hasNumeric ? qty10Sum : null }))
    .sort((a, b) => collator.compare(a.name, b.name));
}

// --- Ingredient Calculator -------------------------------------------------

const UNIT_LABELS: Record<string, string> = {
  GM: "g",
  KG: "kg",
  ML: "ml",
  L: "L",
  LITER: "L",
  PCS: "pcs",
  BIJI: "biji",
  BTL: "btl",
};

// Reused across every call — constructing an Intl.NumberFormat is expensive, and this
// page formats thousands of quantities per render (14 weeks × ~65 ingredient lines).
const numberFormatter = new Intl.NumberFormat("en-MY", { maximumFractionDigits: 2 });

function roundNice(n: number): string {
  return numberFormatter.format(Math.round(n * 100) / 100);
}

/** The literal recipe quantity for 10 pax, exactly as given in the Excel file — never converted. */
export function formatBaseQty(qty10: number | null, unit: string | null): string {
  if (qty10 === null) return "As needed";
  const label = unit ? (UNIT_LABELS[unit.toUpperCase()] ?? unit.toLowerCase()) : "";
  return `${roundNice(qty10)}${label ? ` ${label}` : ""}`;
}

/**
 * Required quantity = base qty (per 10 pax) ÷ 10 × pax — the only lever is pax, per the
 * recipe's own ratio. Once the scaled amount passes 1000 g/ml, it's shown in kg/L instead,
 * purely for readability; the underlying number is untouched.
 */
export function formatRequiredQty(qty10: number | null, pax: number, unit: string | null): string {
  if (qty10 === null) return "As needed";
  const raw = (qty10 / 10) * pax;
  const u = unit ? unit.toUpperCase() : "";

  if (u === "GM" && raw > 1000) return `${roundNice(raw / 1000)} kg`;
  if (u === "ML" && raw > 1000) return `${roundNice(raw / 1000)} L`;

  const label = u ? (UNIT_LABELS[u] ?? unit!.toLowerCase()) : "";
  return `${roundNice(raw)}${label ? ` ${label}` : ""}`;
}
