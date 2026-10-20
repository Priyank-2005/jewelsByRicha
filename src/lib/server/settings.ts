import prisma from "@/lib/db";
import type { StoreSettings } from "@/types/shop";

export const DEFAULT_SETTINGS: StoreSettings = {
  freeShippingThreshold: 999,
  shippingFee: 79,
  codFee: 49,
  codEnabled: true,
  contactEmail: "hello@jewelsbyricha.in",
  contactPhone: "+91 90000 00000",
  businessHours: "Monday to Saturday, 10:00 a.m. to 6:00 p.m.",
  instagram: "jewelsbyricha",
  lowStockThreshold: 5,
};

export async function getSettings(): Promise<StoreSettings> {
  const row = await prisma.siteSettings.findUnique({ where: { key: "store" } });
  return { ...DEFAULT_SETTINGS, ...((row?.value as Partial<StoreSettings> | null) ?? {}) };
}

export async function saveSettings(next: StoreSettings) {
  await prisma.siteSettings.upsert({ where: { key: "store" }, update: { value: next as object }, create: { key: "store", value: next as object } });
  return next;
}
