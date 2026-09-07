"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/guard";
import { loadData, saveData } from "@/lib/store";
import { assertValidSiteData } from "@/lib/validate-site";
import type { SiteData } from "@/lib/types";

export async function saveSite(data: unknown): Promise<SiteData> {
  await assertAdmin();
  assertValidSiteData(data);
  await saveData(data);
  revalidatePath("/");
  return data;
}

export async function reloadSite(): Promise<SiteData> {
  return loadData();
}
