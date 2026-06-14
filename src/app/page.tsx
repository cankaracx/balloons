import { cookies } from "next/headers";
import { loadData } from "@/lib/store";
import Site from "@/components/public/Site";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await loadData();
  const cookieLang = cookies().get("lang")?.value;
  const initialLang: Locale = cookieLang === "tr" ? "tr" : "en";

  return <Site data={data} initialLang={initialLang} />;
}
