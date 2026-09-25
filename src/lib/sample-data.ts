// Sample data for the Interface phase.
// Shaped from the group's real September 2026 costing sheets (per-brand Excel
// files, one tab per month) so the screens reflect how the business actually
// tracks spend today. Swapped for live entries once Supabase is connected.

export type CategoryCode =
  | "AYAM"
  | "IKAN"
  | "SEAFOOD"
  | "DAGING"
  | "EGG"
  | "SAYUR"
  | "BUAH"
  | "BERAS"
  | "BAKERY"
  | "KUIH"
  | "FROZEN"
  | "GROCERIES"
  | "PASTE"
  | "ICE"
  | "GAS"
  | "EQUIPMENT_PACKAGING"
  | "TRANSPORT"
  | "OTHER";

export type CategoryGroup = "Proteins" | "Produce" | "Pantry" | "Operating";

export const CATEGORY_META: Record<CategoryCode, { label: string; group: CategoryGroup }> = {
  AYAM: { label: "Chicken", group: "Proteins" },
  IKAN: { label: "Fish", group: "Proteins" },
  SEAFOOD: { label: "Seafood", group: "Proteins" },
  DAGING: { label: "Beef & meat", group: "Proteins" },
  EGG: { label: "Eggs", group: "Proteins" },
  SAYUR: { label: "Vegetables", group: "Produce" },
  BUAH: { label: "Fruit", group: "Produce" },
  BERAS: { label: "Rice", group: "Pantry" },
  BAKERY: { label: "Bakery", group: "Pantry" },
  KUIH: { label: "Kuih", group: "Pantry" },
  FROZEN: { label: "Frozen goods", group: "Pantry" },
  GROCERIES: { label: "Groceries", group: "Pantry" },
  PASTE: { label: "Cooking paste", group: "Pantry" },
  ICE: { label: "Ice", group: "Operating" },
  GAS: { label: "Gas", group: "Operating" },
  EQUIPMENT_PACKAGING: { label: "Equipment & packaging", group: "Operating" },
  TRANSPORT: { label: "Transport & delivery", group: "Operating" },
  OTHER: { label: "Other", group: "Operating" },
};

export const CATEGORY_GROUP_ORDER: CategoryGroup[] = ["Proteins", "Produce", "Pantry", "Operating"];

export type Outlet = {
  id: string;
  name: string;
  legalName: string;
  type: "Catering" | "Restaurant";
  categories: CategoryCode[];
  /** Cumulative sales for the month, as last reported in the outlet's own sheet. */
  salesToDate: number;
  /** The date that sales figure was last updated — usually by whoever runs the report. */
  salesAsOf: string;
  /** Rough food-cost target this business type aims to stay under. */
  costTargetPct: number;
};

export const OUTLETS: Outlet[] = [
  {
    id: "signature-solution",
    name: "Signature Solution",
    legalName: "Signature Solution Sdn Bhd",
    type: "Catering",
    categories: ["AYAM", "DAGING", "EGG", "SAYUR", "BUAH", "BERAS", "BAKERY", "FROZEN", "GROCERIES", "GAS", "EQUIPMENT_PACKAGING", "TRANSPORT", "OTHER"],
    salesToDate: 66617,
    salesAsOf: "2026-09-18",
    costTargetPct: 0.35,
  },
  {
    id: "kasturi-indah",
    name: "Kasturi Indah",
    legalName: "Kasturi Indah Sdn Bhd",
    type: "Catering",
    categories: ["AYAM", "DAGING", "EGG", "SAYUR", "BUAH", "BAKERY", "KUIH", "FROZEN", "GROCERIES", "GAS", "EQUIPMENT_PACKAGING", "OTHER"],
    salesToDate: 61889,
    salesAsOf: "2026-09-18",
    costTargetPct: 0.35,
  },
  {
    id: "bara",
    name: "Bara Ikan Bakar",
    legalName: "Restoran Bara Ikan Bakar",
    type: "Restaurant",
    categories: ["AYAM", "IKAN", "SEAFOOD", "DAGING", "SAYUR", "BUAH", "BERAS", "FROZEN", "GROCERIES", "PASTE", "ICE", "EQUIPMENT_PACKAGING", "TRANSPORT", "OTHER"],
    salesToDate: 75993.24,
    salesAsOf: "2026-09-20",
    costTargetPct: 0.35,
  },
];

export type DailyEntry = {
  outletId: string;
  date: string;
  total: number;
  remarks: string | null;
  costs: Partial<Record<CategoryCode, number>>;
  /** Sales for that specific day. Only set on entries logged through the app — the
   * original sheets only ever gave a single running total, not a daily figure. */
  sales?: number;
};

export const DAILY_ENTRIES: DailyEntry[] = [
  // Signature Solution
  { outletId: "signature-solution", date: "2026-09-02", total: 137.5, remarks: null, costs: { GAS: 137.5 } },
  { outletId: "signature-solution", date: "2026-09-03", total: 980, remarks: null, costs: { BERAS: 980 } },
  { outletId: "signature-solution", date: "2026-09-04", total: 4922.23, remarks: null, costs: { AYAM: 886.08, DAGING: 2621.8, SAYUR: 562.15, BUAH: 12, FROZEN: 17, BAKERY: 75, GROCERIES: 748.2 } },
  { outletId: "signature-solution", date: "2026-09-05", total: 798.95, remarks: null, costs: { SAYUR: 355.2, BAKERY: 443.75 } },
  { outletId: "signature-solution", date: "2026-09-06", total: 885.12, remarks: null, costs: { AYAM: 885.12 } },
  { outletId: "signature-solution", date: "2026-09-07", total: 7773.13, remarks: null, costs: { AYAM: 2671.68, SAYUR: 386.95, BUAH: 2354.8, BAKERY: 1360, GROCERIES: 939.7, OTHER: 60 } },
  { outletId: "signature-solution", date: "2026-09-08", total: 2011.38, remarks: null, costs: { AYAM: 900.48, EGG: 312, SAYUR: 106.4, BUAH: 118, FROZEN: 34, GROCERIES: 348, GAS: 192.5 } },
  { outletId: "signature-solution", date: "2026-09-09", total: 1946.8, remarks: null, costs: { AYAM: 888, BUAH: 150.8, FROZEN: 70, BERAS: 748, GROCERIES: 90 } },
  { outletId: "signature-solution", date: "2026-09-10", total: 5966.48, remarks: "Big function this week — extra veg + delivery run", costs: { AYAM: 1881.83, EGG: 15.5, SAYUR: 1253.65, BUAH: 21, BAKERY: 83.75, GROCERIES: 1957.75, TRANSPORT: 753 } },
  { outletId: "signature-solution", date: "2026-09-11", total: 3245.3, remarks: null, costs: { AYAM: 868.8, DAGING: 880, EGG: 312, SAYUR: 480.1, BUAH: 95, GROCERIES: 609.4 } },
  { outletId: "signature-solution", date: "2026-09-12", total: 3345.58, remarks: null, costs: { AYAM: 900.48, EGG: 32, SAYUR: 396.7, BUAH: 35, FROZEN: 45, BERAS: 980, GROCERIES: 956.4 } },
  { outletId: "signature-solution", date: "2026-09-13", total: 876.48, remarks: null, costs: { AYAM: 876.48 } },
  { outletId: "signature-solution", date: "2026-09-14", total: 3320.88, remarks: null, costs: { AYAM: 2647.68, SAYUR: 341.2, BUAH: 60, FROZEN: 18, GROCERIES: 254 } },
  { outletId: "signature-solution", date: "2026-09-15", total: 5666.27, remarks: "New chafing dishes purchased", costs: { AYAM: 880.32, SAYUR: 490.35, BUAH: 601.8, GROCERIES: 810, EQUIPMENT_PACKAGING: 2858.8, OTHER: 25 } },
  { outletId: "signature-solution", date: "2026-09-16", total: 893.76, remarks: null, costs: { AYAM: 893.76 } },
  { outletId: "signature-solution", date: "2026-09-17", total: 3204.54, remarks: null, costs: { AYAM: 887.04, EGG: 312, BUAH: 1769.5, GROCERIES: 161, OTHER: 75 } },

  // Kasturi Indah
  { outletId: "kasturi-indah", date: "2026-09-01", total: 731.8, remarks: null, costs: { GROCERIES: 731.8 } },
  { outletId: "kasturi-indah", date: "2026-09-02", total: 275, remarks: null, costs: { GAS: 275 } },
  { outletId: "kasturi-indah", date: "2026-09-03", total: 6125.34, remarks: "Stocked up ahead of Merdeka orders", costs: { AYAM: 896.64, EGG: 78, SAYUR: 824, BUAH: 199.5, FROZEN: 62.4, BAKERY: 117, GROCERIES: 2372.8, OTHER: 1575 } },
  { outletId: "kasturi-indah", date: "2026-09-04", total: 6401.8, remarks: "New steamer trays", costs: { DAGING: 2200, SAYUR: 67.1, BUAH: 54, FROZEN: 31.2, GROCERIES: 191.5, EQUIPMENT_PACKAGING: 3858 } },
  { outletId: "kasturi-indah", date: "2026-09-05", total: 887.02, remarks: null, costs: { AYAM: 697.92, EGG: 77.5, BUAH: 22.1, BAKERY: 72, GROCERIES: 17.5 } },
  { outletId: "kasturi-indah", date: "2026-09-06", total: 232, remarks: null, costs: { GROCERIES: 232 } },
  { outletId: "kasturi-indah", date: "2026-09-07", total: 2405.45, remarks: null, costs: { EGG: 32, SAYUR: 114.25, BUAH: 1408.6, FROZEN: 15.6, KUIH: 680, GROCERIES: 155 } },
  { outletId: "kasturi-indah", date: "2026-09-08", total: 557.8, remarks: null, costs: { SAYUR: 30, GROCERIES: 252.8, GAS: 275 } },
  { outletId: "kasturi-indah", date: "2026-09-09", total: 740.3, remarks: null, costs: { SAYUR: 219.3, BUAH: 70, GROCERIES: 451 } },
  { outletId: "kasturi-indah", date: "2026-09-10", total: 1645.62, remarks: null, costs: { AYAM: 786.72, EGG: 46.5, SAYUR: 122.6, GROCERIES: 689.8 } },
  { outletId: "kasturi-indah", date: "2026-09-12", total: 1288.55, remarks: null, costs: { EGG: 111.5, SAYUR: 655.15, BUAH: 5.4, FROZEN: 88.2, GROCERIES: 428.3 } },
  { outletId: "kasturi-indah", date: "2026-09-14", total: 84, remarks: null, costs: { SAYUR: 20, GROCERIES: 64 } },
  { outletId: "kasturi-indah", date: "2026-09-15", total: 283.25, remarks: null, costs: { EGG: 31, SAYUR: 60.55, FROZEN: 31.2, GROCERIES: 160.5 } },
  { outletId: "kasturi-indah", date: "2026-09-17", total: 723.15, remarks: null, costs: { EGG: 15.5, SAYUR: 211.65, BUAH: 140, FROZEN: 151, GROCERIES: 205 } },
  { outletId: "kasturi-indah", date: "2026-09-18", total: 726, remarks: null, costs: { GROCERIES: 726 } },

  // Bara Ikan Bakar
  { outletId: "bara", date: "2026-09-01", total: 1657.5, remarks: null, costs: { SEAFOOD: 758, SAYUR: 74.4, BUAH: 423.4, FROZEN: 39, GROCERIES: 275.7, ICE: 8, OTHER: 79 } },
  { outletId: "bara", date: "2026-09-02", total: 202.6, remarks: null, costs: { FROZEN: 23.4, GROCERIES: 127.7, ICE: 12, OTHER: 39.5 } },
  { outletId: "bara", date: "2026-09-03", total: 3215, remarks: null, costs: { SEAFOOD: 591, IKAN: 706.8, SAYUR: 55.25, FROZEN: 411.7, BERAS: 1300, GROCERIES: 90.8, ICE: 8, EQUIPMENT_PACKAGING: 11.95, OTHER: 39.5 } },
  { outletId: "bara", date: "2026-09-04", total: 3605.9, remarks: "Weekend crowd — extra seafood order", costs: { SEAFOOD: 127.5, IKAN: 300, SAYUR: 66.6, BUAH: 2, FROZEN: 75, GROCERIES: 2707.4, ICE: 16, OTHER: 311.4 } },
  { outletId: "bara", date: "2026-09-05", total: 1552.4, remarks: null, costs: { SEAFOOD: 594, IKAN: 540, SAYUR: 111.5, GROCERIES: 36.2, ICE: 24, EQUIPMENT_PACKAGING: 41.4, OTHER: 205.3 } },
  { outletId: "bara", date: "2026-09-06", total: 921.31, remarks: null, costs: { ICE: 12, OTHER: 909.31 } },
  { outletId: "bara", date: "2026-09-07", total: 1846.5, remarks: null, costs: { SEAFOOD: 1275.6, IKAN: 126, SAYUR: 96.85, BUAH: 7.75, FROZEN: 18, GROCERIES: 214.3, ICE: 8, TRANSPORT: 10, OTHER: 90 } },
  { outletId: "bara", date: "2026-09-08", total: 857.85, remarks: null, costs: { SEAFOOD: 523.6, SAYUR: 71.15, BUAH: 2.4, GROCERIES: 3.8, ICE: 4, OTHER: 252.9 } },
  { outletId: "bara", date: "2026-09-09", total: 1399.55, remarks: null, costs: { SEAFOOD: 25, AYAM: 34, DAGING: 932, IKAN: 139, SAYUR: 62.05, BUAH: 2, GROCERIES: 79, ICE: 8, TRANSPORT: 17, EQUIPMENT_PACKAGING: 29.6, OTHER: 71.9 } },
  { outletId: "bara", date: "2026-09-10", total: 1251.1, remarks: null, costs: { SEAFOOD: 781.4, SAYUR: 49.3, FROZEN: 36, GROCERIES: 210.8, ICE: 12, TRANSPORT: 10, OTHER: 151.6 } },
  { outletId: "bara", date: "2026-09-11", total: 671.55, remarks: null, costs: { SAYUR: 111.9, BUAH: 4.25, GROCERIES: 241.8, ICE: 20, OTHER: 293.6 } },
  { outletId: "bara", date: "2026-09-12", total: 1097, remarks: null, costs: { SAYUR: 106.65, BUAH: 584.25, FROZEN: 18, GROCERIES: 113.7, ICE: 12, OTHER: 262.4 } },
  { outletId: "bara", date: "2026-09-13", total: 195.5, remarks: null, costs: { ICE: 12, OTHER: 183.5 } },
  { outletId: "bara", date: "2026-09-14", total: 2458.35, remarks: "Gas cylinder + big grocery restock", costs: { SEAFOOD: 390, SAYUR: 64.85, GROCERIES: 1939.3, ICE: 12, TRANSPORT: 12.7, OTHER: 39.5 } },
  { outletId: "bara", date: "2026-09-15", total: 637.9, remarks: null, costs: { SAYUR: 183, BUAH: 10, FROZEN: 24.1, GROCERIES: 247.1, ICE: 4, EQUIPMENT_PACKAGING: 146, OTHER: 23.7 } },
  { outletId: "bara", date: "2026-09-16", total: 265.5, remarks: null, costs: { ICE: 12, OTHER: 253.5 } },
  { outletId: "bara", date: "2026-09-17", total: 950.9, remarks: null, costs: { SEAFOOD: 150, IKAN: 292.8, SAYUR: 40.8, GROCERIES: 308.1, ICE: 16, TRANSPORT: 16, OTHER: 127.2 } },
  { outletId: "bara", date: "2026-09-18", total: 577.55, remarks: null, costs: { SAYUR: 110.45, GROCERIES: 161.6, ICE: 24, TRANSPORT: 22, OTHER: 259.5 } },
  { outletId: "bara", date: "2026-09-19", total: 905.97, remarks: null, costs: { SEAFOOD: 453.6, SAYUR: 66.95, BUAH: 6.5, GROCERIES: 122.8, ICE: 12, TRANSPORT: 10, EQUIPMENT_PACKAGING: 58.42, OTHER: 175.7 } },
];

export const TODAY = "2026-09-25";

export function getOutlet(id: string): Outlet | undefined {
  return OUTLETS.find((o) => o.id === id);
}

export function entriesForOutlet(id: string): DailyEntry[] {
  return DAILY_ENTRIES.filter((e) => e.outletId === id).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function totalCostForOutlet(id: string): number {
  return entriesForOutlet(id).reduce((sum, e) => sum + e.total, 0);
}

/**
 * The outlet's sales figure, kept current. Starts from the running total the original
 * sheet last reported, then adds sales from any entries logged through the app since.
 */
export function salesToDateForOutlet(id: string): number {
  const outlet = getOutlet(id);
  if (!outlet) return 0;
  const loggedSinceReport = entriesForOutlet(id)
    .filter((e) => e.date > outlet.salesAsOf && typeof e.sales === "number")
    .reduce((sum, e) => sum + (e.sales ?? 0), 0);
  return outlet.salesToDate + loggedSinceReport;
}

export function costPercentForOutlet(id: string): number {
  const sales = salesToDateForOutlet(id);
  if (sales === 0) return 0;
  return totalCostForOutlet(id) / sales;
}

/** Adds a new entry, or replaces the existing one for that outlet + date. */
export function upsertDailyEntry(entry: DailyEntry): void {
  const index = DAILY_ENTRIES.findIndex((e) => e.outletId === entry.outletId && e.date === entry.date);
  if (index >= 0) {
    DAILY_ENTRIES[index] = entry;
  } else {
    DAILY_ENTRIES.push(entry);
  }
}

export function categoryTotalsForOutlet(id: string): { code: CategoryCode; amount: number }[] {
  const totals = new Map<CategoryCode, number>();
  for (const entry of entriesForOutlet(id)) {
    for (const [code, amount] of Object.entries(entry.costs) as [CategoryCode, number][]) {
      totals.set(code, (totals.get(code) ?? 0) + amount);
    }
  }
  return Array.from(totals, ([code, amount]) => ({ code, amount })).sort((a, b) => b.amount - a.amount);
}

export function lastEntryDateForOutlet(id: string): string | null {
  const entries = entriesForOutlet(id);
  return entries.length > 0 ? entries[0].date : null;
}

export function daysSince(dateISO: string, fromISO: string = TODAY): number {
  const from = new Date(fromISO);
  const date = new Date(dateISO);
  return Math.round((from.getTime() - date.getTime()) / 86_400_000);
}

export function formatRM(amount: number): string {
  return `RM ${amount.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDateLong(dateISO: string): string {
  return new Date(dateISO).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateShort(dateISO: string): string {
  return new Date(dateISO).toLocaleDateString("en-MY", { day: "numeric", month: "short" });
}

export function companyTotals() {
  const totalSales = OUTLETS.reduce((sum, o) => sum + salesToDateForOutlet(o.id), 0);
  const totalCost = OUTLETS.reduce((sum, o) => sum + totalCostForOutlet(o.id), 0);
  return {
    totalSales,
    totalCost,
    costPercent: totalSales > 0 ? totalCost / totalSales : 0,
  };
}
