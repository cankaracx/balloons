"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/guard";
import { loadData, saveData } from "@/lib/store";
import type { SiteData } from "@/lib/types";

export async function saveSite(data: SiteData): Promise<SiteData> {
  await assertAdmin();
  await saveData(data);
  revalidatePath("/");
  return data;
}

export async function reloadSite(): Promise<SiteData> {
  return loadData();
}
