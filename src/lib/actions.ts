"use server";

import { revalidatePath } from "next/cache";
import { getOutlet, upsertDailyEntry, type CategoryCode } from "./sample-data";

export type SaveEntryInput = {
  outletId: string;
  date: string;
  sales: number;
  costs: Partial<Record<CategoryCode, number>>;
  remarks: string;
};

export type SaveEntryResult = { ok: true; total: number } | { ok: false; error: string };

export async function saveEntry(input: SaveEntryInput): Promise<SaveEntryResult> {
  const outlet = getOutlet(input.outletId);
  if (!outlet) {
    return { ok: false, error: "That outlet doesn't exist." };
  }
  if (!input.date) {
    return { ok: false, error: "Pick a date before saving." };
  }

  const costs: Partial<Record<CategoryCode, number>> = {};
  let total = 0;
  for (const [code, amount] of Object.entries(input.costs)) {
    if (typeof amount === "number" && amount > 0) {
      costs[code as CategoryCode] = amount;
      total += amount;
    }
  }

  if (total === 0 && !(input.sales > 0)) {
    return { ok: false, error: "Add today's sales or at least one cost before saving." };
  }

  upsertDailyEntry({
    outletId: input.outletId,
    date: input.date,
    total,
    costs,
    remarks: input.remarks.trim() ? input.remarks.trim() : null,
    sales: input.sales > 0 ? input.sales : undefined,
  });

  revalidatePath("/");
  revalidatePath(`/outlets/${input.outletId}`);

  return { ok: true, total };
}
